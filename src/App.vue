<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods:{
    goLogin(){
      this.$router.push({path:'/login'});
    }
  },
  watch: {//使用watch 监听$router的变化
    $route(to, from) {
      if(!localStorage["userName"]){
        this.goLogin()
      }
    }
  }
}
</script>

<style>
html,body{
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
