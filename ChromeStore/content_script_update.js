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
    //console.log("loading content_script_update.js")
    await chromeRuntimeSendMessage({cmd:"setup"});
    alert("Setup OK")
})();
