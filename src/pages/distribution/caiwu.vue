<template>
  <div>
    <!-- 表格 -->
    <el-table
      :data="distributionTableData"
      border
      stripe
      v-loading="distributionTableDataloading"
      class="distributionTable"
      >
      <el-table-column
        prop='orderNo'
        align="center"
        label="编号"
        >
      </el-table-column>
      <el-table-column
        prop='createTime'
        align="center"
        label="创建时间"
        >
      </el-table-column>
      <el-table-column
        prop="productType"
        align="center"
        label="支付类型"
        >
        <template slot-scope="scope">
            <el-button type="text" @click="getorderNoData(scope.row.product.id)" size="small" style="color:#f56c6c" v-if="scope.row.productType=='购物车'">{{scope.row.productType}}</el-button>
            <div v-if="scope.row.productType!='购物车'">{{scope.row.product.goodsName}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="product.goodsName"
        align="center"
        label="商品名称"
        >
      </el-table-column>
      <el-table-column
        prop="total_price"
        align="center"
        label="金额"
        sortable
        class-name="highLight"
        :filters="[{text: '>1元', value: '1'}]"
        :filter-method="filterHandler"
        >
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="mypagination"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10,20,30,40,50,100]"
      :page-size="30"
      :total="pageTotalnum">
    </el-pagination>
    <el-dialog
    title="购物车信息"
    :modal-append-to-body="false"
    :visible.sync="buyCar"
    width="50%">
      <el-table
        :data="buycarData"
        border
        stripe
        v-loading="websiteTableDataloading"
        :max-height="windowHeight"
        class="websiteTable">
        <el-table-column
          prop="goodsName"
          align="center"
          label="商品名称"
          width="300">
        </el-table-column>
        <el-table-column
          prop="goodsNum"
          label="商品数量"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="goodsPrice"
          label="价格"
          align="center"
          width="120">
        </el-table-column> 
      </el-table>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="buyCar=false">确认</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'distributionIndex',
  data () {
    return {
      distributionTableData: [],//表格数据
      pageTotalnum:0,//数据总数
      pageNum:1,//页码
      pageSize:30,//默认每页数据量
      typeIndex:1,//序号开始
      keyword:'',//搜索
      distributionTableDataloading:true,//表格数据展示
      buyCar:false,
    }
  },
  methods:{
    //获取购物车订单信息
      getorderNoData(orderNo){
        let that=this
        that.buyCar=true
        let url=this.baseUrl + "/ShopCart/cartDetail.do"
        let addNews=new URLSearchParams();
        addNews.append('cartId',orderNo);
        that.$axios.post(url,addNews).then(function(response){
          that.buycarData=response.data.data
          that.buyCar=true
        }).catch(function (response){
          that.$message({
            message: '数据请求失败',
            type: 'error'
          });
        });
      },
      //页码改变
      handleCurrentChange(num){
        this.pageNum=num
        this.getDistributionTableData()
      },
      //一页数据量改变
      handleSizeChange(num){ 
        this.pageSize=num
        this.getDistributionTableData()
      },
      filterHandler(value, row, column){
        const property = column['property'];
        return row[property] > value;
      },
      changeDate(index02){
          var date = new Date(index02);
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          let D = date.getDate() + ' ';
          let h = date.getHours() + ':';
          let m = date.getMinutes() + ':';
          let s = date.getSeconds();
          return Y+M+D
      },
    //获取表格数据
    getDistributionTableData(){
      var that=this
      let url=this.baseUrl + "/manager/order/get_trade_order.do"+"?pageNum="+this.pageNum+"&pageSize="+this.pageSize+""
      this.$axios.get(url).then(function(response){
        console.log(response)
        // var date = new Date(1398250549490);
        // Y = date.getFullYear() + '-';
        // M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        // D = date.getDate() + ' ';
        // h = date.getHours() + ':';
        // m = date.getMinutes() + ':';
        // s = date.getSeconds(); 
        //console.log(Y+M+D+h+m+s);
        //new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
        that.pageTotalnum=response.data.data.total
        that.distributionTableData=response.data.data.list
        for (var index = 0; index <  that.distributionTableData.length; index++) {
          that.distributionTableData[index].createTime=that.changeDate(that.distributionTableData[index].createTime)
        };
        
        // that.distributionTableData.map(item=>{
        //   var date = new Date(item.index02);
        //   let Y = date.getFullYear() + '-';
        //   let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        //   let D = date.getDate() + ' ';
        //   let h = date.getHours() + ':';
        //   let m = date.getMinutes() + ':';
        //   let s = date.getSeconds();
        //   item.index02=Y+M+D+h+m+s
        //   return item
        // })

        
        console.log(that.distributionTableData)
        let websiteTableDataLength=that.distributionTableData.length
        //let flagNum=0
        that.distributionTableDataloading=false
      }).catch(function (response){
        that.distributionTableDataloading=false
        that.$message({
          message: '数据请求失败',
          type: 'error'
        });
      });
    },
  },
  created(){
    
    this.getDistributionTableData()
  }
}
</script>
<style lang="scss">
  .highLight{
    color:#F00;
    font-size:18px;
  }
</style>
