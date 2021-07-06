<template>
  <div class="common-container">
    <div class="data-header">
      <div class="data-form">
        <el-date-picker
          size="mini"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="shortCutsRange"
          format="yyyy/MM/dd"
          value-format="yyyy/MM/dd"
          :picker-options="timeShortCuts"
          @change="onTimeRangeChange"
        >
        </el-date-picker>
        <el-button type="primary" size="mini">查询</el-button>
      </div>
    </div>
    <div class="data-summary">
      <div class="data-summary-item"></div>
      <div class="data-summary-item"></div>
      <div class="data-summary-item"></div>
      <div class="data-summary-item"></div>
    </div>
    <!-- <div class="data-charts">
      <div class="data-charts-parts">
        <div class="parts-item">
          <div class="data-charts-title">热销商品</div>
          <div class="table-data">
            <el-table :data="hotProductsData" style="width: 100%" size="mini" :stripe="true" header-cell-class-name="my-table-cell">
              <el-table-column type="index" label="排名" width="60" align="center"> </el-table-column>
              <el-table-column prop="a" label="分类" width="120" align="center" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="b" label="产品名称" width="400" align="center" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="c" label="销量" sortable align="center"> </el-table-column>
              <el-table-column prop="d" label="销售额" sortable align="center"> </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="data-charts-parts">
        <div class="parts-item">
          <div class="data-charts-title">销售额统计</div>
          <div class="sales-charts" ref="sales-charts"></div>
        </div>
        <div class="parts-item">
          <div class="data-charts-title">用户客单价</div>
          <div class="sales-charts" ref="per-sales-charts"></div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
