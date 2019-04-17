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
      type='index'
      :index="typeIndex"
      align="center"
      label="编号"
      width="100">
    </el-table-column>
     <el-table-column
      prop="adtext"
      align="center"
      label="名称">
    </el-table-column>
    <el-table-column
      prop="typename"
      align="center"
      label="类型"
      width="120"
      >
    </el-table-column>
    <el-table-column
      prop="createtime"
      label="创建时间"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      label="图片地址"
      align="center"
      width="180">
      <template slot-scope="scope">
        <img style="width:120px;height:120px;" :src="scope.row.imgurl" alt="">
      </template>
    </el-table-column>
    <el-table-column
      prop="clickurl"
      label="跳转链接"
      align="center"
      >
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
  <el-dialog
      title="修改信息"
      :modal-append-to-body="false"
      :visible.sync="puchaDrag"
      width="50%">
      <el-form :model="flagwebsiteTableData" label-width="140px" class="updateCardForm">
        <el-form-item label="名称">
          <el-input v-model="flagwebsiteTableData.adtext" type="text"></el-input>
        </el-form-item> 
        <el-form-item label="封面图片地址">
          <el-input style="display:inline-block;float:left;" v-model="flagwebsiteTableData.imgurl"  type="text"></el-input>
          <el-upload
            class="uploadBanner"
            :action="baseUrl+'/manager/resource/upfile.do'"
            :show-file-list='false'
            accept="image/jpeg,image/jpg,image/png"
            :on-success="uploadSucess"
            :before-upload="beforeUpload"
            :on-error="uploadError"
            :file-list="fileList">
            <el-button size="small" type="primary">上传图片</el-button><span style="color:#999;font-size:12px;padding-left:12px;">图片大小:878*340像素</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="flagwebsiteTableData.clickurl" type="text"></el-input>
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
        flagwebsiteTableData:'',
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
        let flagStr='?'
        for(let key in this.flagwebsiteTableData){
          flagStr+=key+'='+this.flagwebsiteTableData[key]+'&'
        }
        flagStr=flagStr.slice(0,flagStr.length-1)
        let url=that.baseUrl + "/article/setArticleAd.do"+flagStr
        that.$axios.get(url).then(function(response){
          that.$message({
            message: '修改成功',
            type: 'success'
          });
        }).catch(function (response){
          that.$message({
            message: '请求活动列表失败',
            type: 'error'
          });
        });
       //文件上传成功
      },
      uploadSucess(response, file, fileList){
        this.uploadLoading=false
        this.$message({
          message: '图片上传成功',
          type: 'success'
        });
        this.flagwebsiteTableData.imgurl=response.data.url
      },
      //文件上传失败
      uploadError(err, file, fileList){
        this.uploadLoading=false
        this.$message({
          message: '图片上传失败',
          type: 'error'
        });
      },
      //文件上传过程
      beforeUpload(file){
        this.uploadLoading=true
        let uploadStatus=true
        let fileSize=(file.size)/1024
        if(fileSize>300){
          uploadStatus=false
          this.uploadLoading=false
          this.$message({
            message: '图片大小 不能超过300KB',
            type: 'error'
          });
        }
        return uploadStatus
      },
      //获取表格数据
      getWebsiteTable(){
        var that=this
        let url=this.baseUrl + "/article/getArticleAd.do?typeName=文章页右侧广告位"
        this.$axios.get(url).then(function(response){
          that.websiteTableData=response.data.data
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
        this.puchaDrag=true
        console.log(this.websiteTableData)
        this.websiteTableData.forEach(item=>{
          if(newsId==item.id){that.flagwebsiteTableData=item}
        })
      },
      //删除资讯
      deleteWebsiteTableData(articleId){
        var that=this
        that.$confirm('此操作将删除,且无法恢复, 是否继续?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          let url=that.baseUrl + "/manager/resource/del.do"+"?articleId="+articleId
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
      }

    },
    created(){
      //初始化表格数据
      this.getWebsiteTable()
    }
  }
</script>
<style>

</style>
