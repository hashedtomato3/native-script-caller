// Copyright (C) 2020 hashedtomato3@gmail.com
// License: MIT 

// common parameters
const common = {};
common.appName = "com.node.native_script_caller"
common.storageKey = common.appName + ".storage_key"

// Promisified function of Chrome extension APIs
function chromeStorageLocalGet(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(items);
        });
    });
}
function chromeStorageLocalSet(items) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(items, () => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(null);
        });
    });
}
function chromeTabsSendMessage(tabId, message) {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, message, {}, (response) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(response);
        });
    });
}

// send to native host
function sendMessageToNativeHost(message, showNativeConnectionError = true) {
    console.debug("Start Native Script:")
    console.debug(message)
    return new Promise((resolve, reject) => {
        // send message to native host
        chrome.runtime.sendNativeMessage(common.appName, message, async (response) => {
            console.debug("End Native Script: ");
            console.debug(response?.response);
            
            // if error occur in connecting to host, show installation inscruction page
            if (typeof response === "undefined" && showNativeConnectionError ) {
                const errmes = chrome.runtime.lastError ? chrome.runtime.lastError.message : "";
                const url = chrome.runtime.getURL("vue/dist/index.html")+"?errmes="+encodeURIComponent(errmes)+"#installation";
                const tab = await chrome.tabs.create({url: url});
            }
            // if error occur
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return reject(chrome.runtime.lastError);
            }
            // if error in native code
            if( response && "error" in response ) {
                response.source = "native script"
                console.error(response);
                return reject(response);
            }
            // if no error, call callback with response
            resolve(response);
        });
    });
}


// on installation of this extension, load from native host and setup menu
chrome.runtime.onInstalled.addListener((details)=>{
    if( details.reason === "install"){ // on install
        setupAll();
    } else if( details.reason === "update"){ // on install
        setupAll(false);
    }
});

// on startup of browser, setup menu
chrome.runtime.onStartup.addListener(createMenu);

// on message from options page or popup menu
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if( message.cmd == "setup" ) { // on click of setup botton in option page
        // setup browser action icon and menu
        setupAll()
        .then((value)=>sendResponse(value))
        .catch((err)=>{console.log(err); sendResponse({error:err.error, name:err.name, message:err.message, stack:err.stack, source:err.source})});
    } else if( message.cmd === "click" ){ // on click of menu item
        actionForClickMenuItem(message)
        .then((value)=>sendResponse(value))
        .catch((err)=>{console.log(err); sendResponse({error:err.error, name:err.name, message:err.message, stack:err.stack, source:err.source})});
    } else if( message.cmd === "get-common" ){ // 
        sendResponse(common);
    } else if( message.cmd === "send-native-message" ){
        sendMessageToNativeHost(message.msg)
        .then((value)=>sendResponse(value))
        .catch((err)=>{console.log(err); sendResponse({error:err.error, name:err.name, message:err.message, stack:err.stack, source:err.source})});
    }    
    return true; // this is nessesary for response to caller page
});

// on clicking context menu
chrome.contextMenus.onClicked.addListener(function(info, tab){
    //console.debug(info)
    if( /^menuItem_[0-9]+$/.test(info.menuItemId) ) {
        const id = parseInt(info.menuItemId.slice(9), 10);
        //console.debug("sending message for " + id)
        actionForClickMenuItem({cmd:"click", idx:id})
        .catch(err => console.error(err));
    }
});

// setup browser action icon and menu
async function setupAll(showNativeConnectionError = true) {
    // get info from Native Host
    let response = await sendMessageToNativeHost({cmd: "get-data"}, showNativeConnectionError);
    // check and update host/host.js
    const resp = await fetch("/host/host.js");
    const host_js = await resp.text();
    if( response.host_js !== host_js ) { // host.js is old
        console.debug("host js differ. Updating it...")
        const nativeScript = `
            function NativeScriptFunction(info){
                const { writeFileSync, renameSync } = require("fs");
                renameSync("./host.js", "./host.js.old");
                writeFileSync("./host.js", info.host_js);
            }
        `
        if( "browserAction" in response ) { // old-style browserAction.json and host.js
            console.log("browserAction.json is old style.")
            // save update program in native host
            let browserAction = {};
            browserAction.icon = response.browserAction.icon;
            browserAction.menu = [ {nativeScript:nativeScript } ];
            await sendMessageToNativeHost({cmd: "save-data", data:{browserAction:browserAction}});
            // update host.js
            await sendMessageToNativeHost({cmd: "click", idx:0, nativeScript:nativeScript, info:{host_js:host_js}});
            // save original data
            await sendMessageToNativeHost({cmd: "save-data", data:{settings:response.browserAction}});
        } else {
            // update host.js
            await sendMessageToNativeHost({cmd: "click", nativeScript:nativeScript, info:{host_js:host_js}});
        }
        // get data again using updated host.js
        response = await sendMessageToNativeHost({cmd: "get-data"}, showNativeConnectionError);        
    }

    // store to storage
    const item = {[common.storageKey] : response};
    const r = await chromeStorageLocalSet(item);
    console.debug("saved to storage:")
    console.debug(item)
    // create menu
    await createMenu();
    return {};
}

