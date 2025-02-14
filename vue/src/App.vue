<template>
  <div id="app" class="container" style="height:100%">

    <div style="xxbackground-color:red;">
      <b-navbar class="hero is-link" fixed-top="true">
        <template #brand>
          <b-navbar-item href="#">
            <p class="title is-4">Chrome Extension [{{extensionName}}]</p>
          </b-navbar-item>
        </template>
      </b-navbar>

      <div style="display:flex; height:90%">

        <b-menu class="box" style="min-width:23ex">
          <b-menu-list label="Menu">
            <b-menu-item icon="account" id="abcde" label="About" v-model="menuActiveAbout"></b-menu-item>
            <b-menu-item icon="account" label="Installation" v-model="menuActiveInstallation"></b-menu-item>
            <b-menu-item icon="account" label="Setup" v-model="menuActiveSetup"></b-menu-item>
            <b-menu-item icon="account" label="Manual" v-model="menuActiveManual"></b-menu-item>
            <b-menu-item icon="account" label="Link" v-model="menuActiveLink"></b-menu-item>
          </b-menu-list>
        </b-menu>

        <div class="fr_main block" style="margin: 3ex; height:100%; width:70vw">

          <!-- About -->
          <div v-if="menuActiveAbout">
            <p class="subtitle">About</p>
            <p>
              Customizable MENU to run user native/browser javascript and custom pages<br><br>

              This extension provides a customizable menu to run user scripts (native or browser Javascript) and arbitary loccal PC programs.<br>
              User script can include custom page HTML to display messages or input forms.<br>
              Action functions for the input forms can be written in natieve or browser Javascript.<br><br>
            </p>

          </div>

          <!-- Installation -->
          <div v-if="menuActiveInstallation" style="height:100%">
            <p class="subtitle is-4">Installation</p>

            <p>This extension requires installing <b>the native client</b> in the local Windows PC.</p>
            <br>

            <p class="subtitle is-5">Check installation status</p>
            <span style="width:10ex"></span>
            <b-button type="is-primary" outlined v-on:click="onclick_checkinstallation" style="margin:0 3ex">check installation</b-button>
            <br><br>
        
            <p class="subtitle is-5">How to install Native Client</p>
            <div>
              <ol style="margin: 0 4ex">
                <li>Download the following ZIP file and extract it in a local folder.<br>
                     -> the folder named "host" will be created.
                  <ul>
                    <li><a id="host_link" v-bind:href="hostDownloadLink" download="host.zip">host.zip</a></li>
                  </ul>
                </li>
                <li>Install Node.js. Click <a href="https://nodejs.org/" target="_blank">here</a> to download installer.</li>
                <li>Double-click <code>install.bat</code> in the folder "host" to install native client.</li>
                <li>To uninstall the native client, double-click <code>uninstall.bat</code>.</li>
              </ol>
            </div>
          </div>

          <!-- Setup -->
          <div v-if="menuActiveSetup" style="height:100%">

            <div class="level">
              <div class="level-left">
                <p class="subtitle">Setup of menu and user scripts</p>
              </div>
              <div class="level-right">              
                <button class="button is-primary" v-on:click="onclick_load">Load</button>
                <span style="width:1ex"> </span>
                <button class="button is-primary" v-on:click="onclick_save">Save</button>
              </div>
            </div>

            <div v-if="allData" style="min-width:640px; height:100%" >
              <b-field label="Title">
                <input class="input" type="text" v-model="allData.settings.title" :title="manualData[0].description">
              </b-field>              
              <b-field label="Icon">
                <input class="input" type="text" v-model="allData.settings.icon.file" :title="manualData[1].description">
              </b-field>
              <div style="display:flex; margin:0px">
                  <b-field label="Menu Items"></b-field>                      
                  <b-button type="is-primary" inverted v-on:click="onclick_add" title="Add Item">
                      <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M17,13H13V17H11V13H7V11H11V7H13V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
                      </svg>
                  </b-button>    
              </div>

              <div style="margin:0px; padding:0px; height:100%;width:100%">
                <MenuItem 
                    v-for="(menu, index) of allData.settings.menu"
                    :key="index"
                    :index="index"
                    v-on:delete="allData.settings.menu.splice(index, 1);"
                    v-bind:menu="allData.settings.menu[index]"  :manualData="manualData" :testvar.sync="testvar"
                ></MenuItem>
              </div>
            </div>
          </div>

          <!-- Manual -->
          <div v-if="menuActiveManual" class="is-fullscreen">
            <p class="subtitle">Manual</p>
   
            <p class="subtitle is-8">Instructions of Setup page</p>
            <b-table :data="manualData" :columns="manualColumns" bordered="true" xxsticky-header="true"></b-table>

            <br><br>
            <p class="subtitle is-8">Tutorial of Custom Page and Action function</p>

            <p>User script and action functions can return HTML of custom page as following example.
            The custom page will be shown in new tab when the function returns.</p>
            
            <img src="/customPage1.png" width="900" border="1" style="margin:10px">

            <p>
            As the above example, action functions can be attatched to the forms in the custom page, 
            by specifying the action name of the action function to the attribute "data-action" 
            in the button element.            
            The action function will be executed when user click the button.
            </p>

            <br>
            <p>The following is an example of definition of the action function.
            The argument <code>info</code> includes the form data from the custom page.
            </p>

            <img src="/customPage2.png" width="900" border="1"  style="margin:10px">
            
          
            <br><br>
            <p class="subtitle is-8">Debug</p>
  
            Select the blue link of "background.html" next to Inspect views
            in the Chrome extension management page,
            to open the Chrome DevTools panel for the background script.
            Most of log messages from this extension appear in the Console tab.
            See <a href="https://developer.chrome.com/apps/tut_debugging">here.</a>

            <br>
            <br>
            <p class="subtitle is-8">Where setup info stored</p>

            Menu specification and Injection and Native scripts are stored in
            <code>customize/browserAction.json</code> file
            in native client "host" folder.

            Note that the host folder path is shown by clicking check installation button in Installation section.

            <br>
            <br>
            <p class="subtitle is-8">Update Setup</p>
            After modificaion of the above <code>customize/*</code> files,
            click the following button or link to refresh setup.
            <br>
            <b-button class="button is-primary" outlined v-on:click="onclick_setup" style="margin:0 3ex">Update Setup</b-button><br>
            <a href="https://www.google.com/search?q=+Chrome+Store+Native+Script+Caller" style="margin:0 3ex">Link</a>
            <br><br><br>
          </div>

          <!-- Link -->
          <div v-if="menuActiveLink">
            <p class="subtitle">Links</p>
            <ul>
              <li><a id="store_page" v-bind:href="storeLink" target="_blank">Chrome Web Store Page</a> </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import MenuItem from './components/MenuItem.vue'
  //import Test from './components/Test.vue'
  import JSZip from 'jszip';
 
  
  // Promisified version of chrome extension APIs
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
  

  export default {
      name: 'App',
      data: function() {
        return {
                menuActiveAbout:false,
                menuActiveInstallation:false,
                menuActiveSetup:false,
                menuActiveManual:false,
                menuActiveLink:false,
                allData:null,
                extensionName: chrome.runtime.getManifest().name,
                zipDownloadLink: null,
                storeLink : "https://chrome.google.com/webstore/detail/"+chrome.runtime.id,
                manualData: [
                    { 'item': 'title', 'description': 'Title of the icon menu'},
                    { 'item': 'icon', 'description': 'Relative path name of icon image file from "host" folder. It should be 16x16 PNG file.'},
                    { 'item': 'Menu Items', 'description': 'List of  menu items'},

{ 'item': 'menu item: Title', 'description': 'Title of the menu item'},
                    { 'item': 'menu item: URL Filter', 'description': '(optional) Comma-separated list of URL pattern strings.  The menu item is shown only if one of the string matches the URL of active page. Refer <a href="https://developer.chrome.com/docs/extensions/mv3/match_patterns/">pattern format.</a>'},
                    { 'item': 'menu item: Removal Elements', 'description': '	(Optional) Semicolon-separated CSS selectors. The elements selected by the selectors are excluded in HTML text sent to the native client.'},
                    { 'item': 'menu item: User Script', 'description': 'Native script: User script is executed by NodeJS in the local PC<br>Browser script: User script is executed in sandbox in the web browser'},
                    { 'item': 'menu item: (script)', 'description': `
                      User javascript code that is executed by Node.js or the web browser.
                      This code must contain only the definition of <code>function ScriptFunction(info)</code>, 
                      which is executed when the menu item is clicked.
                      <code>info</code> is a object of information of Web Page in Active tab:<br>
                      - info.url: URL of the page<br>
                      - info.html: HTML text of the page<br>
                      - info.tilte: Title of the page<br>
                      - info.frames[n].html: HTML text of the n'th frame document in the page.<br>
                      - info.frame[n].id: Id of the n'th frame in the page.<br>
                      - info.frame[n].name: name of the n'th frame in the page.<br>
                      Return value is an object that may have the following keys.
                      The key "html" and "action" are exclusive.<br>
                      - html: a HTML text of custom page that will be shown in new Tab. 
                        When user clicks a form in the page, specified action function will be called.<br>
                      - action: an action function name that wlii be called immediately.<br>
                      - data: an object that is passed to the next action function.<br>
                      Action function name can be specified to the attribute "data-action" of buttons in the form in the custom page.<br>
                   `},
                    { 'item': 'menu item: Action Function', 'description': 'same as User Script'},
                    { 'item': 'menu item: Action Name', 'description': 'the action name of the function'},
                    { 'item': 'menu item: (script)', 'description': `
                      Same as user script except for the arugment <code>info</code>.
                      <code>info</code> is a object that may have the following keys:<br>
                      - info.form: the form data ([[name1, value1], [name2, value2], ...]) from the custom page.<br>
                      - info.data: "data" property of the object returned by the previous action function or user script.<br>
                   `},
                  ],
                  manualColumns: [
                      {
                          field: 'item',
                          label: 'item',
                          width:"30ex"
                      },
                      {
                          field: 'description',
                          label: 'Description',
                      }
                  ],
                  testvar: "testv",
        };
      },
      computed: {
      },
      methods: {
          onclick_save: async function() {
              const resp = await chromeRuntimeSendMessage({cmd:"send-native-message", msg:{cmd: "save-data", data:this.allData}});
              if( "error" in resp ) { throw resp }
              await chromeRuntimeSendMessage({cmd:"setup"});
          },
          onclick_load: async function() {
              const resp = await chromeRuntimeSendMessage({cmd:"send-native-message", msg:{cmd:"get-data"}});
              if( "error" in resp ) { throw resp }
              this.allData = resp;
          },

          onclick_setup: async function(){
              const resp = await chromeRuntimeSendMessage({cmd:"setup"});
              if( "error" in resp ) { throw resp }
              alert("Setup OK.")
          },
          onclick_checkinstallation: async function(){
              const response = await chromeRuntimeSendMessage({cmd:"send-native-message", msg:{cmd:"get-data"}});
              if( !("error" in response) ) {
                alert(`<< INSTALLATION OK >>\n\nNative client is installed in ${response.cwd}.`)
              }
          },
          onclick_add: function() {
              this.allData.settings.menu.push({
                title:"New Title", 
                trigger:  {
                    menu: {
                      removal:"script",
                    }
                },
                stage: [
                  {
                    type: "nativeScript",
                    nativeScript: {
                      nativeScript:`
// function ScriptFunction(info)
//   - info: information of web page in active tab
//   - return value: {html:<customPageHTML>, action:<actionName>, data:<dataForNextActionFunction>}
function ScriptFunction(info) {
  // user logic
  return {};
}`                      
                    }
                  },
                ]
              });
          },
          alertInstallation(errmes) {
                this.$buefy.dialog.alert({
                    title: 'Native Client might NOT be installed',
                    message: "<b>Error occurs in connecting to native client:</b><br>" + errmes,
                    confirmText: 'OK'
                })
          },
      },
      components: {
        //codemirror,
        MenuItem,
        //Test,
      },
      created: async function(){
        // get common parameters
        const common = await chromeRuntimeSendMessage({cmd:"get-common"});

        // set host.zip link
        const manifest = {
            "name": common.appName,
            "description": "Customizable menu to run user scripts at browser and/or local PC.",
            "path": "host.bat",
            "type": "stdio",
            "allowed_origins": [
                `chrome-extension://${chrome.runtime.id}/`,
            ]
        };
        const manifestJson = JSON.stringify(manifest, null, '\t');
        const resp = await fetch("/host.zip");
        const host_blob = await resp.blob();
        const zip = new JSZip();
        const top_zip = await zip.loadAsync(host_blob);
        const host_zip = await top_zip.folder("host");
        host_zip.file("manifest.json", manifestJson);
        const blob2 = await top_zip.generateAsync({type:"blob"});
        this.hostDownloadLink = URL.createObjectURL(blob2);

        // short cut to installation page
        if( location.hash === "#installation"){
            this.menuActiveInstallation = true;
            const params = new URLSearchParams(location.search);
            console.log(params.get("errmes"));
            this.alertInstallation(params.get("errmes"));
        }
      }
  };
</script>

<style>
#appxxxx {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
