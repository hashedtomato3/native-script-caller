
// common parameters
export const appName = "com.node.native_script_caller"
export const storageKey = appName + ".storage_key"

export const sendMessageToNativeHost = function(message, callback) {
    console.log("---- send message to native host ----")
    // send message to native host to get all the data (browser icon and injection codes, etc.)
    console.info("request to native host:")
    console.log(message)
    chrome.runtime.sendNativeMessage(appName, message, response => {
        console.info("response from native host: ");
        console.log(response);

        if (typeof response === "undefined") { // error occur in connecting to host
            // if native host not installed, show installation inscructions
            alert("<< Native Client might be NOT INSTALLED >>\n\nError occurs in connecting to native client:\n"+chrome.runtime.lastError.message);
            chrome.tabs.create({
                url: chrome.runtime.getURL("options.html#installation")
            });
        } else if( "error" in response ) { // error in native host
            alert("ERROR in Native Client:\n\n" + JSON.stringify(response, ["error","message","stack"], 4))
        } else {
            // if native host is installed, call callback with response
            callback(response);
        }
    });
  };
  