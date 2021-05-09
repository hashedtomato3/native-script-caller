# native-script-caller
Chrome Extension that calls native node.js script from browser.

* [Chrome Store page](https://chrome.google.com/webstore/detail/native-script-caller/ckgdggmpioeabapnhoglbmeibhbdmmoe)

### how to publish to Chrome Web Store

* zip ChromeStore folder
* In Chrome Web Store Developp]er dashboard, upload zip file to Chrome Web Store
* The files in publish foler are used to fill in dashboard forms.

### versions

```
node -v
v14.16.0
vue -V
@vue/cli 4.5.12
npm list vue -g
C:\Users\sdkn1\AppData\Roaming\npm
+-- @vue/cli@4.5.12
| `-- vue@2.6.12
`-- @vue/cli-service-global@4.5.12
  `-- vue@2.6.12
```

### Creation of Development Environment (Vue)

```
- install node, npm
//npm install -g vue  (vue2)  // not required, vue cli includes vue???
npm install -g @vue/cli  
vue create vue   // specifying vue2 default
cd vue
npm install buefy
npm install vue-codemirror
- add to package.json
  "eslintConfig": {
    "env": {
      "webextensions": true
    },
  }
- add to vue.config.js
    module.exports = {
        publicPath: './'
    }

```
```
npm install
```

### Vue build and deploy
```
cd vue
// npm run lint
// npm run serve
npm run build
DEPLOY.bat
```
