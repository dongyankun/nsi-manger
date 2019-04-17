<template>
<div>
  <!-- 头部button -->
  <div class="headerBtn" style="margin-bottom:20px;">
    <div class="headerBtnLeft">
      <el-button @click="addDatum()" type="primary">添加资料</el-button>
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
      prop="fileName"
      align="center"
      
      label="名称">
    </el-table-column>
    <el-table-column
      prop="type"
      align="center"
      label="类型"
      width="120"
      >
    </el-table-column>
    <el-table-column
      prop="year"
      label="年代"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      label="图片地址"
      align="center"
      width="180">
      <template slot-scope="scope">
        <img style="width:120px;height:120px;" :src="scope.row.imageUrl" alt="">
      </template>
    </el-table-column>
    <el-table-column
      prop="fileUrl"
      label="下载地址"
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
          <el-input v-model="flagwebsiteTableData.fileName" type="text"></el-input>
        </el-form-item> 
        <el-form-item label="类型">
          <el-input v-model="flagwebsiteTableData.type" type="text"></el-input>
        </el-form-item> 
        <el-form-item label="年代">
          <el-input v-model="flagwebsiteTableData.year" type="text"></el-input>
        </el-form-item> 
        <el-form-item label="封面图片地址">
          <el-input style="display:inline-block;float:left;" v-model="flagwebsiteTableData.imageUrl"  type="text"></el-input>
          <el-upload
            class="uploadBanner"
            :action="baseUrl+'/manager/talent/upload.do'"
            :data="fileData"
            :show-file-list='false'
            accept="image/jpeg,image/jpg,image/png"
            :on-success="uploadSucess"
            :before-upload="beforeUpload"
            :on-error="uploadError"
            :file-list="fileList">
            <el-button size="small" type="primary">上传图片</el-button><span style="color:#999;font-size:12px;padding-left:12px;">图片大小:878*340像素</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="下载地址">
          <el-input style="display:inline-block;float:left;" v-model="flagwebsiteTableData.fileUrl" type="text"></el-input>
          <el-upload
            class="uploadBanner"
            :action="baseUrl+'/manager/resource/upfile.do'"
            :show-file-list='false'
            :on-success="uploadSucess2"
            :before-upload="beforeUpload2"
            :on-error="uploadError"
            :file-list="fileList">
            <el-button size="small" type="primary">上传附件</el-button><span style="color:#999;font-size:12px;padding-left:12px;">附件大小:1M</span>
          </el-upload>
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="puchaDrag=false">取 消</el-button>
          <el-button type="primary" @click="updateTabledata()">{{updateOrAddHtml}}</el-button>
      </div>
    </el-dialog>
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
        flagwebsiteTableData:'',
        pageTotalnum:0,//数据总数
        pageNum:1,//页码
        pageSize:10,//默认每页数据量
        typeIndex:1,//序号开始
        keyword:'',//搜索
        websiteTableDataloading:true,//表格数据展示
        puchaDrag:false,
        fileList:[],
        fileData:'',
        updateOrAddHtml:'确认修改',
        updatOrAdd:'update',
        fileData:{
          type:'nsi-official/magazine/img/'//上传图片参数
        },
      }
    },
    methods:{
      addDatum(){
        this.puchaDrag=true
        this.updatOrAdd='add'
        this.updateOrAddHtml='确认添加'
        this.flagwebsiteTableData={
              type:'',
              imageUrl:'',
              fileName:'',
              fileUrl:'',
              year:''
        }
      },
      //跟新和添加操作
      updateTabledata(){
        var that=this
        let flagStr='?'
        for(let key in this.flagwebsiteTableData){
          if(key=='createTime'){

          }else{
            flagStr+=key+'='+this.flagwebsiteTableData[key]+'&'
          }
          
        }
        flagStr=flagStr.slice(0,flagStr.length-1)
        let url=that.baseUrl + "/manager/resource/add.do"+flagStr
        let Vuemessage='添加失败'
        if(that.updatOrAdd==='add'){
            url=that.baseUrl + "/manager/resource/add.do"+flagStr
            Vuemessage='添加失败'
        }else{
            url=that.baseUrl + "/manager/resource/update.do"+flagStr
            Vuemessage='更新失败'
        }
        that.$axios.get(url).then(function(response){
          that.$message({
            message: response.data.msg,
            type: 'success'
          });
          that.getWebsiteTable()
          that.puchaDrag=false
        }).catch(function (response){
          that.$message({
            message: Vuemessage,
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
        this.flagwebsiteTableData.imageUrl=response.data.url
        //this.uploadImgSrc=response.data.url
        //this.uploadImgStatus=true
      },
      uploadSucess2(response, file, fileList){
        this.uploadLoading=false
        this.$message({
          message: '附件上传成功',
          type: 'success'
        });
        this.flagwebsiteTableData.fileUrl=response.data.url
        //this.uploadImgSrc=response.data.url
        //this.uploadImgStatus=true
      },
      //文件上传失败
      uploadError(err, file, fileList){
        this.uploadLoading=false
        this.$message({
          message: '上传失败',
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
      //文件上传过程
      beforeUpload2(file){
        this.uploadLoading=true
        let uploadStatus=true
        let fileSize=(file.size)/1024
        if(fileSize>1024){
          uploadStatus=false
          this.uploadLoading=false
          this.$message({
            message: '文件大小 不能超过1M',
            type: 'error'
          });
        }
        return uploadStatus
      },
      //获取表格数据
      getWebsiteTable(){
        var that=this
        let url=this.baseUrl + "/manager/resource/list.do"+"?pageNum="+this.pageNum+"&pageSize="+this.pageSize+""
        this.$axios.get(url).then(function(response){
          console.log(response)
          that.pageTotalnum=response.data.data.total
          that.websiteTableData=response.data.data.list
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
        this.puchaDrag=true
        this.websiteTableData.forEach(item=>{
          if(newsId==item.id){that.flagwebsiteTableData=item}
        })
        this.updateOrAddHtml='确认修改'
        this.updatOrAdd='update'
      },
      //删除资讯
      deleteWebsiteTableData(articleId){
        var that=this
        that.$confirm('此操作将删除该条资讯,且无法恢复, 是否继续?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          let url=that.baseUrl + "/manager/resource/del.do"+"?resourceId="+articleId
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
