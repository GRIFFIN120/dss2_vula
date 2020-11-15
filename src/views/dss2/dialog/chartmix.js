import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import am4themesKelly from '@amcharts/amcharts4/themes/kelly'

am4core.useTheme(am4themesKelly)
am4core.useTheme(am4themesAnimated)
am4core.options.commercialLicense = true

export default {
  props: ['data'],
  data () {
    return {
      chart: null,
      list: [],
      titles: [],
      range: [],
      min: null,
      max: null,
      message: '数据加载中',
      count: 0
    }
  },
  methods: {
    makeSeries (index) {
      const valueY = index === undefined ? 'value' : ('value' + index)
      console.log(valueY)
      let series = null
      if (this.data.domain === 'series') {
        console.log('series')
        series = new am4charts.LineSeries()
        series.dataFields.dateX = 'category'
        series.tooltipText = '{valueY}'
        series.minBulletDistance = 15
        const bullet = series.bullets.push(new am4charts.CircleBullet())
        bullet.circle.strokeWidth = 2
        bullet.circle.radius = 4
        bullet.circle.fill = am4core.color('#fff')
      } else if (this.data.domain === 'number') {
        console.log('number')
        series = new am4charts.LineSeries()
        series.dataFields.valueX = 'category'
        series.strokeOpacity = 0
        var bullet = series.bullets.push(new am4charts.CircleBullet())
        bullet.strokeOpacity = 0
        bullet.fillOpacity = 0.7
        bullet.tooltipText = ' ({valueX.value},{valueY.value})'
      } else {
        console.log('set')
        series = new am4charts.ColumnSeries()
        series.dataFields.categoryX = 'category'
        series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]'
        series.columns.template.fillOpacity = 0.5
        const columnTemplate = series.columns.template
        columnTemplate.strokeWidth = 2
        columnTemplate.strokeOpacity = 1
      }

      series.dataFields.valueY = valueY
      if (index !== undefined) {
        series.name = this.titles[index]
        series.hidden = index > 5
      }

      return series
    },

    getXAxis () {
      if (this.data.domain === 'series') {
        const axis = new am4charts.DateAxis()
        axis.dateFormats.setKey('day', 'yyyy/MM/dd')
        return axis
      } else if (this.data.domain === 'number') {
        return new am4charts.ValueAxis()
      } else {
        return new am4charts.CategoryAxis()
      }
    },
    makeChart (ref) {
      // const th = this
      if (this.list.length === 0) {
        this.message = '数据是空的'
      }

      const chart = am4core.create(ref, am4charts.XYChart)
      this.chart = chart
      chart.data = this.list
      let xAxis = this.getXAxis()
      xAxis = chart.xAxes.push(xAxis)

      xAxis.dataFields.category = 'category'
      xAxis.renderer.grid.template.location = 0
      xAxis.renderer.minGridDistance = 30

      chart.cursor = new am4charts.XYCursor()
      chart.cursor.xAxis = xAxis

      const yAxis = chart.yAxes.push(new am4charts.ValueAxis())
      if (this.min != null) yAxis.min = this.min
      if (this.max != null) yAxis.max = this.max

      if (this.range) {
        this.range.filter(function (e) {
          var range = yAxis.axisRanges.create()
          range.value = e.start
          range.endValue = e.end
          range.axisFill.fill = e.color
          range.axisFill.fillOpacity = 0.15
          range.label.text = e.label
          range.label.inside = true
          range.label.fontSize = 15
        })
      }

      // Create series
      if (this.count === 0) {
        const series = this.makeSeries()
        chart.series.push(series)
      } else {
        for (let i = 0; i < this.count; i++) {
          const series = this.makeSeries(i)
          chart.series.push(series)
        }
        chart.legend = new am4charts.Legend()
        chart.legend.position = 'top'
        chart.legend.paddingBottom = 10
        chart.legend.labels.template.maxWidth = 95
        chart.legend.fontSize = 12
        const legendContainer = am4core.create(this.$refs.draw, am4core.Container)
        legendContainer.width = am4core.percent(100)
        legendContainer.height = am4core.percent(100)
        chart.legend.scrollable = true
        chart.legend.parent = legendContainer
      }
    }
  },
  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
    }
  }
}
