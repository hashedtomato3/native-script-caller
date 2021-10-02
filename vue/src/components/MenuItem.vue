<template>
      <div class="panel" animation="slide" style="margin: 5px 0px 5px 40px; height:100%">

        <div class="my-button" style="display:flex; padding:4px 0 4px 10px; " v-on:click="modalActive = true">
          <div style="margin: 0 auto 0 0">
                {{menu.title}}
          </div>
          <b-button type="is-primary" inverted v-on:click.stop="$emit('delete'); modalActive=false;" title="Delete">
              <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
              </svg>
          </b-button>
        </div>
        
        <b-modal :active="modalActive" @close="modalActive=false" full-screen scroll="keep" can-cancel="false" style="height:100%">
          <div class="box" style=" height:1000px;">

              <div style="display:flex">
                  <b-button type="is-primary" inverted v-on:click="modalActive = false"  title="Close" style="margin:auto 5px">
                    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M13.5 21H6V17H13.5C15.43 17 17 15.43 17 13.5S15.43 10 13.5 10H11V14L4 8L11 2V6H13.5C17.64 6 21 9.36 21 13.5S17.64 21 13.5 21Z" />
                    </svg>
                  </b-button>
                  <p class="title is-4">User Script: {{menu.title}}</p>
              </div>
    
              <div class="xxpanel-block">
                <form class="xxcard" style="height:100%">
                  <b-field label="Title" horizontal>
                      <input class="input" type="text" v-model="menu.title" :title="manualData[3].description">
          
                    </b-field>
                  <b-field label="URL Filter" horizontal>
                    <input class="input" type="text" v-model="menu.trigger.menu.urlFilter"  :title="manualData[4].description">
                  </b-field>
                  <b-field label="Removal Elements" horizontal>
                    <input class="input" type="text" v-model="menu.trigger.menu.removal"  :title="manualData[5].description">
                  </b-field>
                  <b-field label="User Script" horizontal>
                    <label><input type="radio" v-model="menu.stage[0].type" value="nativeScript">Native Script (Node.js)</label>
                    <span style="width:5px"></span>
                    <label><input type="radio" v-model="menu.stage[0].type" value="browserScript">Browser Script (sandbox)</label>
                    <span style="width:5px"></span>
                    <label><input type="radio" v-model="menu.stage[0].type" value="none">None</label>
                  </b-field>
                  <b-field horizontal>
                    <codemirror v-model="menu.stage[0].nativeScript.nativeScript" :options="cmOptions" />
                  </b-field>

                  <b-field horizontal label="Action Functions" style="display:flex">
                      <b-button type="is-primary" inverted v-on:click="onclick_add" style="margin:0 0 0 auto">
                        <div style="display:flex">
                          <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M17,13H13V17H11V13H7V11H11V7H13V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
                          </svg>
                        </div>
                      </b-button>    
                  </b-field>


                  <div v-for="(stage, index) in menu.stage.slice(1)" :key="stage.actionName" style="margin:0 0 0 100px">

                    <div class="panel" animation="slide" style="margin:5px 0 5px 40px; height:100%">
                      <div class="my-button" v-on:click="modalActive2 = index" style="display:flex; padding:4px 0px 4px 10px">
                        <div style="margin: 0 auto 0 0">
                              {{stage.actionName}}
                        </div>
                        <b-button type="is-primary" inverted v-on:click.stop="menu.stage.splice(index+1, 1);" title="Delete">
                            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                            </svg>
                        </b-button>
                      </div>
                      
                      <b-modal :active="modalActive2===index" @close="modalActive2=-1" full-screen scroll="keep" can-cancel="false" style="height:100%">
                        
                        <div style="display:flex">
                          <b-button type="is-primary" inverted v-on:click="modalActive2 = -1"  title="Close" style="margin:auto 5px">
                            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M13.5 21H6V17H13.5C15.43 17 17 15.43 17 13.5S15.43 10 13.5 10H11V14L4 8L11 2V6H13.5C17.64 6 21 9.36 21 13.5S17.64 21 13.5 21Z" />
                            </svg>
                          </b-button>
                          <p class="title is-4">Action Function: {{stage.actionName}}</p>
                        </div>                        

                        <b-field label="Action Name" horizontal>
                          <input class="input" type="text" v-model="stage.actionName" title="action name">
                        </b-field>

                        <b-field label="Action Function" horizontal>
                          <label><input type="radio" v-model="stage.type" value="nativeScript">Native Script (Node.js)</label>
                          <span style="width:5px"></span>
                          <label><input type="radio" v-model="stage.type" value="browserScript">Browser Script (sandbox)</label>
                          <span style="width:5px"></span>
                          <label><input type="radio" v-model="stage.type" value="none">None</label>
                        </b-field>
                        <b-field horizontal>
                          <codemirror v-model="stage.nativeScript.nativeScript" :options="cmOptions" />
                        </b-field>
                      </b-modal>
                    </div>
            
                  </div>
                </form>
              </div> 
          </div>
        </b-modal>
      </div>
</template>

<script>


  import { codemirror } from 'vue-codemirror';
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/addon/lint/lint.css'
  import 'codemirror/addon/selection/active-line.js'
  import 'codemirror/addon/edit/matchbrackets.js'
  import 'codemirror/addon/edit/closebrackets.js'
  //import './lib/jshint-2.12.0/dist/jshint.js'
  import 'codemirror/addon/lint/lint.js'
  import 'codemirror/addon/lint/javascript-lint.js'
  


  export default {
      name: 'menu-item',
      props: [
        "menu",
        "manualData",
        "index"
      ],
      data: function() {
        return {
                modalActive:false,
                modalActive2:-1,
                //menu_data:{},
                cmOptions: {
                  mode: "javascript",
                  lineNumbers: true,
                  styleActiveLine:true,
                  matchBrackets:true,
                  autoCloseBrackets: true,
                  gutters: ["CodeMirror-lint-markers"],
                  lint: {esversion:6},
                },
        };
      },
      watch: {
        // testvar: function(v){
        //   console.log("change testvar: "+v)
        //   this.testvar2 = v;
        // },
        // testvar2: function(v){
        //   console.log("change testvar2: "+v)
        //   this.$emit("update:testvar", v);
        // },
        // menu: function(v){
        //   console.log("change menu: "+v)
        //   //this.menu_data = v;
        // },
        // menu_data: function(v){
        //   console.log("change menu_data: ")
        //   console.log(v)
        //   //this.$emit("update:menu", v);
        // }
      },
      mounted: function() {
        // console.log("mounted: "+this.testvar)
        // this.testvar2 = this.testvar;
        // //this.menu_data = this.menu;
        // console.log(this.menu_data)
      },
      computed: {
      },
      methods: {
          onclick_add: function() {
              this.menu.stage.push({
                    type: "none",
                    actionName: "New Action",
                    nativeScript: {
                      nativeScript:`
// function ScriptFunction(info)
//   - info: information of return value from Script1 and custom page
function ScriptFunction(info) {
  // user logic
  return {};
}`                      
                    }
              });
              console.log(this.menu.stage)
          },
          //onclick_delete: function() {
          //    this.menu.splice(index, 1);
          //},

      },
      components: {
        codemirror,
      },
      created: async function(){
        // get common parameters
        //const common = await chromeRuntimeSendMessage({cmd:"get-common"});
      }
  };
</script>

<style>
  .my-button {
    background-color: white;
  }
  .my-button:hover {
    background-color: whitesmoke;
  }
#appxx {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