// 引入图标实例
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
export default {
  data() {
    return {
      fakerDataLen: 15,
      hotProductsData: [],
      timeShortCuts: [],
      shortCutsString: 'today',
      shortCutsRange: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this._initData()
    })
  },
  methods: {
    _initData() {
      this._initTimeShortCuts()
      this._initHotProductsData()
      this._initSalesChartsData()
      this._initPerPriceData()
    },
    _initTimeShortCuts() {
      let today = new Date()
      let yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
      let weekRange = this.$getWeekStartDateAndEndDateRange()
      let monthRange = this.$getMonthStartDateAndDateRange()
      this.timeShortCuts = {
        shortcuts: [
          {
            text: '当日',
            timeRange: [this.$getDataString(today), this.$getDataString(today)],
            shortCuts: 'today',
            onClick: pick => {
              pick.$emit('pick', [this.$getDataString(today), this.$getDataString(today)])
            }
          },
          {
            text: '昨日',
            timeRange: [this.$getDataString(yesterday), this.$getDataString(yesterday)],
            shortCuts: 'yesterday',
            onClick: pick => {
              pick.$emit('pick', [this.$getDataString(yesterday), this.$getDataString(yesterday)])
            }
          },
          {
            text: '本周',
            timeRange: weekRange,
            shortCuts: 'weekRange',
            onClick: pick => {
              pick.$emit('pick', weekRange)
            }
          },
          {
            text: '本月',
            timeRange: monthRange,
            shortCuts: 'monthRange',
            onClick: pick => {
              pick.$emit('pick', monthRange)
            }
          }
        ]
      }
      // this.shortCutsString = this.timeShortCuts[0].shortCuts
      // this.shortCutsRange = this.timeShortCuts[0].timeRange
    },
    _initHotProductsData() {
      this.hotProductsData = [...new Array(10)].map(() => {
        return {
          a: this.$randomOne(['日用品', '咖啡水吧', '休闲零食', '冷饮']),
          b: this.$randomOne(['烤肠', '休闲零食', '农夫山泉', '恒大冰泉', '冰雪怪']),
          c: this.$randomOne(
            [...new Array(12)].map(() => {
              return Math.floor(Math.random() * 100)
            })
          ),
          d: this.$randomOne(
            [...new Array(12)].map(() => {
              return Math.floor(Math.random() * 1000)
            })
          )
        }
      })
    },
    _initSalesChartsData() {
      const salesCharts = echarts.init(this.$refs['sales-charts'])
      window.onresize = () => {
        salesCharts.resize()
      }
      salesCharts.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {},
        legend: {
          data: ['小程序', '线上', '订单'],
          left: '20%'
        },
        xAxis: {
          type: 'category',
          data: [...new Array(this.fakerDataLen)].map((item, index) => {
            return `05-${index + 1 >= 10 ? index + 1 : '0' + (index + 1)}`
          }),
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '销售额（元）'
          },
          {
            type: 'value',
            name: '订单数（笔）'
          }
        ],
        series: [
          {
            name: '小程序',
            type: 'bar',
            itemStyle: {
              color: '#207EFF'
            },
            data: [...new Array(this.fakerDataLen)].map(() => {
              return parseInt(Math.random() * 100)
            })
          },
          {
            name: '线上',
            type: 'bar',
            itemStyle: {
              color: '#FF9160'
            },
            data: [...new Array(this.fakerDataLen)].map(() => {
              return parseInt(Math.random() * 100)
            })
          },
          {
            name: '订单',
            type: 'line',
            yAxisIndex: 1,
            itemStyle: {
              color: '#FFC800'
            },
            data: [...new Array(this.fakerDataLen)].map(() => {
              return parseInt(Math.random() * 1000)
            })
          }
        ]
      })
    },
    _initPerPriceData() {
      const salesCharts = echarts.init(this.$refs['per-sales-charts'])
      window.onresize = () => {
        salesCharts.resize()
      }
      salesCharts.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {},
        legend: {
          data: ['小程序', '订单'],
          left: '20%'
        },
        xAxis: {
          type: 'category',
          data: [...new Array(this.fakerDataLen)].map((item, index) => {
            return `05-${index + 1 >= 10 ? index + 1 : '0' + (index + 1)}`
          }),
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '客单价（元）'
          }
        ],
        series: [
          {
            name: '小程序',
            type: 'line',
            itemStyle: {
              color: '#207EFF'
            },
            areaStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(32, 126, 255, 0.5)'
                  },
                  {
                    offset: 1,
                    color: '#ffffff' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            },
            data: [...new Array(this.fakerDataLen)].map(() => {
              return parseInt(Math.random() * 80)
            })
          },
          {
            name: '订单',
            type: 'line',
            itemStyle: {
              color: '#FFC800'
            },
            areaStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(255, 200, 0, 0.5)'
                  },
                  {
                    offset: 1,
                    color: '#ffffff' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            },
            data: [...new Array(this.fakerDataLen)].map(() => {
              return parseInt(Math.random() * 80)
            })
          }
        ]
      })
    },
    onTimeRangeChange(e) {
      console.log(e)
    },
    selectTimeRangeByShorts(item) {
      this.shortCutsString = item.shortCuts
      this.shortCutsRange = item.timeRange
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'common/styles/variable.scss';
.data-form {
  display: flex;
  align-items: center;
  padding: 16px 16px 0;
  .data-form-item {
    margin-right: 12px;
    font-size: 14px;
    cursor: pointer;
    &.active {
      color: $theme-color;
      font-weight: bold;
    }
  }
  .el-button {
    margin-left: 12px;
  }
}
.data-summary {
  display: flex;
  margin-top: 16px;
  padding: 0 16px;
  .data-summary-item {
    flex: 1;
    height: 120px;
    background-color: #ffffff;
    border-radius: 4px;
    transition: all 0.2s cubic-bezier(0.1, 0.66, 1, 0.41);
    &:not(:first-child) {
      margin-left: 16px;
    }
    &:hover {
      box-shadow: 0 0 10px #ddd;
    }
  }
}
.data-charts {
  display: flex;
  align-items: flex-start;
  margin-top: 16px;
  padding: 0 16px;
  .data-charts-parts {
    flex: 1;
    &:not(:first-child) {
      margin-left: 16px;
    }
    .parts-item {
      margin-bottom: 16px;
      padding: 16px;
      background-color: #ffffff;
      .data-charts-title {
        position: relative;
        padding-left: 20px;
        font-size: 14px;
        color: $theme-color;
        font-weight: 600;
        margin-bottom: 16px;
        &::before {
          content: '';
          position: absolute;
          width: 14px;
          height: 14px;
          left: 0;
          top: 50%;
          margin-top: -6px;
          border-radius: 50%;
          background-color: $theme-color;
        }
      }
    }
    .sales-charts {
      height: 300px;
    }
  }
}
</style>
