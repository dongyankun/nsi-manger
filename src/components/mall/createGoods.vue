<template>
<div v-loading.fullscreen="uploadLoading" element-loading-text="图片上传中" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <!-- 表单 -->
    <el-form ref="createNewsform" status-icon :rules="rules" class="createNews" :model="form" label-width="100px">
      <el-form-item label="商品名称" prop="goodsName" required>
        <el-input v-model="form.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="作者：" prop="goodsAuthor" required>
         <el-input v-model="form.goodsAuthor"></el-input>
      </el-form-item>
      <el-form-item label="价格：" prop="goodsPrice" required>
         <el-input v-model="form.goodsPrice"></el-input>
      </el-form-item>
        <div style="padding:20px;">  
            <div style="margin-top:20px;text-align: left;">
              <span class="inforImgLabel"><span style="color:#F00;padding:1px 2px;">*</span>商品封面：</span> 
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
     
        <el-form-item label="出版社：" prop="goodsPress" required>
         <el-input v-model="form.goodsPress"></el-input>
        </el-form-item>
         <el-form-item label="出版时间：" prop="goodsPubdate" required>
            <el-date-picker
                v-model="form.goodsPubdate"
                type="year"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
         <el-form-item label="商品类型：" prop="goodsType" required>
           <el-radio-group v-model="form.goodsType" size="medium">
            <el-radio border label="新学说书籍"></el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="库存：" prop="goodsStock" required>
             <el-input-number v-model="form.goodsStock" :min="1" :max="9999" label="描述文字"></el-input-number>
        </el-form-item>
         <el-form-item label="权重：" prop="goodsLevel" required>
             <el-input-number class="TextLeft" v-model="form.goodsLevel" :min="1" :max="5" label="描述文字"></el-input-number>
        </el-form-item>
         <el-form-item label="标签：" prop="goodsLabel" required>
         <el-input v-model="form.goodsLabel"></el-input>
        </el-form-item>
        <el-form-item label="系列：" prop="goodsSeries" required>
         <el-input v-model="form.goodsSeries"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio-group v-model="form.goodsState" size="medium">
            <el-radio border @change="siftTypeChange" label="上架"></el-radio>
            <el-radio border @change="siftTypeChange" label="下架"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="销量：" prop="goodsSales" required>
            <el-input v-model="form.goodsSales" label="描述文字"></el-input>
        </el-form-item>
        <el-form-item label="访问量：" prop="goodsVisitcount" required>
             <el-input v-model="form.goodsVisitcount" label="描述文字"></el-input>
        </el-form-item>
        <el-form-item label="商品描述：" prop="goodsDescribe" required>
         <el-input :autosize="{ minRows: 4, maxRows: 8}" type="textarea" v-model="form.goodsDescribe"></el-input>
        </el-form-item>
        <div ref="editor" style="text-align:left;"></div>
      <div>
        <el-button @click="createNewsFun" class="createNews" type="primary">{{updateOrAdd}}</el-button>
        <el-button @click="backRouter" class="createNews comebackHome" type="primary">返回</el-button>
      </div>
    </el-form>
</div>
   
</template>

