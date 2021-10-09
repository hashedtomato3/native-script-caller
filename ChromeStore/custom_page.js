// Copyright (C) 2020 hashedtomato3@gmail.com
// License: MIT 


(async function(){


    //
    const customBlock = document.getElementById("custom_block");
    console.log("add listner")

    // listner for starter message from background.js
    chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
        console.log("receive message")
        console.log(message)
        // custom HTML
        if( "html" in message ){
            // set HTML
            customBlock.innerHTML = message.html;
            console.log("customHTML")
            // set response button
            const btns = document.querySelectorAll("[data-action]");
            console.log(btns)
            btns.forEach((e)=>{
                e.onclick = function(evt) {
                        console.log("click");
                        if( evt.target.form ){
                            const fd = new FormData(evt.target.form);
                            const fdarr = Array.from(fd.entries());
                            sendResponse({result:"onclick", form:fdarr, action:evt.target.dataset['action']});
                        } else {
                            sendResponse({result:"onclick", form:[]});
                        }
                        window.open('about:blank', '_self').close(); // close window
                }
            });
            if( btns.length > 0 ){ // only if the button exists
                return true; // for sender to wait response
            }
        }
        // others
        sendResponse({result:"no custom HTML or no data-action attribute"});
    });

    try {
        //location.href = "https://www.google.com"
    } catch(ex){
        console.log(ex.message);
        msg.innerHTML = ex.message;
    }
})();
