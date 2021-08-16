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
        // custom URL
        if( "customURL" in message ){
            location.href = message.customURL;
            console.log("customURL")
            sendResponse({result:"move to the url"});
            return false;
        }
        // custom HTML
        if( "customHTML" in message ){
            // set HTML
            customBlock.innerHTML = message.customHTML;
            console.log("customHTML")
            // set response button
            const btns = document.querySelectorAll(".response-onclick");
            btns.forEach((e)=>{
                    e.onclick = function() { 
                    console.log("click");
                    const html = ''+document.getElementsByTagName('html')[0].innerHTML+'';
                    sendResponse({result:"onclick", html:html}); 
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
