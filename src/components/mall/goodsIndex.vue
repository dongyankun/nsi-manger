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
      prop="goodsName2"
      align="center"
      label="类型">
    </el-table-column>
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
        <el-button @click.prevent="edit(scope.row.goodsIndex,scope.row.content01)" type="text" size="small">编辑</el-button>
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
      getWebsiteTable(type){
        var that=this
        let url=this.baseUrl + "/goods/Get_Home_Config.do"
        var formData =new URLSearchParams();
        formData.append('type', type);
        return new Promise(function(resolve,reject){
            that.$axios.post(url,formData).then(function(response){
              resolve(response)
              // console.log(response)
              // that.websiteTableData=response.data.data.goodList
              // for (let index = 0; index < response.data.data.configureList.length; index++) {
              //   that.websiteTableData[index].goodsIndex=response.data.data.configureList[index].id
              // }
              // that.websiteTableDataloading=false
            }).catch(function (response){
              reject(response)
            });
          })
      },
      //编辑资讯
      edit(newsId,content01){
        let that=this
        this.goodsIndex=newsId
        this.goodsId=content01
        this.puchaDrag=true
      },

    },
    created(){
      let that=this
      Promise.all([that.getWebsiteTable('ShopHomeTop'),that.getWebsiteTable('ShopHomeSale'),that.getWebsiteTable('ShopHomeRecommend')]).then(function(arr){
        
        let flagArr=[]
        let flagArr2=[]
        arr.forEach(function(item){
          console.log(item)
          flagArr2=flagArr2.concat(item.data.data.goodList)
          flagArr=flagArr.concat(item.data.data.configureList)
        })
        that.websiteTableData=flagArr2
        for (let index = 0; index < flagArr.length; index++) {
          that.websiteTableData[index].goodsIndex=flagArr[index].id
          that.websiteTableData[index].content01=flagArr[index].content01
          if (flagArr[index].type=='ShopHomeTop') {
            that.websiteTableData[index].goodsName2='最受欢迎'
          }else if(flagArr[index].type=='ShopHomeRecommend'){
            that.websiteTableData[index].goodsName2='主编推荐'
          }else if(flagArr[index].type=='ShopHomeSale'){
            that.websiteTableData[index].goodsName2='限时特价'
          }
        }
        that.websiteTableDataloading=false
      },function(){
        console.log('至少有一个失败了')
      })
    }
  }
</script>
<style>

</style>
