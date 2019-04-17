<template>
  <div v-loading.fullscreen="uploadLoading" element-loading-text="图片上传中" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" style="min-width:900px;">
    <el-row :gutter="20">
      <div class="bannerTitle">左侧banner</div>
      <el-col style="margin-top:20px;" :span="12" v-for="(data, index) in leftCardDatas" :key="data.id">
        <el-card style="height:314px;" :body-style="{ padding: '0px' }">
          <el-row>
            <el-col :span="24"><img class="cardImg" width="439" height="170" :src="data.content01"></el-col>
            <el-col :span="24">
              <img class="cardImg" width="200" height="85" :src="data.content03">
              <div class="bannerInfo" style="padding: 14px;display:inline-block;">
                <p>{{'pc端图片地址:'+data.content01}}</p>
                <p>{{'手机端图片地址:'+data.content03}}</p>
                <p>{{'跳转链接:'+data.content02}}</p>
                <div class="bottom clearfix">
                  <time class="time"></time>
                  <el-button type="text" @click="updateCardData(data.id,1)" class="button">编辑</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <div class="bannerTitle">右侧上方banner</div>
      <el-col :span="8" v-for="(data1, index) in rightTopCardDatas" :key="data1.id">
        <el-card :body-style="{ padding: '0px' }">
          <img class="cardImg" width="200" height="200" :src="data1.content01">
          <div style="padding: 14px;">
            <p>{{'图片地址:'+data1.content01}}</p>
            <p>{{'跳转链接:'+data1.content02}}</p>
            <div class="bottom clearfix">
              <time class="time"></time>
              <el-button type="text" @click="updateCardData(data1.id,0)" class="button">编辑</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <div class="bannerTitle">右侧下方banner</div>
      <el-col :span="8" v-for="(data2, index) in rightBottomCardDatas" :key="data2.id">
        <el-card :body-style="{ padding: '0px' }">
          <img class="cardImg" width="200" height="200" :src="data2.content01">
          <div style="padding: 14px;">
            <p>{{'图片地址:'+data2.content01}}</p>
            <p>{{'跳转链接:'+data2.content02}}</p>
            <div class="bottom clearfix">
              <time class="time"></time>
              <el-button type="text" @click="updateCardData(data2.id,0)" class="button">编辑</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
     <!-- 修改banner -->
    <el-dialog
      title="修改banner信息"
      :modal-append-to-body="false"
      :visible.sync="puchaDrag"
      width="50%">
      <el-form ref="nowCardDatasFrom" :model="nowCardDatas" :rules="rules" status-icon label-width="140px" class="updateCardForm">
        <el-form-item prop="content01" required label="pc端图片地址">
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
            <el-button size="small" type="primary">上传图片</el-button><span style="color:#999;font-size:12px;padding-left:12px;">图片大小:{{imgSize}}像素</span>
          </el-upload>
        </el-form-item>
        <el-form-item v-show="mobileImgStatus" prop="content03" required label="手机端图片地址">
          <el-input style="display:inline-block;float:left;" v-model="nowCardDatas.content03"  type="text"></el-input>
          <el-upload
            class="uploadBanner"
            :action="baseUrl+'/manager/talent/upload.do'"
            :data="fileData"
            :show-file-list='false'
            accept="image/jpeg,image/jpg,image/png"
            :on-success="uploadSucess2"
            :before-upload="beforeUpload"
            :on-error="uploadError"
            :file-list="fileList">
            <el-button size="small" type="primary">上传图片</el-button><span style="color:#999;font-size:12px;padding-left:12px;">图片大小:664*304像素</span>
          </el-upload>
        </el-form-item>
        <el-form-item prop="content02" required label="跳转链接">
          <el-input v-model="nowCardDatas.content02" type="text"></el-input>
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
        loading:'',//加载动画
        cardDatas:[],//banner列表
        leftCardDatas:[],//左侧banner
        rightTopCardDatas:[],//右侧上方banner
        rightBottomCardDatas:[],//右侧下方bnaner
        nowCardDatas:{},//要修改的banner
        puchaDrag:false,//修改弹窗
        uploadLoading:false,//上传加载动画
        mobileImgStatus:true,//控制是否有手机端图片
        fileData:{
          type:'nsi-official/article/'//上传图片参数
        },
        imgSize:'860*358',
        fileList:[],//上传图片列表
        rules: {
          content01: [
            { required: true, message: '请输入pc端图片地址', trigger: 'blur' },
          ],
          content02: [
            { required: true, message: '请输入链接地址', trigger: 'blur' },
          ],
          content03: [
            { required: true, message: '请输入手机端图片地址', trigger: 'blur' },
          ],
        }
      }
    },
    methods:{
      //加载动画
      setLoader(){
          this.loading = this.$loading({
            lock: true,
            text: '加载中,请稍候',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
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
          that.puchaDrag=false
        }).catch(function (response){
          that.$message({
            message: '请求活动列表失败',
            type: 'error'
          });
        });
      },
      updateCardData(id,mobileImgStatus){
        this.puchaDrag=true
        if(mobileImgStatus==0){
          this.mobileImgStatus=false
          this.imgSize='289*175'
        }else{
          this.mobileImgStatus=true
          this.imgSize='860*358'
        }
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
        this.nowCardDatas.content01=response.data.url
      },
      uploadSucess2(response, file, fileList){
        this.uploadLoading=false
        this.$message({
          message: '图片上传成功',
          type: 'success'
        });
        this.nowCardDatas.content03=response.data.url
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
        this.setLoader()
        //请求图片列表
        var that=this
        let url=that.baseUrl + "/manager/official/list.do?type=官网首页banner"
        that.$axios.get(url).then(function(response){
          console.log(response.data.data)
          that.cardDatas=response.data.data
          for (let i = 0; i < 6; i++) {
            that.leftCardDatas.push(that.cardDatas[i])
          };
          for (let i = 6; i < 9; i++) {
            that.rightTopCardDatas.push(that.cardDatas[i])
          };
          for (let i = 9; i < 12; i++) {
            that.rightBottomCardDatas.push(that.cardDatas[i])
          };
          that.loading.close()
        }).catch(function (response){
          that.loading.close()
          that.$message({
            message: '请求活动列表失败',
            type: 'error'
          });
        });
    }
  }
</script>