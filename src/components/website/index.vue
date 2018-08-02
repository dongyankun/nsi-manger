<template>
<div>
  <!-- 头部按钮 -->
  <div class="headerBtn">
    <div class="headerBtnLeft">
      <el-button @click="createNews" type="primary">添加资讯</el-button>
    </div>
    <div class="headerBtnRight">
      <el-input v-model="keyword" placeholder="请输入关键字搜索"></el-input>
      <el-button type="success" class="selectBtn" @click="getWebsiteTable"><i class="el-icon-search"></i><span>查询</span></el-button>
    </div>
    
  </div>
  <!-- 表格 -->
  <el-table
    :data="websiteTableData"
    border
    stripe
    v-loading="websiteTableDataloading"
    class="websiteTable">
    <el-table-column
      type='index'
      :index="typeIndex"
      align="center"
      label="编号"
      width="100">
    </el-table-column>
    <el-table-column
      prop="title"
      align="center"
      label="标题"
      >
    </el-table-column>
    <el-table-column
      prop="articleWriter"
      label="作者"
      align="center"
      width="120">
    </el-table-column>
    
    <el-table-column
      prop="updateTime"
      align="center"
      label="最后更新日期">
    </el-table-column>
    <el-table-column
      label="文章链接"
      align="center"
      width="200">
      <template slot-scope="scope">
        <el-button v-clipboard:copy="scope.row.articleUrl" v-clipboard:error="copyError" v-clipboard:success="copysucess" type="text" size="small">复制文章链接</el-button>
      </template>
    </el-table-column>
    <el-table-column
      prop="articleReader"
      label="浏览量"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      align="center"
      width="100">
      <template slot-scope="scope">
        <el-button @click.prevent="edit(scope.row.id)" type="text" size="small">编辑</el-button>
        <el-button @click.prevent="deleteWebsiteTableData(scope.row.id,websiteTableData)" type="text" size="small" style="color:#f56c6c">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    class="mypagination"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    background
    layout="total, sizes, prev, pager, next, jumper"
    :page-sizes="[10,20,30,40,50]"
    :page-size="100"
    :total="pageTotalnum">
  </el-pagination>
</div>
  
</template>

<script>
  export default {
    data() {
      return {
        websiteTableData: [],//表格数据
        pageTotalnum:0,//数据总数
        pageNum:1,//页码
        pageSize:10,//默认每页数据量
        typeIndex:1,//序号开始
        keyword:'',//搜索
        websiteTableDataloading:true,//表格数据展示
      }
    },
    methods:{
      //获取表格数据
      getWebsiteTable(){
        var that=this
        let url=this.baseUrl + "/manager/article/list.do"+"?pageNum="+this.pageNum+"&pageSize="+this.pageSize+"&keyword="+this.keyword
        this.$axios.get(url).then(function(response){
          that.pageTotalnum=response.data.data.total
          that.websiteTableData=response.data.data.list
          //console.log(that.websiteTableData)
          let websiteTableDataLength=that.websiteTableData.length
          let flagNum=0
          function RefreshStatistics(){
              let url=that.baseUrl + "/manager/article/RefreshStatistics.do"+"?articleId="+that.websiteTableData[flagNum].id
              that.$axios.get(url).then(function(response){
                that.websiteTableData[flagNum].articleReader=response.data.msg
                flagNum++
                if(flagNum<websiteTableDataLength){
                  RefreshStatistics()
                }
              }).catch(function (response){
                that.websiteTableDataloading=false
                that.$message({
                  message: '请求浏览量数据失败',
                  type: 'error'
                });
              });
          }
          RefreshStatistics()
          that.websiteTableDataloading=false
        }).catch(function (response){
          that.websiteTableDataloading=false
          that.$message({
            message: '数据请求失败',
            type: 'error'
          });
        });
      },
      //页码改变
      handleCurrentChange(num){
        this.pageNum=num
        this.getWebsiteTable()
      },
      //一页数据量改变
      handleSizeChange(num){ 
        this.pageSize=num
        this.getWebsiteTable()
      },
      //编辑资讯
      edit(newsId){
        this.$store.state.websiteNewsId=newsId
        this.$router.push({path:'/website/createnews'});
      },
      //删除资讯
      deleteWebsiteTableData(articleId){
        var that=this
        that.$confirm('此操作将删除该条资讯,且无法恢复, 是否继续?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          let url=that.baseUrl + "/manager/article/delete.do"+"?articleId="+articleId
          that.$axios.get(url).then(function(response){
            that.$message({
              message: response.data.msg,
              type: 'sucess'
            });
            that.getWebsiteTable()
          }).catch(function (response){
            that.$message({
              message: '数据请求失败',
              type: 'error'
            });
          });
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      //复制链接成功
      copysucess(){
        this.$message({
          message: '复制链接成功',
          type: 'sucess'
        });
      },
      //复制失败
      copyError(){
        this.$message({
          message: '复制链接失败',
          type: 'sucess'
        });
      },
      //跳转路由
      createNews(){
        this.$store.state.websiteNewsId=''
        // let routeData = this.$router.resolve({
        //    name: "searchGoods",
        //    query: params,
        //    params:{catId:params.catId}
        // });
        //let nowHref=window.location.href
       // window.open(routeData.href, '_blank');
        this.$router.push({path:'/website/createnews'});
      },

    },
    created(){
      //初始化表格数据
      this.getWebsiteTable()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