<script>
  //引入编辑器
  import E from 'wangeditor'
  import Cropper from "cropperjs"
  export default {
    data() {
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
          goodsName: '',
          goodsAuthor: '',
          goodsPress: '',
          goodsPubdate:'',
          goodsType: '新学说书籍',
          goodsStock:'',
          goodsLevel:'',
          goodsLabel:'',
          goodsSeries:'',
          goodsState:'',
          goodsSales:'',
          goodsVisitcount:'',
          goodsDescribe:'',
          goodsPrice:''
        },
        updateOrAdd:'立即创建',//立即创建或确认修改
        fileData:{
          type:'nsi-official/article/'//上传图片参数
        },
        articleContent:'',//编辑器返回的值
        uploadLoading:false,//上传图片loading
        uploadImgStatus:false,//预览图片状态
        //表单规则
        rules: {
          goodsName: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          goodsAuthor: [
            { required: true, message: '请输入作者', trigger: 'blur' }
          ],
          goodsPress: [
            { required: true, message: '请输入出版社', trigger: 'blur' }
          ],
          goodsPubdate: [
            { required: true, message: '请输入出版时间', trigger: 'blur' }
          ],
          goodsPrice: [
            { required: true, message: '请输入商品价格', trigger: 'blur' }
          ],
          goodsType: [
            { required: true, message: '请输入商品类型', trigger: 'blur' }
          ],
          goodsStock: [
            { required: true, message: '请输入库存', trigger: 'blur' }
          ],
          goodsLevel: [
            { required: true, message: '请输入权重', trigger: 'blur' }
          ],
          goodsLabel: [
            { required: true, message: '请输入标签', trigger: 'blur' }
          ],
          goodsSeries: [
            { required: true, message: '请输入系列', trigger: 'blur' }
          ],
          goodsState: [
            { required: true, message: '请输入状态', trigger: 'blur' }
          ],
          goodsSales: [
            { required: true, message: '请输入销量', trigger: 'blur' }
          ],
          goodsVisitcount: [
            { required: true, message: '请输入访问量', trigger: 'blur' }
          ],
          goodsDescribe: [
            { required: true, message: '请输入商品描述', trigger: 'blur' }
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
          if(valid&&that.uploadImgSrc!='') {
            that.setLoader()
            let url=that.baseUrl+'/goods/goods_add.do'
            let addNews=new URLSearchParams();
            let successMessage='新建资讯成功'
            let errorMessage='修改资讯失败'
            if(that.$route.params.id=='add'){
              url=that.baseUrl+'/goods/goods_add.do'
              successMessage='添加商品成功'
              errorMessage='添加商品失败'
            }else{
              url=that.baseUrl+'/manager/article/update.do'
              addNews.append('id',that.websiteNewsId);
              successMessage='修改商品信息成功'
              errorMessage='修改商品信息失败'
            }
            addNews.append('goodsPrice',that.form.goodsPrice);
            addNews.append('goodsImg',that.uploadImgSrc);
            addNews.append('goodsName',that.form.goodsName);
            addNews.append('goodsAuthor',that.form.goodsAuthor);
            addNews.append('goodsPress',that.form.goodsPress);
            addNews.append('goodsPubdate',that.form.goodsPubdate);
            addNews.append('goodsType',that.form.goodsType);
            addNews.append('goodsStock',that.form.goodsStock);
            addNews.append('goodsLevel',that.form.goodsLevel);
            addNews.append('goodsLabel',that.form.goodsLabel);
            addNews.append('goodsSeries',that.form.goodsSeries);
            addNews.append('goodsState',that.form.goodsState);
            addNews.append('goodsSales',that.form.goodsSales);
            addNews.append('goodsVisitcount',that.form.goodsVisitcount);
            addNews.append('goodsDescribe',that.form.goodsDescribe);
            addNews.append('goodsInfo',that.articleContent);
            that.$axios.post(url,addNews).then(resp => {
                that.$message({
                  message: successMessage,
                  type: 'success'
                });
                that.loading.close()
                that.$router.push({path:'/mall/goods'});
            }).catch(err=>{
                that.loading.close()
                that.$message({
                  message: errorMessage,
                  type: 'error'
                });
            })
          } else {
              that.$message.error('请添加封面图片');
              return false;
          }
        });
      },
      dateToDateNum(endTime){
        var date=new Date();
		date.setFullYear(endTime.substring(0,4));
		date.setMonth(endTime.substring(5,7)-1);
		date.setDate(endTime.substring(8,10));
		return Date.parse(date)/1000;
      },
      //保存模板
      createNewstemplate(){
        var that=this
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
            addNews.append('visible',0);
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
                  message: '文章已经自动保存为草稿',
                  type: 'success'
                });
            }).catch(err=>{
                that.$message.error('自动保存为草稿失败，请注意及时保存');
                that.loading.close()
            })
      },
      //改变模版类型
      siftTypeChange(type){
        this.form.goodsState=type
      },
      //返回上一级
      backRouter(){
        this.$router.push({path:'/mall/goods'});
      },
    },
    //加载编辑器
    mounted(){
      var that=this
      that.setLoader()
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
      if(that.$route.params.id=='add'){
        that.loading.close();
        return;
      }
      that.updateOrAdd='确认修改'
      //编辑请求默认资讯
      let url=that.baseUrl + "/goods/goods_detail.do"+"?Id="+that.$route.params.id
      that.$axios.get(url).then(function(response){
        let data=response.data.data
        that.form.goodsPrice=data.goodsPrice
        that.uploadImgSrc=data.goodsImg
        that.form.goodsName=data.goodsName
        that.form.goodsAuthor=data.goodsAuthor
        that.form.goodsPress=data.goodsPress
        that.form.goodsPubdate=data.goodsPubdate
        that.form.goodsPubdate=data.goodsPubdate
        that.form.goodsType=data.goodsType
        that.form.goodsStock=data.goodsStock
        that.form.goodsLevel=data.goodsLevel
        that.form.goodsLabel=data.goodsLabel
        that.form.goodsSeries=data.goodsSeries
        that.form.goodsState=data.goodsState
        that.form.goodsSales=data.goodsSales
        that.form.goodsVisitcount=data.goodsVisitcount
        that.form.goodsDescribe=data.goodsDescribe
        that.articleContent=data.goodsInfo

        
        //调用编辑器方法，默认数据
        editor.cmd.do('insertHTML', that.articleContent)
        that.loading.close();
        
      }).catch(function (response){
        that.loading.close();
        that.$message({
          message: '数据请求失败',
          type: 'error'
        });
      });
    },
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
.el-form-item__content{
    text-align: left;
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
.comebackHome{
  float: left;
}
</style>
