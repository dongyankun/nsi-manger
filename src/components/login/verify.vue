<template>
<div> 
  <div><i  class="el-icon-edit myEdit"></i><div class="count" @click="changeNum"><span>{{num1}}</span> + <span>{{num2}}</span> = ?</div><el-input v-model="editNums" @keyup.native="editNum" placeholder="请输入计算结果"></el-input></div>
</div>
  
</template>

<script>
  export default {
    data() {
      return {
        num1:Math.floor(Math.random()*10),
        num2:Math.floor(Math.random()*10),
        editNums:''
      }
    },
    methods:{
      changeNum(){
        this.num1=Math.floor(Math.random()*10)
        this.num2=Math.floor(Math.random()*10)
      },
      editNum(){
        if((this.num1+this.num2)==this.editNums){
          this.$emit('getVerity',true)
        }else{
          this.$emit('getVerity',false)
        }
      }

    },
    created(){
      
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.count{
  position:absolute;
  right:0;
  width: 140px;
  background: #f1f1f1;
  height: 47px;
  line-height: 47px;
  z-index: 999;
  font-size: 24px;
  cursor: pointer;
  color:rgb(153, 51, 102);
}
.myEdit{
  position: absolute;
  left:7px;
  color:#fff;
  z-index: 999;
  line-height: 47px;
}
</style>
