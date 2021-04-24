import {appName, storageKey, sendMessageToNativeHost} from "./common.js"

var codeEditor;

var app = new Vue({
    el: '#app',
    data: {
      menuActiveAbout:false,
      menuActiveInstallation:false,
      menuActiveSetup:false,
      menuActiveManual:false,
      menuActiveLink:false,
      isOpen: -1,
      ComponentModalActive:-1,
      allData:null,
      extensionName: chrome.runtime.getManifest().name,
      manifestDownloadLink: null,
      storeLink : "https://chrome.google.com/webstore/detail/"+chrome.runtime.id,
    },
    computed: {
    },
    methods: {
        isComponentModalActive: function(index){
            return this.ComponentModalActive === 0;
        },
        onclick_save: function() {
            sendMessageToNativeHost( {cmd: "save-data", data:app.allData}, function(resp){
                chrome.runtime.sendMessage({cmd:"setup"});
            })
        },
        onclick_load: function() {
            sendMessageToNativeHost( {cmd: "get-data" }, function(resp){
                app.allData = resp;
            })
        },
        onenter_item: function(index){
            const code = app.allData.browserAction.menu[index].nativeScript;
            const textarea = document.querySelector(".textarea");
            //console.log(textarea);
            textarea.value = code;
            codeEditor = CodeMirror.fromTextArea(textarea, {
                mode: "javascript",
                lineNumbers: true,
                styleActiveLine:true,
                matchBrackets:true,
                autoCloseBrackets: true,
                gutters: ["CodeMirror-lint-markers"],
                lint: {esversion:6},
            });
        },
        onclick_open: function(index){
            app.ComponentModalActive = index;
        },
        onclick_close: function(index){
            const code = codeEditor.getDoc().getValue();
            app.allData.browserAction.menu[index].nativeScript = code;
            app.ComponentModalActive = -1;
        },
        onclick_setup: function(){
            chrome.runtime.sendMessage({cmd:"setup"});
        },
        onclick_checkinstallation: function(){
            sendMessageToNativeHost({cmd:"get-data"}, response => {
                alert(`<< INSTALLATION OK >>\n\nNative client is installed in ${response.cwd}.`)
            });           
        },
        onclick_add: function() {
            app.allData.browserAction.menu.push({title:"New Title", matches:""});
        },
        onclick_delete: function(evt) {
            let i = evt.target.closest("div[index]").getAttribute("index");
            app.allData.browserAction.menu.splice(i, 1);
            app.ComponentModalActive = -1;
        },

    }
});

// set manifest download link
const manifest = {
    "name": appName,
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
app.manifestDownloadLink = URL.createObjectURL(blob);

// short cut to installation section
if( location.hash === "#installation"){
    app.menuActiveInstallation = true;
}
