<template>
  <div style="min-width:950px;">
    <!-- 活动列表 -->
    <el-row>
      <el-col :span="24" v-for="(data, index) in cardDatas" :key="data.id" >
        <el-card :body-style="{ padding: '0px' }">
          <el-row :gutter="20" class="cardMain">
            <el-col :span="7">
              <ul>
                <li>{{'中文标题:'+data.content01}}</li>
                <li>{{'英文标题:'+data.content02}}</li>
                <li>{{'活动时间:'+data.content03}}</li>
                <li>{{'活动地址:'+data.content04}}</li>
              </ul>
            </el-col>
            <el-col :span="11">
              <p class="cardTextcontent">{{'活动内容:'+data.textcontent01}}</p>
            </el-col>
            <el-col :span="6">
              <img class="cardImg" width="200" height="200" :src="data.content05">
            </el-col>
          </el-row>
          <div class="updateCard">
            <el-button size="small" icon="el-icon-edit" @click="updateCardData(data.id)" type="primary">修改</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 修改活动 -->
    <el-dialog
      title="修改活动信息"
      :modal-append-to-body="false"
      :visible.sync="puchaDrag"
      width="50%">
      <el-form :model="nowCardDatas" :rules="rules" status-icon label-width="100px" class="updateCardForm">
        <el-form-item prop="content01" required label="中文标题">
          <el-input v-model="nowCardDatas.content01"  type="text"></el-input>
        </el-form-item>
        <el-form-item prop="content02" required label="英文标题">
          <el-input v-model="nowCardDatas.content02" type="text"></el-input>
        </el-form-item>
        <el-form-item prop="content03" required label="活动时间">
          <el-input v-model="nowCardDatas.content03" type="text"></el-input>
        </el-form-item>
        <el-form-item prop="content04" required label="活动地址">
          <el-input v-model="nowCardDatas.content04" type="text"></el-input>
        </el-form-item>
        <el-form-item prop="content06" required label="活动序号">
          <el-input v-model="nowCardDatas.content06" type="text"></el-input>
        </el-form-item>
        <el-form-item label="图片地址">
          <el-input class="beforeUploadImg" v-model="nowCardDatas.content05" type="text"></el-input>
           <el-upload
            class="uploadImg"
            :action="baseUrl+'/manager/talent/upload.do'"
            :data="fileData"
            :show-file-list='false'
            accept="image/jpeg,image/jpg,image/png"
            :on-success="uploadSucess"
            :before-upload="beforeUpload"
            :on-error="uploadError"
            :file-list="fileList">
            <el-button size="small" type="primary">上传图片</el-button>
           
          </el-upload>
        </el-form-item>
        <el-form-item prop="textcontent01" required label="活动内容">
          <el-input  v-model="nowCardDatas.textcontent01" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="puchaDrag=false">取 消</el-button>
          <el-button type="primary" @click="updateNowCardDatas">确认修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        
        cardDatas:{},//活动列表
        cardDatasId:0,//活动id
        puchaDrag:false,//修改活动状态
        nowCardDatas:{},//要修改的活动
        fileData:{
          type:'nsi-official/article/'//上传图片参数
        },
        fileList:[],//上传图片列表
        rules: {
          content01: [
            { required: true, message: '请输入中文标题', trigger: 'blur' },
          ],
          content02: [
            { required: true, message: '请输入英文标题', trigger: 'blur' },
          ],
          content03: [
            { required: true, message: '请输入活动时间', trigger: 'blur' },
          ],
          content04: [
            { required: true, message: '请输入活动地址', trigger: 'blur' },
          ],
          content06: [
            { required: true, message: '请输入活动序号', trigger: 'blur' },
          ],
          textcontent01: [
            { required: true, message: '请输入活动内容', trigger: 'blur' },
          ],
        }
      }
    },
    methods:{
      //修改活动
      updateNowCardDatas(){

        var that=this
        let flagStr='?'
        for(let key in this.nowCardDatas){
          flagStr+=key+'='+this.nowCardDatas[key]+'&'
        }
        flagStr=flagStr.slice(0,flagStr.length-1)
        let url=that.baseUrl + "/manager/official/update.do"+flagStr
        that.$axios.get(url).then(function(response){
          that.$message({
            message: response.data.msg,
            type: 'success'
          });
        }).catch(function (response){
          that.$message({
            message: '请求活动列表失败',
            type: 'error'
          });
        });
      },
      //吊起修改活动，储存修改id
      updateCardData(id){
        this.cardDatasId=id
        this.puchaDrag=true
        for (var i = 0; i < this.cardDatas.length; i++) {
          if(id==this.cardDatas[i].id){
            this.nowCardDatas=this.cardDatas[i]
          }
        };
      },
      //文件上传成功
      uploadSucess(response, file, fileList){
        this.uploadLoading=false
        this.$message({
          message: '图片上传成功',
          type: 'success'
        });
        this.uploadImgSrc=response.data.url
        this.uploadImgStatus=true
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
      }
    },
    created(){
        //请求图片列表
        var that=this
        let url=that.baseUrl + "/manager/official/list.do?type=官网首页活动"
        that.$axios.get(url).then(function(response){
          that.cardDatas=response.data.data
          
        }).catch(function (response){
          that.$message({
            message: '请求活动列表失败',
            type: 'error'
          });
        });
    }
  }
</script>