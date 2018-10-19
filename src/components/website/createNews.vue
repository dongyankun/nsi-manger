<template>
<div v-loading.fullscreen="uploadLoading" element-loading-text="图片上传中" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <!-- 表单 -->
    <el-form ref="createNewsform" status-icon :rules="rules" class="createNews" :model="form" label-width="100px">
      <el-form-item label="资讯标题：" prop="title" required>
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="资讯摘要：" prop="summary" required>
          <el-input :autosize="{ minRows: 4, maxRows: 8}" type="textarea" v-model="form.summary"></el-input><span style="position:absolute;left:410px;bottom:-10px;color:#999" >{{form.summary.length}}/55</span>
      </el-form-item>
      <el-form-item label="作者/编辑：" prop="articleWriter" required>
         <el-input v-model="form.articleWriter"></el-input>
      </el-form-item>
        <div style="padding:20px;">  
            <div style="margin-top:20px;text-align: left;">
              <span class="inforImgLabel"><span style="color:#F00;padding:1px 2px;">*</span>资讯封面：</span> 
              <img :src="uploadImgSrc" width="150" height="80" alt="">
              <input type="file" style="display:none" id="change" accept="image" @change="change">  
              <label for="change" class="imgInputLabel">更改图片</label>  
            </div> 
            <p style="color:#999;text-align:left;text-indent:80px;margin-top:10px;font-size:16px;">注意:文件大小限制<span style="color:#000;font-size:14px;">300kb</span>,尺寸为<span style="color:#000;font-size:14px;">750*400</span>像素最佳</p>   
        </div> 
        <div class="container" v-show="cropperStatus">  
            <div style="width: 800px;height: 500px;overflow:hidden;margin-left:100px;">  
                <img id="image" :src="cropperImgUrl" alt="Picture">  
            </div>
            <el-button type="primary" class="makeSure" @click="uploadCutImg">确定上传</el-button>
        </div> 
      <el-form-item label="是否公开：">
        <el-switch v-model="form.visible"></el-switch>
      </el-form-item>
      <el-form-item label="模板类型：">
        <el-radio-group v-model="form.siftType" size="medium">
          <el-radio border @change="siftTypeChange" label="新闻类文章"></el-radio>
          <el-radio border @change="siftTypeChange" label="活动类文章"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文章类型：">
        <el-radio-group class="radioBox" v-model="form.articleCat" size="medium">
          <el-radio border :disabled="articleCatStatus" label="资讯全览"></el-radio>
          <el-radio border :disabled="articleCatStatus" label="政策解读"></el-radio>
          <el-radio border :disabled="articleCatStatus" label="行业分析"></el-radio>
          <el-radio border :disabled="articleCatStatus" label="访校观察"></el-radio>
          <el-radio border :disabled="articleCatStatus" label="人物访谈"></el-radio>
        </el-radio-group>
      </el-form-item>
       <el-form-item label="文章版权：">
        <el-radio-group v-model="copyright" size="medium">
          <el-radio border :disabled="articleCopyright" @change="articleCatChange" label="原创文章"></el-radio>
          <el-radio border :disabled="articleCopyright" @change="articleCatChange" label="转载文章"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="转载名称：">
        <el-input :disabled="articleCatOwn" v-model="form.articleSourceTitle"></el-input>
      </el-form-item>
      <el-form-item label="转载链接：">
        <el-input :disabled="articleCatOwn" v-model="form.articleSourceAdress"></el-input>
      </el-form-item>
      <div ref="editor" style="text-align:left;"></div>
      <el-form-item>
        <el-button @click="createNewsFun" class="createNews" type="primary">{{updateOrAdd}}</el-button>
        <el-button @click="backRouter" class="createNews" type="primary">返回</el-button>
      </el-form-item>
    </el-form>
</div>
   
</template>

