# native-script-caller
Chrome Extension that calls native node.js script from browser.

* [Chrome Store page](https://chrome.google.com/webstore/detail/native-script-caller/ckgdggmpioeabapnhoglbmeibhbdmmoe)

### How to publish to Chrome Web Store

* In Chrome Web Store Developp]er dashboard, upload ./ChromeStore.zip file to Chrome Web Store
* The files in ./publish foler are used to fill in dashboard forms.

### Used versions

```
> node -v
v14.16.0
> vue -V
@vue/cli 4.5.12
> npm list vue -g
C:\Users\sdkn1\AppData\Roaming\npm
+-- @vue/cli@4.5.12
| `-- vue@2.6.12
`-- @vue/cli-service-global@4.5.12
  `-- vue@2.6.12
```

### Creation of Development Environment (Vue)

```
- install node and npm
> //npm install -g vue  (vue2)  // not required, vue cli includes vue???
> npm install -g @vue/cli  
> vue create vue   // specifying vue2 default
> cd vue
> npm install buefy
> npm install vue-codemirror
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

OR

```
cd vue
npm install  // install all for ./packatge.json
```

### Build and Deploy

```
> cd vue
> // npm run lint
> // npm run serve
> npm run build  // compile ./public and ./src  into ./dist
> DEPLOY.bat     // copy ./dist to ../ChromeStore/vue/dist, and zip ChromeStore
```
