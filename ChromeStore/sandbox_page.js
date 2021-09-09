(function(){

      // Promisified version of window.postMessage()
      function windowPostMessage(targetWindow, message, targetOrigin) {
        return new Promise((resolve, reject) => {
            // set event hander for postMessage from sandbox.html
            window.addEventListener('message', function(event) {
                resolve(event.data);
            }, {once:true});
            // send message to sandbox.html
            targetWindow.postMessage(message, targetOrigin);
        });
      }
    
      // listner for starter message from background.js
      chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
          const iframe = document.getElementById('theFrame');
          windowPostMessage(iframe.contentWindow, message, "*")
          .then((value)=>{
            sendResponse(value);
            if( ! ("error" in value) ) {
              window.open('about:blank', '_self').close();
            }
          });
          return true; // wait for response
      });
    
    })();



    
    
    