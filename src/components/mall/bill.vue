<template>
<div>
  <!-- 头部按钮 -->
  <div class="headerBtn">
         <div style="display:flex;flex-direction: row;">
           <el-form label-width="50px" class="updateCardForm">
              <el-form-item label="状态">
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
            <el-form label-width="50px" class="updateCardForm">
              <el-form-item label="类型">
                  <el-select @change="billstatusChange" v-model="productTypeValue" placeholder="请选择">
                      <el-option
                      v-for="item in productType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item>
            </el-form>
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
      prop="orderNo"
      align="center"
      label="订单编号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="statusDesc"
      label="状态"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      prop="total_price"
      label="总价格"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      prop="product.goodsName"
      align="center"
      label="购买商品"
      width="180"
      >
    </el-table-column>
    <el-table-column
      prop="quantity"
      align="center"
      label="购买数量"
      width="100"
      >
    </el-table-column>
    <el-table-column
      prop="shopVo.receivename"
      label="购买人姓名"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      prop="shopVo.receivephone"
      label="购买人电话"
      align="center"
      width="120">
    </el-table-column>
    
    <el-table-column
      label="邮寄地址"
      align="center"
      width="200"
      prop="receivearea"
      >
    </el-table-column>
    <el-table-column
      prop="shopVo.usermail"
      label="购买人邮箱"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      prop="shippingCode"
      label="物流单号"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      prop="buyerMessage"
      label="买家留言"
      align="center"
      width="120">
    </el-table-column>

    <el-table-column
      fixed="right"
      label="操作"
      align="center"
      width="160">
      <template slot-scope="scope">
          <el-button v-show="billstatusValue2" @click.prevent="wuliuDan(scope.row)" type="text" size="small">物流</el-button>
          <el-button v-show="billstatusValue==2" @click.prevent="edit(scope.row,'fahuo')" type="text" size="small">发货</el-button>
          <el-button @click.prevent="edit(scope.row,'bianji')" type="text" size="small">编辑</el-button>
          <el-button @click.prevent="deleteWebsiteTableData(scope.row.orderNo)" type="text" size="small" style="color:#f56c6c">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
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
  <el-dialog
      title="修改订单信息"
      :modal-append-to-body="false"
      :visible.sync="puchaDrag"
      width="50%">
      <el-form label-width="140px" class="updateCardForm">
        <el-form-item label="中通物流单号">
          <el-input v-model="shipping_code" type="text"></el-input>
          <div style="font-size:12px;text-align:left;color:#F00;">*默认为中通物流</div>
        </el-form-item>
        <el-form-item style="display:flex;" v-show="fahuoOrbianji" label="状态">
          <el-select style="margin-left:-140px;z-index:99999999;" v-model="updatebillstatusValue" placeholder="请选择1">
                <el-option
                v-for="item2 in billstatus"
                :key="item2.value"
                :label="item2.label"
                :value="item2.value">
                </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="fahuoOrbianji" label="商品类型">
          <el-input v-model="product_type" type="text"></el-input>
        </el-form-item>
        <el-form-item v-show="fahuoOrbianji" label="买家留言">
          <el-input v-model="buy_message" type="text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="puchaDrag=false">取 消</el-button>
          <el-button type="primary" @click="updateNowCardDatas">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="物流信息信息"
      :modal-append-to-body="false"
      :visible.sync="wuliuypuchaDrag"
      width="50%">
      <div>
        <el-steps direction="vertical" :active="buzhouData.length" :space="60">
            <el-step v-for="item in buzhouData" :key="item.acceptTime" :title="item.acceptTime" :description="item.acceptStation"></el-step>
        </el-steps>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="wuliuypuchaDrag=false">确认</el-button>
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
        pageSize:10,//默认每页数据量
        typeIndex:1,//序号开始
        keyword:'',//搜索
        websiteTableDataloading:true,//表格数据展示
        warnClass:'warnClass',
        commonCalss:'',
        puchaDrag:false,
        billstatus:[{
          value: '',
          label: '全部'
        },{
          value: 0,
          label: '已取消'
        }, {
          value: 1,
          label: '未付款'
        }, {
          value: 2,
          label: '已付款'
        }, {
          value: 4,
          label: '已发货'
        }, {
          value: 5,
          label: '交易成功'
        }],
        billstatusValue:2,
        billstatusValue2:false,
        updatebillstatusValue:'',
        buy_message:'',
        product_type:'',
        shipping_code:'',
        productType:[{
          value: '',
          label: '全部'
        }],
        productTypeValue:'',
        fahuoOrbianji:true,
        billId:'',
        wuliuypuchaDrag:false,
        buzhouData:'',
        buzhouDataLength:9,
      }
    },
    methods:{
        billstatusChange(data1){
          if(data1==4||data1==5){
            this.billstatusValue2=true
          }else{
            this.billstatusValue2=false
          }
            this.getWebsiteTable()
        },
        wuliuDan(rowData){
            let that=this
            if(rowData.shippingCode){
              let url=that.baseUrl + "/order/find_logistics_info.do"+"?orderNo="+rowData.orderNo+'&logisticCode='+rowData.shippingCode
              that.$axios.get(url).then(function(response){
               that.buzhouData=response.data.traces
               console.log(that.buzhouData)
               that.wuliuypuchaDrag=true
              }).catch(function (response){
                that.$message({
                  message: '数据请求失败，请检查物流单号',
                  type: 'error'
                });
              });
            }else{
              that.$message({
                  message: '无物流，请重新添加物流信息',
                  type: 'error'
                });
            }
            console.log(rowData)
        },
      //获取表格数据
      getWebsiteTable(){
        var that=this
        that.websiteTableDataloading=true
        let url=this.baseUrl + "/manager/order/get_order_list.do"+"?status="+this.billstatusValue+"&productType="+this.productTypeValue+"&pageNum="+this.pageNum+"&pageSize="+this.pageSize
        this.$axios.get(url).then(function(response){
            console.log(response)
            that.pageTotalnum=response.data.data.total
            that.websiteTableData=response.data.data.list
            for (let index = 0; index <  that.websiteTableData.length; index++) {
              if(that.websiteTableData[index].shopVo){
                that.websiteTableData[index].receivearea=that.websiteTableData[index].shopVo.receivearea01+that.websiteTableData[index].shopVo.receivearea02+that.websiteTableData[index].shopVo.receivearea03
              }else{
                 that.websiteTableData[index].receivearea=''
              }
              
            }
            
            console.log(that.websiteTableData)
            let websiteTableDataLength=that.websiteTableData.length
            that.websiteTableDataloading=false
        }).catch(function (response){
          console.log(response)
          that.websiteTableDataloading=false
          that.$message({
            message: '数据请求失败1',
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
      edit(billRow,data2){
        this.puchaDrag=true

        console.log(billRow)
        this.updatebillstatusValue=billRow.status
        this.buy_message=billRow.buyerMessage
        this.product_type=billRow.productType
        this.shipping_code=billRow.shippingCode
        this.billId=billRow.orderNo
        if(data2=='fahuo'){
          this.fahuoOrbianji=false
          this.updatebillstatusValue=4
        }else{
          this.fahuoOrbianji=true
        }
        
      },
      //删除资讯
      deleteWebsiteTableData(articleId){
        var that=this
        that.$confirm('此操作将删除该订单,且无法恢复, 是否继续?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          let url=that.baseUrl + "/manager/order/del.do"+"?orderNo="+articleId
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
      updateNowCardDatas(){
        var that=this
        let url=this.baseUrl + "/manager/order/modify.do"
        let addNews=new URLSearchParams();
        addNews.append('orderNo',that.billId);
        addNews.append('status',that.updatebillstatusValue);
        addNews.append('buyerMessage',that.buy_message);
        addNews.append('productType',that.product_type);
        addNews.append('shippingCode',that.shipping_code);
        this.$axios.post(url,addNews).then(function(response){
          that.puchaDrag=false
          that.getWebsiteTable()
         that.$message({
            message: '修改成功',
            type: 'sucess'
          });
        }).catch(function (response){
          that.$message({
            message: '数据请求失败',
            type: 'error'
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
      console.log(this.windowHeight)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .warnClass{
    color:#F00;
  }
  .el-select-dropdown{
      z-index: 99999999 !important;
      margin-left: 0;
  }
  
</style>
