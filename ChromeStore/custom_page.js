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
        if( "customHTML" in message ){
            // set HTML
            customBlock.innerHTML = message.customHTML;
            console.log("customHTML")
            // set response button
            const btns = document.querySelectorAll(".send-form-button");
            btns.forEach((e)=>{
                e.onclick = function(evt) {
                        console.log("click");
                        if( evt.target.form ){
                            const fd = new FormData(evt.target.form);
                            const fdarr = Array.from(fd.entries());
                            sendResponse({result:"onclick", formData:fdarr});
                        } else {
                            sendResponse({result:"onclick", formData:[]});
                        }
                        window.open('about:blank', '_self').close();
                }
            });
            if( btns.length > 0 ){ // only if the button exists
                return true; // for sender to wait response
            }
        }
        // others
        sendResponse({result:"nothing done"});
    });

    try {
        //location.href = "https://www.google.com"
    } catch(ex){
        console.log(ex.message);
        msg.innerHTML = ex.message;
    }
})();
