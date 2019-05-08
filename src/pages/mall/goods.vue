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
      width="130">
      <template slot-scope="scope">
        
        <el-button @click.prevent="edit(scope.row.id)" type="text" size="small">编辑</el-button>
        <el-button @click.prevent="deleteWebsiteTableData(scope.row.id,websiteTableData)" type="text" size="small" style="color:#f56c6c">删除</el-button>
        <el-button @click.prevent="goodsShare(scope.row.id)" type="text" size="small" style="color:#67C23A">分享</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分享 -->
  <el-dialog
      title="商品分享图片合成"
      :modal-append-to-body="false"
      :visible.sync="puchaDrag"
      width="90%">
      <div class="myBox">
        <div class="leftMenu">
          <el-form label-width="100px" class="demo-form-inline" size="mini">
            <div class="esider">必要配置</div>
            <el-form-item class="inputTop" label="底图链接">
              <el-input v-model="shareObj.img1Src" placeholder=""></el-input>
              <el-upload
                class="uploadImg"
                :action="baseUrl+'/manager/talent/upload.do'"
                :data="fileData"
                :show-file-list='false'
                accept="image/jpeg,image/jpg,image/png"
                :on-success="uploadSucess1"
                :before-upload="beforeUpload"
                :on-error="uploadError"
                :file-list="fileList">
                <el-button size="small" type="primary">上传图片</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item class="inputTop" label="封面图链接">
              <el-input v-model="shareObj.img2Src" placeholder=""></el-input>
              <el-upload
                class="uploadImg"
                :action="baseUrl+'/manager/talent/upload.do'"
                :data="fileData"
                :show-file-list='false'
                accept="image/jpeg,image/jpg,image/png"
                :on-success="uploadSucess2"
                :before-upload="beforeUpload"
                :on-error="uploadError"
                :file-list="fileList">
                <el-button size="small" type="primary">上传图片</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item class="inputTop" label="二维码链接">
              <el-input v-model="shareObj.img3Src" placeholder=""></el-input>
              <el-upload
                class="uploadImg"
                :action="baseUrl+'/manager/talent/upload.do'"
                :data="fileData"
                :show-file-list='false'
                accept="image/jpeg,image/jpg,image/png"
                :on-success="uploadSucess3"
                :before-upload="beforeUpload"
                :on-error="uploadError"
                :file-list="fileList">
                <el-button size="small" type="primary">上传图片</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="书名">
              <el-input v-model="shareObj.bookName" placeholder=""></el-input>
            </el-form-item>
            <div class="esider">默认配置</div>
            <el-form-item class="inputTwo" label="底图宽高">
              <el-input v-model="shareObj.img1SrcSizeX" placeholder=""></el-input>
              <el-input v-model="shareObj.img1SrcSizeY" placeholder=""></el-input>
            </el-form-item>
            <el-form-item class="inputTwo" label="封面图宽高">
              <el-input v-model="shareObj.img2SrcSizeX" placeholder=""></el-input>
              <el-input v-model="shareObj.img2SrcSizeY" placeholder=""></el-input>
            </el-form-item>
            <el-form-item class="inputTwo" label="封面图位置">
              <el-input v-model="shareObj.img2SrcPositionX" placeholder=""></el-input>
              <el-input v-model="shareObj.img2SrcPositionY" placeholder=""></el-input>
            </el-form-item>
            <el-form-item class="inputTwo" label="二维码宽高">
              <el-input v-model="shareObj.img3SrcSizeX" placeholder=""></el-input>
              <el-input v-model="shareObj.img3SrcSizeY" placeholder=""></el-input>
            </el-form-item>
            <el-form-item class="inputTwo" label="二维码位置">
              <el-input v-model="shareObj.img3SrcPositionX" placeholder=""></el-input>
              <el-input v-model="shareObj.img3SrcPositionY" placeholder=""></el-input>
            </el-form-item>
            <el-form-item class="inputTwo" label="书名位置">
              <el-input v-model="shareObj.bookNamePositionX" placeholder=""></el-input>
              <el-input v-model="shareObj.bookNamePositionY" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="书名大小">
              <el-input v-model="shareObj.bookNameFontSize" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="书名颜色">
              <el-input v-model="shareObj.bookNameColor" placeholder=""></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="viewBox">
          <div :style="{ width: shareObj.img1SrcSizeX+ 'px' }" class="myCanvasBox"><canvas id="myCanvas" :width="shareObj.img1SrcSizeX" :height="shareObj.img1SrcSizeY"></canvas></div>
          
          <div class="buttonBox">
            <el-button type="primary" @click="composeImg">合成图片</el-button>
            <el-button type="primary" @click="canvasToImg">下载图片</el-button>
            <el-button type="primary" >上传图片</el-button>
            <el-button type="primary" >确认修改</el-button>
            <el-button @click="puchaDrag=false">取消</el-button>
          </div>
          
        </div>
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
        puchaDrag:false,
        shareObj:{
          img1Src:'https://nsi.oss-cn-zhangjiakou.aliyuncs.com/nsi-official/article/1552016958440.jpg',
          img1SrcSizeX:860,
          img1SrcSizeY:358,
          img2Src:'https://nsi.oss-cn-zhangjiakou.aliyuncs.com/nsi-official/article/1552016958440.jpg',
          img2SrcSizeX:10,
          img2SrcSizeY:10,
          img2SrcPositionX:108,
          img2SrcPositionY:50,
          img3Src:'https://nsi.oss-cn-zhangjiakou.aliyuncs.com/nsi-official/article/1552016958440.jpg',
          img3SrcSizeX:10,
          img3SrcSizeY:80,
          img3SrcPositionX:108,
          img3SrcPositionY:108,
          bookName:'测试书名',
          bookNamePositionX:10,
          bookNamePositionY:10,
          bookNameFontSize:14,
          bookNameColor:'#fff',
        },
        context:'',
        canvas:'',
        fileData:{
          type:'nsi-official/article/'//上传图片参数
        },
        fileList:[],//上传图片列表
      }
    },
    methods:{
      billstatusChange(data1){
          this.pageNum=1
            this.getWebsiteTable()
      },
      goodsShare(id){
        this.puchaDrag=true
      },
      composeImg(){
        let that=this
        let canvas = document.getElementById('myCanvas');
        that.context = canvas.getContext('2d');
        //绘制三张图片
        async function nihao(){
            await that.imgLoad(that.shareObj.img1Src,0,0,that.shareObj.img1SrcSizeX,that.shareObj.img1SrcSizeY)
            await that.imgLoad(that.shareObj.img2Src,that.shareObj.img2SrcPositionX,that.shareObj.img2SrcPositionY,that.shareObj.img2SrcSizeX,that.shareObj.img2SrcSizeY)
            await that.imgLoad(that.shareObj.img3Src,that.shareObj.img3SrcPositionX,that.shareObj.img3SrcPositionY,that.shareObj.img3SrcSizeX,that.shareObj.img3SrcSizeY)
            return '1'
        }
        //绘制完图片,在绘制文字
        nihao().then(function(data){
          that.context.textAlign = 'center';
         
          that.context.font=that.shareObj.bookNameFontSize+"px Arial";
          that.context.fillStyle = that.shareObj.bookNameColor;
          that.context.fillText(that.shareObj.bookName, that.shareObj.bookNamePositionX,that.shareObj.bookNamePositionY);
          var image = new Image();
          let canvas = document.getElementById('myCanvas');
          image.src = canvas.toDataURL("image/png");
          console.log(image.src)
        })
      },
      //绘制图片到canvas上
      imgLoad(imgSrc,x,y,a,b){
        let that=this
        return new Promise(function(resolve,reject){
          var img1 =new Image();
          img1.setAttribute("crossOrigin",'Anonymous')
          img1.src =  imgSrc
           
          img1.onload = function(){
            that.context.drawImage(img1,x,y,a,b)
            resolve()
          }
        })
      },
      //canvas转base64,再创建a标签下载
      canvasToImg(){
        let that=this
          var image = new Image();
          let canvas = document.getElementById('myCanvas');
          image.src = canvas.toDataURL("image/png");

          let a = document.createElement("a"); // 生成一个a元素
          let event = new MouseEvent("click"); // 创建一个单击事件
          let name="分享图片"
          a.download = name || "photo"; // 设置图片名称
          a.href = image.src; // 将生成的URL设置为a.href属性,url可以是base64
          a.dispatchEvent(event);
      },
      getImgWidthAndHeight(img_url,a,b){
        let that=this
        var img = new Image();
        img.src = img_url;
        img.onload = function(){
            that.shareObj[a]=img.width
            that.shareObj[b]=img.height
            that.uploadLoading=false
        };
      },
      //文件上传成功
      uploadSucess1(response, file, fileList){
        
        this.$message({
          message: '图片上传成功',
          type: 'success'
        });
        this.shareObj.img1Src=response.data.url
        this.getImgWidthAndHeight(response.data.url,'img1SrcSizeX','img1SrcSizeY')
      },
      uploadSucess2(response, file, fileList){
        this.uploadLoading=false
        this.$message({
          message: '图片上传成功',
          type: 'success'
        });
        this.shareObj.img2Src=response.data.url
        this.getImgWidthAndHeight(response.data.url,'img2SrcSizeX','img2SrcSizeY')
      },
      uploadSucess3(response, file, fileList){
        this.uploadLoading=false
        this.$message({
          message: '图片上传成功',
          type: 'success'
        });
        this.shareObj.img3Src=response.data.url
        this.getImgWidthAndHeight(response.data.url,'img3SrcSizeX','img3SrcSizeY')
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
      
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
  .myBox{
    display:flex;
    flex-direction: row;
    .myCanvasBox{
      border:2px solid #999;
    }
    .buttonBox{
      margin:20px;

    }
  }
  .viewBox{
    max-width:60%;
    overflow:hidden;
  }
    .esider{
      text-align:left;
      font-size:16px;
      color:#999;
      margin-bottom:20px;
    }
    .el-input{
      width:60%;
      float:left;
    }
    .inputTwo{
      .el-input{
        float:left;
        width:30%;
        margin-right:10px;
      }
    }
    .inputTop{
      .el-input{
        float:left;
        width:40%;
        margin-right:10px;
      }
    }
</style>
