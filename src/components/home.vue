<template>
  <div  v-loading="loading" element-loading-text="第三方页面加载中,请稍候" element-loading-spinner="el-icon-loading"
     style="width:100%;height:100%">
    <iframe ref="baiduIframe" :style='"min-height:"+minHeight' src="https://tongji.baidu.com/web/welcome/ico?s=e898a1b6e73616a0c84313f55a47efd6" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      minHeight:'',
      loading:true,
    }
  },
  methods:{
   
  },
  created(){
    this.minHeight=window.innerHeight-110+'px'
    
  },
  mounted(){
    var that=this
    this.$refs.baiduIframe.onload=()=>{
      that.loading=false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
 
</style>