<script>
  //引入编辑器
  import E from 'wangeditor'
  import Cropper from "cropperjs"
  export default {
    data() {
      var summary = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入资讯摘要'));
        } else if(value.length>55){
          callback(new Error('资讯摘要文本长度在55之下'));
        }else{
          callback();
        }
      };
      return {
        picValue: "",//input数据
        cropper: "",//图片裁剪对象
        croppable: false,//图片裁剪是否准备好
        cropperImgUrl: "",//改变iputfile时图片改变
        imgCropperData: {//接受的图片类型
          accept: "image/jpeg, image/png, image/jpg"
        },
        cropperStatus:false,//是否显示裁剪
        uploadImgSrc:'',//要上传的图片
        form: {
          title: '',//标题 
          summary: '',//摘要
          articleWriter: '',//作者
          siftType:'新闻类文章',//资讯类型
          visible: true,//是否公开
          articleCat:'资讯全览',//文章类型
          articleSourceTitle:'新学说',//转载名称
          articleSourceAdress:'http://xinxueshuo.cn/',//转载链接
        },
        copyright:'原创文章',//文章版权
        articleCatStatus:false,//文章类型状态
        articleCatOwn:true,//是否是独家原创
        articleCopyright:false,//文章版权状态
        websiteNewsId:'',//如果是修改保存id
        updateOrAdd:'立即创建',//立即创建或确认修改
        articleContent:'',//编辑器返回的值
        fileData:{
          type:'nsi-official/article/'//上传图片参数
        },
        uploadLoading:false,//上传图片loading
        uploadImgStatus:false,//预览图片状态
        //表单规则
        rules: {
          title: [
            { required: true, message: '请输入资讯标题', trigger: 'blur' }
          ],
          summary: [{ validator: summary, trigger: 'blur' }],
          articleWriter: [
            { required: true, message: '请输入作者', trigger: 'blur' }
          ]
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
      //上传图片
      uploadCutImg(){
        this.uploadLoading=true
        this.cropperStatus = false;
        var croppedCanvas;
        var roundedCanvas;
        if (!this.croppable) {
          return;
        }
        croppedCanvas = this.cropper.getCroppedCanvas({width:750,height:400});
        this.uploadImgSrc = croppedCanvas.toDataURL("image/jpeg",.5);
        this.uploadImgSrc=this.uploadImgSrc.slice(23,)
        //上传图片
        this.postImg();
      },
      //取消上传
      cancel() {
          this.cropperStatus = false;
          var obj = document.getElementById('change') ; 
          obj.outerHTML=obj.outerHTML; 
      },
      //创建url路径
      getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) {
          // basic
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
          // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
          // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        }
        return url;
      },
      //input框change事件，获取到上传的文件
      change(e) {
        var that=this
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        let type = files[0].type; //文件的类型，判断是否是图片
        let size = files[0].size; //文件的大小，判断图片的大小
        if (this.imgCropperData.accept.indexOf(type) == -1) {
          that.$message({
              message: '请选择我们支持的图片格式！',
              type: 'error'
          });
          return false;
        }
        if (size > 307200||size < 51200) {
          that.$message({
              message: '请选择50kb-300kb大小的图片！',
              type: 'error'
          });
          return false;
        }
        this.picValue = files[0];
        this.cropperImgUrl = this.getObjectURL(this.picValue);
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload=function(){
          let imgUrlBase64=this.result
          var image = new Image();
          image.src= imgUrlBase64;
          image.onload=function(){
               let width=image.width
               let height=image.height
               if(width==750&&height==400){
                  that.postImg(imgUrlBase64.slice(23,))
                  that.uploadLoading=true
               }else{
                  that.$message({
                      message: '图片必须为750*400像素',
                      type: 'error'
                  });
                  // that.cropperStatus=true
                  // //每次替换图片要重新得到新的url
                  // if (that.cropper) {
                  //   that.cropper.replace(that.cropperImgUrl);
                  // }
                  // that.cropperStatus = true;
               }
          };
        }
      },
      //提交上传函数
      postImg(imgurl) {
        var that=this
        if(imgurl){this.uploadImgSrc=imgurl}
        var formData =new URLSearchParams();
        formData.append('strImage', this.uploadImgSrc);
        formData.append("type", 'nsi-official/article/');
        let url=that.baseUrl+'/manager/talent/get_base64_image.do'
        that.$axios.post(url,formData).then(resp => {
            that.uploadImgSrc=resp.data.data.url
            that.uploadLoading=false
            that.$message({
              message: '提交图片成功',
              type: 'success'
            });
        }).catch(err=>{
            that.uploadLoading=false
            that.$message({
              message: '提交图片失败',
              type: 'error'
            });
        })
        //console.log(this.uploadImgSrc)
      },
      //立即创建
      createNewsFun(){
        var that=this
        this.$refs.createNewsform.validate((valid) => {
          if(valid&&that.articleContent!=''&&that.uploadImgSrc!='') {
            that.setLoader()
            let url=that.baseUrl+'/manager/article/add.do'
            let addNews=new URLSearchParams();
            let successMessage='新建资讯成功'
            let errorMessage='修改资讯失败'
            if(that.websiteNewsId==''){
              url=that.baseUrl+'/manager/article/add.do'
              successMessage='新建资讯成功'
              errorMessage='修改资讯失败'
            }else{
              url=that.baseUrl+'/manager/article/update.do'
              addNews.append('id',that.websiteNewsId);
              successMessage='修改资讯成功'
              errorMessage='修改资讯失败'
            }
            let flagvisible=0
            if(that.form.visible){flagvisible=1}
            addNews.append('title',that.form.title);
            addNews.append('summary',that.form.summary);
            addNews.append('articleWriter',that.form.articleWriter);
            addNews.append('siftType',that.form.siftType);
            addNews.append('visible',flagvisible);
            addNews.append('articleContent',that.articleContent);
            addNews.append('coverImage',that.uploadImgSrc);
            addNews.append('articleCat',that.form.articleCat);
            addNews.append('articleSourceTitle',that.form.articleSourceTitle);
            let flagarticleSourceAdress=that.form.articleSourceAdress
            if(flagarticleSourceAdress.startsWith('www.')){
              flagarticleSourceAdress="http://"+flagarticleSourceAdress
            }
            addNews.append('articleSourceAdress',flagarticleSourceAdress);
            that.$axios.post(url,addNews).then(resp => {
                that.$message({
                  message: successMessage,
                  type: 'success'
                });
                that.loading.close()
                that.$router.push({path:'/website/index'});
            }).catch(err=>{
                that.loading.close()
                that.$message({
                  message: errorMessage,
                  type: 'error'
                });
            })
          } else {
              that.$message.error('有内容为空，提交失败');
              return false;
          }
        });
      },
      //改变模版类型
      siftTypeChange(type){
        if(type=='新闻类文章'){
          this.articleCatStatus=false
          this.articleCopyright=false
        }else{
          this.articleCatStatus=true
          this.articleCopyright=true
          this.articleCatOwn=true
          this.copyright='原创文章'
          this.form.articleCat='资讯全览'
          this.form.articleSourceTitle='新学说'
          this.form.articleSourceAdress='http://xinxueshuo.cn/'
        }
      },
      //是否是原创
      articleCatChange(type){
        if(type!='原创文章'){
          this.articleCatOwn=false
          this.form.articleSourceTitle=''
          this.form.articleSourceAdress=''
        }else{
          this.articleCatOwn=true
          this.form.articleSourceTitle='新学说'
          this.form.articleSourceAdress='http://xinxueshuo.cn/'
        }
      },
      //返回上一级
      backRouter(){
        this.$router.push({path:'/website/index'});
      },
    },
    //加载编辑器
    mounted(){
      var that=this
      that.setLoader()
      //初始化裁剪插件
      //初始化这个裁剪框
      var image = document.getElementById("image");
      this.cropper = new Cropper(image, {
        aspectRatio: 15 / 8,
        minContainerWidth:800,
        minContainerHeight:450,
        minCanvasWidth:800,
        minCanvasHeight:400,
        viewMode: 0,
        background: true,
        scalable:true,
        zoomable: true,
        cropBoxResizable:true,
        ready: function() {
          that.croppable = true;
        }
      });
      //加载编辑器组件
      var editor = new E(this.$refs.editor)
      editor.customConfig.onchange = (html) => {
        this.articleContent = html
      }
      editor.customConfig.uploadImgServer = that.baseUrl+'/manager/talent/upload.do'
      editor.customConfig.uploadImgParams = {
          'type':'nsi-official/article/'//上传图片参数
      }
      editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {
            that.uploadLoading=true
        },
        success: function (xhr, editor, result) {
            that.uploadLoading=false
            that.$message({
              message: '图片上传成功',
              type: 'success'
            });
        },
        fail: function (xhr, editor, result) {
            that.uploadLoading=false
            that.$message({
              message: '图片上传成功,但未插入',
              type: 'error'
            });
        },
        error: function (xhr, editor) {
            that.uploadLoading=false
            that.$message({
              message: '图片上传失败',
              type: 'error'
            });
        },
        timeout: function (xhr, editor) {
            that.uploadLoading=false
            that.$message({
              message: '上传图片超时,请检查网络连接',
              type: 'error'
            });
        },
        customInsert: function (insertImg, result, editor) {
            var url = result.data.url
            insertImg(url)
        }
      }
      editor.customConfig.uploadFileName = 'file'
      editor.customConfig.uploadImgTimeout = 10000
      editor.customConfig.pasteTextHandle = function (content) {
          if(content.indexOf('"=""')>=0){
            that.$message({
              message: '文章有不规范字符,请粘贴纯文本',
              type: 'error'
            });
          }
          return content.replace(/<img src="http:\/\//g,'<img src="https://')

      }
      editor.create()
      //请求默认信息填充
      let websiteNewsId=that.$store.state.websiteNewsId
      //保存NewsId
      that.websiteNewsId=websiteNewsId
      if(websiteNewsId==''){
        that.loading.close();
        return;
      }
      that.updateOrAdd='确认修改'
      //编辑请求默认资讯
      let url=that.baseUrl + "/manager/article/detail.do"+"?articleId="+websiteNewsId
      that.$axios.get(url).then(function(response){
        let data=response.data.data
        that.form.title=data.title
        that.form.summary=data.summary
        that.form.articleWriter=data.articleWriter
        that.form.siftType=data.siftType?data.siftType:'新闻类文章'
        that.form.articleCat=data.articleCat?data.articleCat:'资讯全览'
        that.form.articleSourceTitle=data.articleSourceTitle
        that.form.articleSourceAdress=data.articleSourceAdress
        if(that.form.siftType=='活动类文章'){
          this.articleCatStatus=true
          this.articleCopyright=true
          this.articleCatOwn=true
          that.form.articleCat='资讯全览'
          that.form.articleSourceTitle='新学说'
          that.form.articleSourceAdress='http://xinxueshuo.cn/'
        }
        if(that.form.articleSourceTitle=='新学说'){
          that.copyright='原创文章'
          that.articleCatOwn=true
        }else{
          that.copyright='转载文章'
          that.articleCatOwn=false
        }
        that.articleContent=response.data.data.articleContent
        //调用编辑器方法，默认数据
        editor.cmd.do('insertHTML', that.articleContent)
        that.uploadImgSrc=response.data.data.coverImage
        that.uploadImgStatus=true
        if(response.data.data.visible==1){
          that.form.visible=true
        }else{
          that.form.visible=false
        }
        that.loading.close();
        
      }).catch(function (response){
        that.loading.close();
        that.$message({
          message: '数据请求失败',
          type: 'error'
        });
      });
    }
  }
