<template>
  <div  v-loading="loading" element-loading-text="页面准备中,请稍候" element-loading-spinner="el-icon-loading"
     style="width:100%;height:100%;">
    <PanelGroup></PanelGroup>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <LineChart :chartData="lineChartData"/>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from '../../components/websiteIndex/PanelGroup'
import LineChart from '../../components/websiteIndex/LineChart'

export default {
  name: 'home',
  data () {
    return {
      minHeight:'',
      loading:true,
      lineChartData:{
          date:[],
          bookCount:[],
          courseCount:[],
          totalPrice:[]
      }
    }
  },
  components: {
    PanelGroup,
    LineChart,
  },
  methods:{
   getChartData(){
      let that=this
      let url=this.baseUrl + "/manager/index/get_seven_days_list.do"
        this.$axios.get(url).then(function(response){
            that.date=[]
            that.bookCount=[]
            that.courseCount=[]
            that.totalPrice=[]
            for (var i = 0; i < response.data.data.length; i++) {
              that.lineChartData.date.push(response.data.data[i].date)
              that.lineChartData.bookCount.push(response.data.data[i].bookCount)
              that.lineChartData.courseCount.push(response.data.data[i].courseCount)
              that.lineChartData.totalPrice.push(response.data.data[i].totalPrice)
            };
            
        }).catch(function (response){
          console.log(response)
          that.$message({
            message: '数据请求失败',
            type: 'error'
          });
        });
   }
  },
  beforeCreate(){
    console.log('beforeCreate')
  },
  created(){
    console.log('created')
    this.minHeight=window.innerHeight-110+'px'
    this.getChartData()
  },
  mounted(){
    this.loading=false
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
 .dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
