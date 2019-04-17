<template>
<div>
  <!-- 头部按钮 -->
  <div class="headerBtn">
    <div class="headerBtnRight">
      <el-input v-model="keyword" placeholder="请输入关键字搜索"></el-input>
      <el-button type="success" class="selectBtn" ><i class="el-icon-search"></i><span>查询</span></el-button>
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
      prop="id"
      align="center"
      label="编号"
      >
    </el-table-column>
    <el-table-column
      prop="createTime"
      align="center"
      label="创建时间"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      align="center"
      label="联系人"
      >
    </el-table-column>
    <el-table-column
      prop="institution"
      label="单位"
      align="center"
      >
    </el-table-column>
    
    <el-table-column
      prop="duty"
      align="center"
      label="职位">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="联系电话"
      align="center"
      >
    </el-table-column>
     <el-table-column
      prop="mail"
      label="邮箱"
      align="center"
      >
    </el-table-column>
    <el-table-column
      prop="memberType"
      label="会员类型"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      align="center"
      width="100">
      <template slot-scope="scope">
        <el-button @click.prevent="edit(scope.row.id)" type="text" size="small">{{scope.row.states==0?'未联系':'已联系'}}</el-button>
        <!-- <el-button @click.prevent="deleteWebsiteTableData(scope.row.id,websiteTableData)" type="text" size="small" style="color:#f56c6c">删除</el-button> -->
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
        that.websiteTableDataloading=true
        let url=this.baseUrl + "/members/get_members_list.do"+"?pageNum="+this.pageNum+"&pageSize="+this.pageSize+"&keyword="+this.keyword
        this.$axios.get(url).then(function(response){
          that.pageTotalnum=response.data.data.total
          that.websiteTableData=response.data.data.list
          function add0(data){
            return data>9?data:'0'+data
          }
          for (var i = 0; i < that.websiteTableData.length; i++) {
              var time = new Date(that.websiteTableData[i].createTime);
              var y = time.getFullYear();
              var m = time.getMonth()+1;
              var d = time.getDate();
              var h = time.getHours();
              var mm = time.getMinutes();
              var s = time.getSeconds();
              //var riqi=y+'-'+m+'-'+d+' '+h+':'+mm+':'+s;
              var riqi= y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
              that.websiteTableData[i].createTime=riqi
          };
          //console.log(that.websiteTableData)
          let websiteTableDataLength=that.websiteTableData.length
          let flagNum=0
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
        var that=this
        that.$confirm('确定已联系该会员?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          
          let url=that.baseUrl + "/members/set_members_states.do"
          var formData =new URLSearchParams();
          formData.append('states', 1)
          formData.append('id', newsId)
          
          that.$axios.post(url,formData).then(function(response){
            
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
            message: '已取消修改'
          });          
        });
        // this.$store.state.websiteNewsId=newsId
        // this.$router.push({path:'/website/createnews'});
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
      //创建新资讯
      createNews(){
        this.$store.state.websiteNewsId=''
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