</script>
<style>
.imgInputLabel{
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #409eff;
  border: 1px solid #dcdfe6;
  border-color: #dcdfe6;
  color: #fff;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: .1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.makeSure{
  margin-top: 20px;
}
.inforImgLabel{
  text-align: right;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
img{
  max-height: 100%;
}
.show { 
 width: 100px; 
 height: 100px; 
 overflow: hidden; 
 position: relative; 
 border-radius: 50%; 
 border: 1px solid #d5d5d5; 
}
#image { 
 max-width: 100%; 
} 
/*! 
 * Cropper.js v1.0.0-rc 
 * https://github.com/fengyuanchen/cropperjs 
 * 
 * Copyright (c) 2017 Fengyuan Chen 
 * Released under the MIT license 
 * 
 * Date: 2017-03-25T12:02:21.062Z 
 */
.cropper-container {
  font-size: 0;
  line-height: 0;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  direction: ltr;
  -ms-touch-action: none;
  touch-action: none;
}
.cropper-container img {
  display: block;
  min-width: 0 !important;
  max-width: none !important;
  min-height: 0 !important;
  max-height: none !important;
  width: 100%;
  height: 100%;
  image-orientation: 0deg;
}
.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.cropper-wrap-box {
  overflow: hidden;
}
.cropper-drag-box {
  opacity: 0;
  background-color: #fff;
}
.cropper-modal {
  opacity: 0.5;
  background-color: #000;
}
.cropper-view-box {
  display: block;
  overflow: hidden;
  width: 100%;
  height: 100%;
  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
}
.cropper-dashed {
  position: absolute;
  display: block;
  opacity: 0.5;
  border: 0 dashed #eee;
}
.cropper-dashed.dashed-h {
  top: 33.33333%;
  left: 0;
  width: 100%;
  height: 33.33333%;
  border-top-width: 1px;
  border-bottom-width: 1px;
}
.cropper-dashed.dashed-v {
  top: 0;
  left: 33.33333%;
  width: 33.33333%;
  height: 100%;
  border-right-width: 1px;
  border-left-width: 1px;
}
.cropper-center {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 0;
  height: 0;
  opacity: 0.75;
}
.cropper-center:before,
.cropper-center:after {
  position: absolute;
  display: block;
  content: " ";
  background-color: #eee;
}
.cropper-center:before {
  top: 0;
  left: -3px;
  width: 7px;
  height: 1px;
}
.cropper-center:after {
  top: -3px;
  left: 0;
  width: 1px;
  height: 7px;
}
.cropper-face,
.cropper-line,
.cropper-point {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0.1;
}
.cropper-face {
  top: 0;
  left: 0;
  background-color: #fff;
}
.cropper-line {
  background-color: #39f;
}
.cropper-line.line-e {
  top: 0;
  right: -3px;
  width: 5px;
  cursor: e-resize;
}
.cropper-line.line-n {
  top: -3px;
  left: 0;
  height: 5px;
  cursor: n-resize;
}
.cropper-line.line-w {
  top: 0;
  left: -3px;
  width: 5px;
  cursor: w-resize;
}
.cropper-line.line-s {
  bottom: -3px;
  left: 0;
  height: 5px;
  cursor: s-resize;
}
.cropper-point {
  width: 5px;
  height: 5px;
  opacity: 0.75;
  background-color: #39f;
}
.cropper-point.point-e {
  top: 50%;
  right: -3px;
  margin-top: -3px;
  cursor: e-resize;
}
.cropper-point.point-n {
  top: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: n-resize;
}
.cropper-point.point-w {
  top: 50%;
  left: -3px;
  margin-top: -3px;
  cursor: w-resize;
}
.cropper-point.point-s {
  bottom: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: s-resize;
}
.cropper-point.point-ne {
  top: -3px;
  right: -3px;
  cursor: ne-resize;
}
.cropper-point.point-nw {
  top: -3px;
  left: -3px;
  cursor: nw-resize;
}
.cropper-point.point-sw {
  bottom: -3px;
  left: -3px;
  cursor: sw-resize;
}
.cropper-point.point-se {
  right: -3px;
  bottom: -3px;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  opacity: 1;
}
@media (min-width: 768px) {
  .cropper-point.point-se {
    width: 15px;
    height: 15px;
  }
}
@media (min-width: 992px) {
  .cropper-point.point-se {
    width: 10px;
    height: 10px;
  }
}
@media (min-width: 1200px) {
  .cropper-point.point-se {
    width: 5px;
    height: 5px;
    opacity: 0.75;
  }
}
.cropper-point.point-se:before {
  position: absolute;
  right: -50%;
  bottom: -50%;
  display: block;
  width: 200%;
  height: 200%;
  content: " ";
  opacity: 0;
  background-color: #39f;
}
.cropper-invisible {
  opacity: 0;
}
.cropper-bg {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
}
.cropper-hide {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
}
.cropper-hidden {
  display: none !important;
}
.cropper-move {
  cursor: move;
}
.cropper-crop {
  cursor: crosshair;
}
.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}
</style>
