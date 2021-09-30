<template>
      <div class="panel" animation="slide"
          style="margin:0px; height:100%">
        <div style="display:inline-block">
          <div class="xlevel-left" style="display:inline-block">
            <a class="panel-block" v-on:click="modalActive = true" href="#">
              {{menu.title}}
            </a>
          </div>
          <div class="xlevel-right" style="display:inline-block; margin: 0 0 0 auto">
            <b-button type="is-primary" v-on:click="$emit('delete'); modalActive=false;" title="Delete">
                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                </svg>
            </b-button>
          </div>
        </div>
        
        <b-modal :active="modalActive" @close="modalActive=false" :width="1500" scroll="keep" xxxcan-cancel="false" style="height:100%">
          <div class="xcard" style=" height:1000px;">

            <div class="xcard-content" style=" height:100%;">
              <div class="level">
                <div class="level-left">
                    <b-button type="is-primary" v-on:click="modalActive = false"  title="Close" style="margin:auto 5px">
                      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,3H16.3H7.7H5A2,2 0 0,0 3,5V7.7V16.4V19A2,2 0 0,0 5,21H7.7H16.4H19A2,2 0 0,0 21,19V16.3V7.7V5A2,2 0 0,0 19,3M15.6,17L12,13.4L8.4,17L7,15.6L10.6,12L7,8.4L8.4,7L12,10.6L15.6,7L17,8.4L13.4,12L17,15.6L15.6,17Z" />
                      </svg>
                  </b-button>
                    <p class="title is-4">{{menu.title}}</p>
                </div>
                <div class="level-right" v-bind:index="index">
                    <b-button type="is-primary" v-on:click="modalActive = false"  title="Close" style="margin:auto 5px">
                      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,3H16.3H7.7H5A2,2 0 0,0 3,5V7.7V16.4V19A2,2 0 0,0 5,21H7.7H16.4H19A2,2 0 0,0 21,19V16.3V7.7V5A2,2 0 0,0 19,3M15.6,17L12,13.4L8.4,17L7,15.6L10.6,12L7,8.4L8.4,7L12,10.6L15.6,7L17,8.4L13.4,12L17,15.6L15.6,17Z" />
                      </svg>
                  </b-button>
                </div>            
              </div>
    
              <div class="panel-block">
                <form class="card" style="height:100%">
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
                  <div v-for="stage in menu.stage.slice(1)" :key="stage.actionName">
                        <b-field label="Action Name" horizontal>
                          <input class="input" type="text" v-model="stage.actionName">
                        </b-field>
                        <b-field label="Action Function" horizontal>
                          <label><input type="radio" v-model="stage.type" value="nativeScript">Native Script (Node.js)</label>
                          <span style="width:5px"></span>
                          <label><input type="radio" v-model="stage.type" value="browserScript">Browser Script (sandbox)</label>
                          <span style="width:5px"></span>
                          <label><input type="radio" v-model="stage.type" value="none">None</label>
                        </b-field>
                        <b-field>
                          <codemirror v-model="stage.nativeScript.nativeScript" :options="cmOptions" />
                        </b-field>
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
      method: {
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
#appxx {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
