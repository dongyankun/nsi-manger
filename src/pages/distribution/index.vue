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
        type='index'
        :index="typeIndex"
        align="center"
        label="编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="sign"
        align="center"
        label="支付类型"
        >
      </el-table-column>
      <el-table-column
        prop="index01"
        align="center"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="index02"
        align="center"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="index03"
        align="center"
        label="微信订单号">
      </el-table-column>
      <el-table-column
        prop="index04"
        align="center"
        label="商户订单号">
      </el-table-column>
      <el-table-column
        prop="index06"
        align="center"
        label="付款人">
      </el-table-column>
      <el-table-column
        prop="index07"
        align="center"
        label="金额">
      </el-table-column>
      <el-table-column
        prop="index08"
        align="center"
        label="推介人">
      </el-table-column>
      <el-table-column
        prop="index09"
        align="center"
        label="支付信息">
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
      pageSize:10,//默认每页数据量
      typeIndex:1,//序号开始
      keyword:'',//搜索
      distributionTableDataloading:true,//表格数据展示
    }
  },
  methods:{
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
    //获取表格数据
    getDistributionTableData(){
      var that=this
      let url=this.baseUrl + "/manager/Log/getLog.do"+"?pageNum="+this.pageNum+"&pageSize="+this.pageSize+"&Type=微信支付"
      this.$axios.get(url).then(function(response){
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
        that.distributionTableData.map(item=>{
          var date = new Date(item.index02);
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          let D = date.getDate() + ' ';
          let h = date.getHours() + ':';
          let m = date.getMinutes() + ':';
          let s = date.getSeconds();
          item.index02=Y+M+D+h+m+s
          return item
        })

        
        console.log(that.distributionTableData)
        let websiteTableDataLength=that.distributionTableData.length
        let flagNum=0
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
  
</style>
