<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panelRight">
          <div class="card-panel-description">
            <div class="card-panel-text">书店(月)</div>
            <div class="card-panel-text">{{chartData.bookCount}}</div>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">书店(周)</div>
            <div class="card-panel-text">{{chartData1.bookCount}}</div>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">书店(日)</div>
            <div class="card-panel-text">{{chartData2.bookCount}}</div>
          </div>
        </div>
        
      </div>
    </el-col>
    <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panelRight">
          <div class="card-panel-description">
            <div class="card-panel-text">课程(月)</div>
            <div class="card-panel-text">{{chartData.courseCount}}</div>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">课程(周)</div>
            <div class="card-panel-text">{{chartData1.courseCount}}</div>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">课程(日)</div>
            <div class="card-panel-text">{{chartData2.courseCount}}</div>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panelRight">
          <div class="card-panel-description">
            <div class="card-panel-text">营业额(月)</div>
            <div class="card-panel-text">{{chartData.totalPrice}}</div>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">营业额(周)</div>
            <div class="card-panel-text">{{chartData1.totalPrice}}</div>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">营业额(日)</div>
            <div class="card-panel-text">{{chartData2.totalPrice}}</div>
          </div>
         </div>
      </div>
    </el-col>
    <!-- <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Shoppings</div>
         
        </div>
      </div>
    </el-col> -->
  </el-row>
</template>

<script>

export default {
  data(){
    return{
      chartData:[],
      chartData1:[],
      chartData2:[]
    }
  },
  methods: {
    getChartData(nexturl) {
      let that=this
      return new Promise(function(resolve,reject){
          let url=that.baseUrl + nexturl
          that.$axios.get(url).then(function(response){
              resolve(response.data.data)
          }).catch(function (response){
            reject(response)
          });
      })
    }
  },
  created(){
    let that=this
    Promise.all([that.getChartData('/manager/index/get_month_list.do'),that.getChartData('/manager/index/get_week_list.do'),that.getChartData('/manager/index/get_today_list.do')]).then(function(arr){
      that.chartData=arr[0]
      that.chartData1=arr[1]
      that.chartData2=arr[2]
    },function(){
      console.log('至少有一个失败了')
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    display:flex;
    
    flex-direction: row;
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {

        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panelRight{
      width:100%;
      display:flex;
      justify-content:center;
    flex-direction: row;
    }
    .card-panel-icon-wrapper {
      
      margin: 14px 0 14px 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
