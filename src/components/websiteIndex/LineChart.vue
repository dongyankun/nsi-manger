<template>
  <div class="chart" style="height:350px;width:100%;"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')

export default {
  props: {
    chartData: {
      required: true
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.initChart()
    
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: this.chartData.date,
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLabel:{
            padding:[0, 0, 0, -5]
          }
        },
        grid: {
          left: 30,
          right: 30,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['书店订单量', '课程订单量','营业额'],
          selected: {
              // 选中'系列1'
              '书店订单量': true,
              '课程订单量': true,
              // 不选中'系列2'
              '营业额': false
          }
        },
        series: [{
          name: '书店订单量', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: this.chartData.bookCount,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '课程订单量',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: this.chartData.courseCount,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },{
          name: '营业额',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#57617B',
              lineStyle: {
                color: '#57617B',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: this.chartData.totalPrice,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
