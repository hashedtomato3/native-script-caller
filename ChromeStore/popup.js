// Copyright (C) 2020 hashedtomato3@gmail.com
// License: MIT 

// load common parameters
import {appName, storageKey} from "./common.js"

// load popup icon/menu data from local storage
chrome.storage.local.get(storageKey, function(data){        
    const content = document.getElementById("content");
    const msg = document.getElementById("message");
    const close = document.getElementById("close");
    // draw title
    const title = data[storageKey].browserAction.title;
    document.getElementById("title").innerText = title;
    // on click of close button
    close.addEventListener("click", function(e){
        window.close();
    });
    // get url of current tab
    chrome.tabs.executeScript({
        code: 'location.href'
    }, 
    function(results){
        if( chrome.runtime.lastError){ // error if the page is "chrome://*", etc.
            console.log(chrome.runtime.lastError);
            msg.innerHTML = chrome.runtime.lastError.message;
            return;
        }
        const url = results[0];
        // draw menu items
        const menu = data[storageKey].browserAction.menu;
        menu.forEach(function(m, idx) {
            if( !("matches" in m) || m.matches.split(",").some((p) => {
                const ptn = new RegExp(p.replace(/([./?()*$+\[\]])/,"\\$1").replace(/[*]/,".*"));
                //console.log(ptn)
                //alert(ptn)
                return ptn.test(url);
            }) ) {
                // add a button on popup menu
                const inp = document.createElement("input")
                inp.type = "button"
                inp.value = m.title;
                inp.name = idx;
                inp.onclick = function(evt){
                    msg.innerHTML = "processing..."
                    console.info("sending message...")
                    const i = evt.target.name;
                    const message = {cmd:"click", idx:i}
                    chrome.runtime.sendMessage(message, function(res){
                        console.info("message response:")
                        console.log(res)
                        if(res.error){
                            msg.innerHTML = `Error in native or injection code:<br>${res.error}: ${res.message}`;
                        } else {
                            msg.innerHTML = "processing... finished."
                            window.close();
                        }
                    });
                    //window.close();
                }
                content.appendChild(inp)    
            }
        });
    });

});