// setup browser action icon
async function createMenu() {
    // load menu info from storage
    const data = await chromeStorageLocalGet(common.storageKey);
    console.debug("load menu info from local storage:")
    console.debug(data[common.storageKey].settings);
    // set title of browser action
    let title = data[common.storageKey].settings.title;
    chrome.action.setTitle({title:title});
    // set icon image
    let icon = data[common.storageKey].settings.icon;
    if( icon ){
        // convert data URL to ImageData
        var byteString = atob( icon.dataURL.split( "," )[1] ) ;
        var mimeType = icon.dataURL.match( /(:)([a-z\/]+)(;)/ )[2] ;
        for( var i=0, l=byteString.length, content=new Uint8Array( l ); l>i; i++ ) {
            content[i] = byteString.charCodeAt( i ) ;
        }
        var blob = new Blob( [ content ], {type: mimeType});
        const imageBitmap = await createImageBitmap(blob);
        const canvas = new OffscreenCanvas(16, 16);
        let context = canvas.getContext('2d');
        context.drawImage(imageBitmap, 0, 0, 16, 16);
        let ic = context.getImageData(0, 0, 16, 16);
        // set icon image
        chrome.action.setIcon({imageData:ic})        
    }

    // add top context menu
    chrome.contextMenus.removeAll();
    var parentId = chrome.contextMenus.create({
        "id" : "menuItem_top",
        "title" : title,
        "type" : "normal",
        "contexts" : ["all"],
    });
    // add child contxt menus
    const menu = data[common.storageKey].settings.menu;
    menu.forEach(function(m, idx) {
        // add a child menu item
        chrome.contextMenus.create({
            "id" : "menuItem_" + idx,
            "title" : m.title,
            "type" : "normal",
            "contexts" : ["all"],
            "documentUrlPatterns" : (m.trigger.menu.urlFilter || "<all_urls>").split(","),
            "parentId" : parentId
        });
    });
    console.debug("menu setup finished.")
    return {};
}

// on clicking menu item
async function actionForClickMenuItem(message) {
    console.debug("---- menu item clicked --------")
    // load injection code from local storage
    const storageData = await chromeStorageLocalGet(common.storageKey);
    //console.debug(storageData)
    // injection code
    function injectionCode(){
        function getPageHTML(removal) {
            function document2html(doc, removal) {
                const d = doc.cloneNode(true);
                if(removal){
                    removal.split(";").forEach(r => {
                        d.querySelectorAll(r).forEach(function(e){ e.remove(); });
                    });    
                }
                //console.log(doc.querySelectorAll("script").length)
                return ''+d.getElementsByTagName('html')[0].innerHTML+'';
            }
                
            try {
                var url = location.href;
                var html = document2html(document, removal);
                var title = document.title;
                var frames = [];
                document.querySelectorAll("frame").forEach(function(e){
                    //console.log(e.id);
                    const d = e.contentDocument;
                    //console.log(d);
                    if(d) {
                        let frame = {};
                        frame.html = document2html(d, removal);
                        frame.name = e.getAttribute("name");
                        frame.id = e.id;
                        frames.push(frame);
                    }
                })
                const msg = {title:title, url:url, html:html, frames:frames};
                console.debug("message length: "+ JSON.stringify(msg).length);
                //console.log(msg);
                return msg;
            } catch(err) {
                console.error(err);
                // when error, return object should have "error" key                
                return {error:true, name:err.name, message:err.message, stack:err.stack, source:"injection code"}
//                return {error:err, source:"injection code"}
            }
        }
        // listener
        function injectionListener(message, sender, sendResponse){
            // remove self
            chrome.runtime.onMessage.removeListener(injectionListener);
            // execute and response
            const pageInfo = getPageHTML(message.removal);
            sendResponse(pageInfo);
        }
        // add message listener
        chrome.runtime.onMessage.addListener(injectionListener);
    }
    // get active tab ID
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const tabId = tabs[0].id;
    // execute injection code (set message listener)
    const r = await chrome.scripting.executeScript({
        target: {tabId: tabId, allFrames:false},
        function:injectionCode
    });
    // send message to injection code
    const removal = storageData[common.storageKey].settings.menu[message.idx].removal;
    const injectionCodeResults = await chromeTabsSendMessage(tabId, {removal:removal});
    console.debug("return value from injection code:");
    console.debug(injectionCodeResults);
    // check error in injection code
    if(injectionCodeResults.error){
        throw injectionCodeResults; // return error
    }

    // execute native or sandbox script
    let results = false;
    let script = storageData[common.storageKey].settings.menu[message.idx].stage[0].nativeScript.nativeScript;
    let scriptType = storageData[common.storageKey].settings.menu[message.idx].stage[0].type;
    console.debug("----- User Script -------------");
    //console.info("send to script & custom")
    //console.log({script, info:injectionCodeResults, scriptType});
    results = await executeScriptAndCustom(script, injectionCodeResults, scriptType);
    //console.info("return from script & custom")
    //console.log(results)

    // execute action native or sandbox script
    let next_action = results.action;
    while(next_action) {
        const stage = storageData[common.storageKey].settings.menu[message.idx].stage.slice(1).find(e => e.actionName === next_action);
        console.debug(`----- Action Function: ${stage.actionName} ---------`);
        //console.log(stage)
        let script = stage.nativeScript.nativeScript;
        scriptType = stage.type;
        results = JSON.parse(JSON.stringify(results)); // deep copy
        const info = {form:results.customResults?.form, data:results.response?.data}
        //console.info("send to action function & custom")
        //console.log({script, info, scriptType});
        results = await executeScriptAndCustom(script, info, scriptType);
        //console.info("return from action function & custom")
        //console.log(results)
        next_action = results.action;
    }

    return results;
}

