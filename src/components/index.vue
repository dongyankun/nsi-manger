<template>
  <el-container class="mainBox">
    <!-- 头部 -->
    <el-header>
      <el-row>
        <el-col :span="12" class="headerLeft">
          <div style="display:flex;align-items:center;" class="nsiLog">
            <img src="./../assets/images/logo.png" height="40" width="40" alt="">
            <span>新学说官网</span>
          </div>
          <span class="nsiMenuBtn" @click="isCollapse">☰</span>   
        </el-col>
        <el-col :span="12" class="headerRight">
          <span @click="goWebsite">官网首页</span>
          <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80">
          <span>{{userName}}</span>
          <span @click="outLogin">
            退出登录
          </span>
        </el-col>
      </el-row>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <el-aside class="asideWidth" :width="leftSide.asideWidth">
        <el-menu
          :default-active="routerActive"
          class="el-menu-vertical-demo"
          v-bind:router="true"
          @select="handleSelect"
          :collapse="isCollapseStatus"
          background-color="#545c64"
          text-color="#fff"
          :collapse-transition="false"
          active-text-color="#ffd04b">
          <el-menu-item style="text-align:left;" index="/home">
            <i class="el-icon-location"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu style="text-align:left;" index="/website">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span> 官网</span>
            </template>
            <el-menu-item-group>
              <template slot="title">官网首页</template>
              <el-menu-item index="/website/index">资讯中心</el-menu-item>
              <el-menu-item index="/website/activity">近期活动</el-menu-item>
              <el-menu-item index="/website/banner">官网首页banner</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">会议活动</template>
              <el-menu-item index="/website/eventActivity">活动管理</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">广告位</template>
              <el-menu-item index="/website/advert">广告位配置</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">研究院</template>
              <el-menu-item index="/website/datum">资料管理</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">会员</template>
              <el-menu-item index="/website/member">会员管理</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">vis活动</template>
              <el-menu-item index="/website/visAct">活动管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu style="text-align:left;" index="/mall">
            <template slot="title">
              <i class="el-icon-printer"></i>
              <span>商城</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/mall/advert">商城首页</el-menu-item>
              <el-menu-item index="/mall/goods">商品管理</el-menu-item>
              <el-menu-item index="/mall/bill">订单管理</el-menu-item>
              <el-menu-item index="/mall/invoice">发票管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu style="text-align:left;" index="/distribution">
            <template slot="title">
              <i class="el-icon-printer"></i>
              <span>支付管理</span>
            </template>
            <el-menu-item-group>
            
              <el-menu-item index="/distribution/index">分销管理</el-menu-item>
              <el-menu-item index="/distribution/bill">财务管理</el-menu-item>
              <el-menu-item index="/distribution/caiwu">财务对账</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          
        </el-menu>
      </el-aside>
      <!-- 路由页面 -->
      <el-main>
         <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      isCollapseStatus: false,//左侧是否收缩
      leftSide:{
        asideWidth:'200px'//左侧宽度
      },
      userName:localStorage["userName"],
      routerActive:'/home',//活动active
    }
  },
  methods:{
    goWebsite(){
      window.open('https://www.xinxueshuo.cn','_blank')
    },
    outLogin(){
      localStorage["userName"]=''
      this.$router.push({path:'/login'});
    },
    handleSelect(key, keyPath){
      //判断如果是手机端隐藏侧边栏
      if (window.innerWidth<767) {
        this.leftSide.asideWidth='0px'
      };
    },
    //控制左侧列表是否收缩
    isCollapse(){
      var that=this
      if(window.innerWidth>767){
        this.isCollapseStatus=!this.isCollapseStatus
        if(!that.isCollapseStatus){that.leftSide.asideWidth='200px'}else{that.leftSide.asideWidth='64px'}
      }else{
        if(that.leftSide.asideWidth=='100%'){
          that.leftSide.asideWidth='0px'
        }else{
          that.leftSide.asideWidth='100%'
        }
        
      }
      
    }
  },
  created(){
    //读取路由
    this.routerActive=this.$route.path
    if(window.innerWidth<767){
      this.leftSide.asideWidth='0px'
    }else{
      this.leftSide.asideWidth='200px'
    }
  },
  mounted(){
    //监测页面高度变化
    const that = this
    window.onresize = () => {
        return (() => {
          if(window.innerWidth<767){
            this.leftSide.asideWidth='0px'
          }else{
            this.leftSide.asideWidth='200px'
          }
        })()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import "../assets/main.scss";
  @import "../assets/meta.scss";
</style>
