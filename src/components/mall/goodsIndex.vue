<template>
<div v-loading.fullscreen="uploadLoading" element-loading-text="图片上传中" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
  <!-- 表格 -->
  <el-table
    :data="websiteTableData"
    border
    stripe
    v-loading="websiteTableDataloading"
    class="websiteTable">
    <el-table-column
      prop="goodsIndex"
      align="center"
      label="编号"
      width="100">
    </el-table-column>
     <el-table-column
      prop="goodsName"
      align="center"
      label="商品名称">
    </el-table-column>
    <el-table-column
      prop="goodsType"
      align="center"
      label="商品类型"
      width="120"
      >
    </el-table-column>
     <el-table-column
      prop="goodsAuthor"
      align="center"
      label="作者">
    </el-table-column>
     <el-table-column
      prop="goodsDescribe"
      align="center"
      label="商品描述">
    </el-table-column>
    <el-table-column
      label="图片地址"
      align="center"
      width="180">
      <template slot-scope="scope">
        <img style="width:120px;height:120px;" :src="scope.row.goodsImg" alt="">
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      align="center"
      width="100">
      <template slot-scope="scope">
        <el-button @click.prevent="edit(scope.row.goodsIndex)" type="text" size="small">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
      title="修改信息"
      :modal-append-to-body="false"
      :visible.sync="puchaDrag"
      width="50%">
      <el-form label-width="140px" class="updateCardForm">
        <el-form-item label="商品id">
          <el-input v-model="goodsId" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="puchaDrag=false">取 消</el-button>
          <el-button type="primary" @click="updateTabledata">确认修改</el-button>
      </div>
    </el-dialog>
</div>
  
</template>

<script>
  export default {
    data() {
      return {
        websiteTableData: [],//表格数据
        goodsId:0,
        goodsIndex:'',
        uploadLoading:false,
        typeIndex:1,//序号开始
        websiteTableDataloading:true,//表格数据展示
        puchaDrag:false,
        fileList:[],
      }
    },
    methods:{
      updateTabledata(){
        var that=this
        let url=this.baseUrl + "/goods/Set_Home_Config.do"
        var formData =new URLSearchParams();
        formData.append('id', that.goodsIndex);
        formData.append('content01', that.goodsId);
        this.$axios.post(url,formData).then(function(response){
          that.$message({
            message: '修改成功',
            type: 'sucess'
          });
          that.puchaDrag=false
          that.getWebsiteTable()
        }).catch(function (response){
          that.websiteTableDataloading=false
          that.$message({
            message: '数据请求失败',
            type: 'error'
          });
        });
      },
      //获取表格数据
      getWebsiteTable(){
        var that=this
        let url=this.baseUrl + "/goods/Get_Home_Config.do"
        var formData =new URLSearchParams();
        formData.append('type', 'ShopHome');
        this.$axios.post(url,formData).then(function(response){
          console.log(response)
          that.websiteTableData=response.data.data.goodList
          for (let index = 0; index < response.data.data.configureList.length; index++) {
            that.websiteTableData[index].goodsIndex=response.data.data.configureList[index].id
          }
          that.websiteTableDataloading=false
        }).catch(function (response){
          that.websiteTableDataloading=false
          that.$message({
            message: '数据请求失败',
            type: 'error'
          });
        });
      },
      //编辑资讯
      edit(newsId){
        let that=this
        this.goodsIndex=newsId
        this.puchaDrag=true
      },

    },
    created(){
      //初始化表格数据
      this.getWebsiteTable()
    }
  }
</script>
<style>

</style>