async function executeScriptAndCustom(script, info, scriptType = "nativeScript"){
    // execute Native/Sanbox script
    let results = {};
    if( scriptType == "nativeScript" ){
        let msg = {cmd:"click", nativeScript:script, info:info};
        results = await sendMessageToNativeHost(msg);
    } else if( scriptType == "browserScript" ){
        let msg = {script:script, info:info};
        results = await executeSandboxScript(msg);
    }

    // execute custom Page
    if( "html" in results.response ) {
        console.debug("Processing Custom HTML")
        // create tab for custom page
        const url = chrome.runtime.getURL("custom_page.html")
        const tab = await chrome.tabs.create({url: url});
        //console.log(tab)
        // wait for load page
        for(let i=0; i<30; i++){
            await new Promise(resolve => setTimeout(resolve, 200));
            let [t] = await chrome.tabs.query({ active: true, currentWindow: true });
            //console.log(t.status)
            if( t.status === "complete" ) {
                //console.log("break waiting at: "+i)
                break;
            }
        }
        // send message to custom page tab
        const customPageResults = await chromeTabsSendMessage(tab.id, results.response);
        console.debug("return value from custom page:");
        console.debug(customPageResults);
        // check error in custom page
        if(customPageResults.error){
            throw customPageResults; // return error
        }
        results.customResults = customPageResults; // add costom results
        if( "action" in results.customResults ) { // if data-action button is clicked
            results.action = results.customResults.action; // set action
        }
    } else if( "action" in results.response ) { // if user script or action function returns action
        results.action = results.response.action;
    }

    return results; // = {action:<nextActionName>, response:<returnValueOfScript>, customResults:<returnValueOfCustomForm>}
}

async function executeSandboxScript(msg){ // msg = { script:<script>, info:<info> }
        //console.info("creating tab for sandbox page")
        // create tab of sandbox page
        const url = chrome.runtime.getURL("sandbox_page.html")
        const tab = await chrome.tabs.create({url: url});
        //console.log(tab)
        // wait for load page
        for(let i=0; i<30; i++){
            await new Promise(resolve => setTimeout(resolve, 200));
            let [t] = await chrome.tabs.query({ active: true, currentWindow: true });
            //console.log(t.status)
            if( t.status === "complete" ) {
                //console.log("break waiting at: "+i)
                break;
            }
        }
        // send starter message to sandbox_page
        console.debug("Start Sandbox Script:")
        console.debug(msg);
        const sandboxPageResults = await chromeTabsSendMessage(tab.id, msg);
        console.debug("End Sandbox Script:");
        console.debug(sandboxPageResults?.response);
        // check error in injection code
        if(sandboxPageResults.error){
            throw sandboxPageResults; // return error
        }
        return sandboxPageResults; // { response:<returnValue> }
 }
