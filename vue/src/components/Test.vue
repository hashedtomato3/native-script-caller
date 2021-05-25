<template>
          <div >
                      <!-- <input type="text" :value="testvar2" @change="testvar2 = 1;"> -->
                      <input type="text" v-model="testvar2">
                      {{testvar2}}
          </div>
</template>

<script>
  export default {
      name: 'test',
      data: function() {
        return {
                testvar2:"testv",
        };
      },
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
