<template>
<div>
  <!-- 头部按钮 -->
  <div class="headerBtn">
    
    <div>
      <el-form label-width="50px" class="updateCardForm">
          <el-form-item label="状态:">
              <el-select @change="billstatusChange" v-model="billstatusValue" placeholder="请选择">
                  <el-option
                  v-for="item in billstatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
              </el-select>
          </el-form-item>
        </el-form>
    </div>
    <div class="headerBtnRight">
      <el-input v-model="keyword" placeholder="请输入关键字搜索"></el-input>
      <el-button type="success" class="selectBtn" @click="getWebsiteTable"><i class="el-icon-search"></i><span>查询</span></el-button>
    </div>
    <div class="headerBtnLeft">
      <el-button @click="createNews" type="primary">添加商品</el-button>
    </div>
  </div>
  <!-- 表格 -->
  <el-table
    :data="websiteTableData"
    border
    stripe
    v-loading="websiteTableDataloading"
    :max-height="windowHeight"
    class="websiteTable">
    <el-table-column
      prop="id"
      align="center"
      label="编号"
      width="100">
    </el-table-column>
    <el-table-column
      prop="goodsName"
      align="center"
      label="商品名称"
       width="200"
      >
    </el-table-column>
    <el-table-column
      prop="goodsPrice"
      label="价格"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      prop="goodsState"
      label="状态"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      prop="goodsAuthor"
      label="作者"
      align="center"
      width="120">
    </el-table-column>
    
    <!-- <el-table-column
      prop="goodsDescribe"
      align="center"
      label="商品描述">
    </el-table-column> -->
    <el-table-column
      prop="goodsPress"
      label="出版社"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      prop="goodsPubdate"
      label="出版时间"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      prop="goodsType"
      label="商品类型"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      prop="goodsStock"
      label="库存"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      prop="goodsCreattime"
      label="上架时间"
      align="center"
      width="160">
    </el-table-column>
    <el-table-column
      prop="goodsLevel"
      label="权重"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      prop="goodsLabel"
      label="标签"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      prop="goodsSeries"
      label="系列"
      align="center"
      width="120">
    </el-table-column>
    
    <el-table-column
      prop="goodsSales"
      label="销量"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      prop="goodsVisitcount"
      label="访问量"
      align="center"
      width="120">
    </el-table-column>
    <!-- <el-table-column
      prop="goodsImg"
      label="封面图片"
      align="center"
      width="120">
    </el-table-column> -->
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
    :page-size="20"
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
        pageSize:20,//默认每页数据量
        typeIndex:1,//序号开始
        keyword:'',//搜索
        websiteTableDataloading:true,//表格数据展示
        warnClass:'warnClass',
        commonCalss:'',
        billstatusValue:'',
        billstatus:[{
          value: '',
          label: '全部'
        },{
          value: '上架',
          label: '上架'
        }, {
          value: '下架',
          label: '下架'
        }],
      }
    },
    methods:{
      billstatusChange(data1){
          this.pageNum=1
            this.getWebsiteTable()
        },
      //获取表格数据
      getWebsiteTable(){
        var that=this
        that.websiteTableDataloading=true
        let url=this.baseUrl + "/goods/goods_list.do"+"?type=新学说书籍&state="+that.billstatusValue+"&pageNum="+this.pageNum+"&pageSize="+this.pageSize+"&searchKey="+this.keyword
        this.$axios.get(url).then(function(response){
          that.pageTotalnum=response.data.data.total
          that.websiteTableData=response.data.data.list
          for (let index = 0; index <  that.websiteTableData.length; index++) {
            that.websiteTableData[index].goodsCreattime=that.dateToDo(that.websiteTableData[index].goodsCreattime)
          }
          let websiteTableDataLength=that.websiteTableData.length
          that.websiteTableDataloading=false
        }).catch(function (response){
          that.websiteTableDataloading=false
          that.$message({
            message: '数据请求失败',
            type: 'error'
          });
        });
      },
      dateToDo(shijianchuo){
        function add0(num){
          return num>9?num:'0'+num
        }
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)
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
        //this.$store.state.websiteNewsId=newsId
        this.$router.push({path:'/mall/creategoods/'+newsId});
      },
      //删除资讯
      deleteWebsiteTableData(articleId){
        var that=this
        that.$confirm('此操作将删除该商品,且无法恢复, 是否继续?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          let url=that.baseUrl + "/goods/goods_delete.do"+"?id="+articleId
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
      //创建新资讯
      createNews(){
        this.$store.state.websiteNewsId=''
        this.$router.push({path:'/mall/creategoods/add'});
      },

    },
    created(){
      //初始化表格数据
      this.getWebsiteTable()
      this.windowHeight=window.innerHeight-220
      console.log(this.windowHeight)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
  .headerBtn{
    display:flex;
    justify-content:start;
  }
  .warnClass{
    color:#F00;
  }
  .headerBtnLeft{
    margin-left: 30px;
  }
</style>
