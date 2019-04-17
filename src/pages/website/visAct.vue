<template>
<div v-loading.fullscreen="uploadLoading" element-loading-text="图片上传中" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" style="min-width:900px;">
  <!-- 头部按钮 -->
  <div class="headerBtn">
    <div class="headerBtnLeft">
      <el-button @click="addNowCard"  type="primary">添加活动</el-button>
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
      prop="type"
      align="center"
      label="类型"
      >
    </el-table-column>
    <el-table-column
      align="center"
      label="图片地址"
      >
      <template slot-scope="scope">
              <img :src="scope.row.content01" alt="" style="width: 300px;height:180px">
         </template>
    </el-table-column>
    
    <el-table-column
      prop="content02"
      align="center"
      label="文章标题">
    </el-table-column>
    <el-table-column
      prop="content04"
      label="文章地址"
      align="center"
      >
    </el-table-column>
    <el-table-column
      prop="content05"
      label="文章分类"
      align="center"
      >
    </el-table-column>
     <el-table-column
      prop="textcontent01"
      label="文章内容"
      align="center"
      >
    </el-table-column>
    <el-table-column
      prop="content10"
      label="文章创建时间"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      align="center"
      width="100">
      <template slot-scope="scope">
        <el-button @click.prevent="edit(scope.row.id)" type="text" size="small">修改</el-button>
      </template>
    </el-table-column>
  </el-table>
   <!-- 修改banner -->
    <el-dialog
      title="修改活动信息"
      :modal-append-to-body="false"
      :visible.sync="puchaDrag"
      width="50%">
      <el-form ref="nowCardDatasFrom" :model="nowCardDatas" :rules="rules" status-icon label-width="140px" class="updateCardForm">
        <el-form-item prop="content01" required label="图片地址">
          <el-input style="display:inline-block;float:left;" v-model="nowCardDatas.content01"  type="text"></el-input>
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
            <el-button size="small" type="primary">上传图片</el-button><span style="color:#999;font-size:12px;padding-left:12px;">图片大小:1000*600像素</span>
          </el-upload>
        </el-form-item>
        <el-form-item prop="content02" required label="文章标题">
          <el-input v-model="nowCardDatas.content02" type="text"></el-input>
        </el-form-item>
        <el-form-item prop="content04" required label="文章地址">
          <el-input v-model="nowCardDatas.content04" type="text"></el-input>
        </el-form-item> 
        <el-form-item prop="content05" required label="文章分类">
          <el-input v-model="nowCardDatas.content05" type="text"></el-input>
        </el-form-item> 
        <el-form-item prop="textcontent01" required label="文章内容">
          <el-input v-model="nowCardDatas.textcontent01" type="text"></el-input>
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="puchaDrag=false">取 消</el-button>
          <el-button type="primary" @click="updateNowCardDatas">{{addOrUpdateStart}}</el-button>
      </div>
    </el-dialog>
</div>
  
</template>

<script>
  export default {
    data() {
      return {
        websiteTableData: [],//表格数据
        pageTotalnum:0,//数据总数
        pageNum:1,//页码
        pageSize:30,//默认每页数据量
        typeIndex:1,//序号开始
        keyword:'',//搜索
        websiteTableDataloading:true,//表格数据展示
        puchaDrag:false,
        loading:'',//加载动画
        nowCardDatas:{},//要修改的banner
        uploadLoading:false,//上传加载动画
        addOrUpdateStart:"确认修改",
        addOrUpdate:'add',
        fileData:{
          type:'nsi-official/article/'//上传图片参数
        },
        fileList:[],//上传图片列表
        rules: {
          content01: [
            { required: true, message: '请输入图片地址', trigger: 'blur' },
          ],
          content02: [
            { required: true, message: '请输入文章标题', trigger: 'blur' },
          ],
          content04: [
            { required: true, message: '请输入文章地址', trigger: 'blur' },
          ],
          content05: [
            { required: true, message: '请输入文章分类', trigger: 'blur' },
          ],
          textcontent01: [
            { required: true, message: '请输入文章内容', trigger: 'blur' },
          ],
        }
      }
    },
    methods:{
      //获取表格数据
      getWebsiteTable(){
        var that=this
        that.websiteTableDataloading=true
        let url=this.baseUrl + "/manager/configure/get_configure_list.do"+"?typeName=VIS2018"
        this.$axios.get(url).then(function(response){
          console.log(response)
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
      addNowCard(){
        this.addOrUpdate='add'
        this.addOrUpdateStart="确认添加"
        this.nowCardDatas={
          "type":"",
          "content01":"",
          "content02":"",
          "content04":"",
          "content05":"",
          "textcontent01":"",
        }
        this.puchaDrag=true
      },
      updateNowCardDatas(){
          //吊起修改活动，储存修改id
        let that=this
        let flag=false
        that.$refs.nowCardDatasFrom.validate((valid) => {
          if(!valid){
            that.$message({
              message: '信息不全,禁止提交',
              type: 'error'
            });
            flag=true
          }
        })
        if(flag){
          return
        }
        var formData =new URLSearchParams();
        let url=''
        if(this.addOrUpdate=='update'){
          formData.append('id', that.nowCardDatas.id);
          url=that.baseUrl+'/manager/configure/modify_configure.do'
        }else{
          
          url=that.baseUrl+'/manager/configure/add_configure_info.do'
        }
        
        formData.append('type', "VIS2018");
        formData.append('content01', that.nowCardDatas.content01);
        formData.append("content02", that.nowCardDatas.content02);
        formData.append('content04', that.nowCardDatas.content04);
        formData.append("content05", that.nowCardDatas.content05);
        formData.append('textcontent01', that.nowCardDatas.textcontent01);
        
        that.$axios.post(url,formData).then(resp => {
          if(resp.data.code==0){
            if(this.addOrUpdate=='add'){
              that.$message({
                message: '添加成功',
                type: 'success'
              });
            }else{
              that.$message({
                message: '修改成功',
                type: 'success'
              });
            }
            that.puchaDrag=false
            that.getWebsiteTable()
          }
          
        }).catch(err=>{
             console.log(err)
        })

      },
      //文件上传成功
      uploadSucess(response, file, fileList){
        this.uploadLoading=false
        this.$message({
          message: '图片上传成功',
          type: 'success'
        });
        this.nowCardDatas.content01=response.data.url
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
      //编辑资讯
      edit(newsId){
        console.log(newsId)
        this.addOrUpdate='update'
        this.addOrUpdateStart="确认修改"
        this.puchaDrag=true
        for (var i = 0; i < this.websiteTableData.length; i++) {
          if(newsId==this.websiteTableData[i].id){
            this.nowCardDatas=this.websiteTableData[i]
          }
        };
      },
      //创建新资讯
      createNews(){
        alert(1)
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
.headerBtn{
  margin-bottom:20px;
}
</style>
