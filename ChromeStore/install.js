// Copyright (C) 2020 hashedtomato3@gmail.com
// License: MIT 

// import common parameters
import {appName, storageKey} from "./common.js"

{
  // set title
  document.getElementById("extName").innerHTML = chrome.runtime.getManifest().name;
  
  // set manifest download link
  const manifest = {
    "name": "com.node.script_caller",
    "description": "Customizable menu to run user scripts at browser and/or local PC.",
    "path": "host.bat",
    "type": "stdio",
    "allowed_origins": [
      `chrome-extension://${chrome.runtime.id}/`,
    ]
  };
  const manifestJson = JSON.stringify(manifest, null, '\t');
  const blob = new Blob([manifestJson], {
        type: 'text/plain',
  });
  const downloadLink = document.getElementById('manifest_link');
  downloadLink.href = URL.createObjectURL(blob);


  // on click of check instalation button
  document.getElementById("check").addEventListener("click", function(e){
    chrome.runtime.sendNativeMessage(appName, {cmd:"get-data"}, response => {
      console.info("response:");
      console.info(response);
      if (typeof response === "undefined") { // error occur in connecting to host
        alert("<< NOT INSTALLED >>\n\n"+chrome.runtime.lastError.message);
      } else if( "error" in response ) { // error in native host
        alert("<< ERROR in Native Client >>\n\n"+JSON.stringify(response, ["error","message"], 4));
      } else {
        alert(`<< INSTALLATION OK >>\n\nNative client is installed in ${response.cwd}.`)
      }
    });
  });

  // set links
  document.getElementById("options_page").href = chrome.runtime.getURL("options.html");
  document.getElementById("store_page").href= "https://chrome.google.com/webstore/detail/"+chrome.runtime.id;
}
