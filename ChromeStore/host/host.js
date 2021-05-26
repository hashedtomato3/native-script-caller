// Copyright (C) 2020 hashedtomato3@gmail.com
// License: MIT 

// =================================================================
// ======= Native Message Protocol Handling ========================
// =================================================================

const fs = require('fs');
const execFile = require('child_process').execFile;


// get a message and call handleMessage()
process.stdin.on('readable', () => {
  var input = []
  var chunk
  while (chunk = process.stdin.read()) {
    input.push(chunk)
  }
  input = Buffer.concat(input)

  var msgLen = input.readUInt32LE(0)
  var dataLen = msgLen + 4

  if (input.length >= dataLen) {
    var content = input.slice(4, dataLen)
    var json = JSON.parse(content.toString())
    handleMessage(json)
  }
})

// send a message to the extension
function sendMessage(msg) {
  var buffer = Buffer.from(JSON.stringify(msg))
  var header = Buffer.alloc(4)
  header.writeUInt32LE(buffer.length, 0)
  var data = Buffer.concat([header, buffer])
  process.stdout.write(data)
}


// =================================================================
// ======= User Functions ==========================================
// =================================================================

// on error
process.on('uncaughtException', (err) => {
  sendMessage({uncaughtException: err.toString()})
})


// handling message msg from browser extension
function handleMessage(msg) {
  try {
    // load JSON file
    let settings = require("./customize/browserAction.json")

    // update json object if it is old-style
    if( ! (settings.menu.some((e)=>("trigger" in e))) ) { // JSON is old-style
      settings.menu.forEach((v, i, a) => {
              v.trigger = {};
              v.trigger.menu = { urlFilter: v.matches, removal: v.removal };
              v.stage = [];
              v.stage[0] = {};
              v.stage[0].type = "nativeScript"
              v.stage[0].nativeScript = { nativeScript: v.nativeScript }
              delete v.nativeScript;
              delete v.removal;
              delete v.matches;    
      });
      // save to browserAction.json file      
      let json = JSON.stringify(settings, null, 4);
      fs.writeFile("./customize/browserAction.json", json, 'utf8', (err) => {
        if(err) { sendMessage({error:err.name, message:err.message, stack:err.stack}) }
      });
    }
    
    if( msg.cmd === "get-data") { // config data requested
      let response = {}
      // read icon image file and convert it to data URL
      if( settings.icon && settings.icon.file ) {
        let mime = 'image/png'; 
        let encoding = "base64";
        let data = fs.readFileSync(settings.icon.file).toString(encoding); 
        let url = 'data:' + mime + ';' + encoding + ',' + data; 
        settings.icon.dataURL = url;
      }
      // set settings to response
      response.settings = settings;
      // set CWD
      response.cwd = __dirname;//process.cwd;
      // set host.js
      response.host_js = fs.readFileSync("./host.js", {encoding:"utf8"});
      // send response
      sendMessage(response);

    } else if(msg.cmd === "save-data") { 
      let data = msg.data;
      
      // // save icon data URL to icon image file
      /*  
      let d = data.settings.icon.dataURL.split(',')[1]; 
      let buf = Buffer.from(d, 'base64'); 
      let filename = "./" + data.settings.icon.file
      fs.writeFile(filename, buf, (err) => {
        if(err) { sendMessage({error:err.name, message:err.message, stack:err.stack}) }
      });
      */
      //delete data.settings.icon.dataURL;
      
      // save browserAction.json file   
      let json = JSON.stringify(data.settings, null, 4);
      fs.writeFile("./customize/browserAction.json", json, 'utf8', (err) => {
        if(err) { sendMessage({error:err.name, message:err.message, stack:err.stack}) }
      });
      // send back message
      sendMessage({result:"ok"});
      
    } else if(msg.cmd === "click") { // menu item clicked
      // load native code
      const code = msg.nativeScript;
      let r = null
      // execute native code
      if( /^\s*$/.test(code) ){
        r = "no native script"
      } else {
        //r = require(filename).main(msg.injectionCodeResults);
        eval(code);
        r = NativeScriptFunction(msg.info);
      }
      sendMessage({response: r, code:code})
    } else {
    }
  } catch(err) {
    sendMessage({error:true, name:err.name, message:err.message, stack:err.stack, source:"native script"})
  }
}
