// Copyright (C) 2020 hashedtomato3@gmail.com
// License: MIT 

(async function(){

    // Promisified function of chrome extension APIs
    function chromeRuntimeSendMessage(message) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                resolve(response);
            });
        });
    }
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

    // 
    const content = document.getElementById("content");
    const msg = document.getElementById("message");
    const close = document.getElementById("close");
    try {
        // load common parameters
        const commom = await chromeRuntimeSendMessage({cmd:"get-common"});
        // load popup icon/menu data from local storage
        const data = await chromeStorageLocalGet(commom.storageKey);      
        // draw title
        const title = data[commom.storageKey].browserAction.title;
        document.getElementById("title").innerText = title;
        // on click of close button
        close.addEventListener("click", function(e){
            window.close();
        });
        // get url of current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const url = tab.url;
        // draw menu items
        const menu = data[commom.storageKey].browserAction.menu;
        menu.forEach( function(m, idx) {
            if( !("matches" in m) || m.matches.split(",").some((p) => {
                const ptn = new RegExp(p.replace(/([./?()*$+\[\]])/,"\\$1").replace(/[*]/,".*"));
                return ptn.test(url);
            }) ) {
                // add a button on popup menu
                const inp = document.createElement("input")
                inp.type = "button"
                inp.value = m.title;
                inp.name = idx;
                inp.onclick = async function(evt){
                    msg.innerHTML = "processing..."
                    const i = evt.target.name;
                    const message = {cmd:"click", idx:i}
                    const res = await chromeRuntimeSendMessage(message);
                    console.debug("message response:")
                    console.debug(res)
                    if("error" in res){
                        msg.innerHTML = `Error in ${res.source}:<br>${res.name}: ${res.message}`;
                    } else {
                        msg.innerHTML = "processing... finished."
                        window.close();
                    }
                    //window.close();
                }
                content.appendChild(inp)    
            }
        });
    } catch(ex){
        console.log(ex.message);
        msg.innerHTML = ex.message;
    }
})();
