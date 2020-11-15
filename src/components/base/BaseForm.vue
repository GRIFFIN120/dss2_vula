<template>
  <el-form v-if="loaded" ref="form"  label-width="100px" :model="item" >  <!-- :rules="rules" -->
    <div v-for="column in META.COLUMNS" :key="column.prop">
      <el-form-item  v-if="!column.hideOnForm"  :label="column.label"  > <!-- :prop="col.prop" -->
        <!-- 开关 -->
        <el-switch style="width:100%"
          v-if="column.tool=='switch'"
          v-model="item[column.prop]"
          :disabled="(!editable)||column.readOnly"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>

        <!-- 数字滑块 -->
        <el-slider style="width:100%"
          v-else-if="column.tool=='number'"
          v-model="item[column.prop]"
          :disabled="(!editable)||column.readOnly"
          :show-input="true"
          input-size="mini"
          :max="column.param.max"
          :min="column.param.min"
          :step="column.param.step">
        </el-slider>

        <!-- 日期 -->
        <el-date-picker style="width:100%"
          v-else-if="column.tool=='date'"
          v-model="item[column.prop]"
          :disabled="(!editable)||column.readOnly"
          value-format="yyyy/MM/dd"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>

        <!-- 颜色选择框 -->
        <el-color-picker style="width:100%"
          v-else-if="column.tool=='color'"
          v-model="item[column.prop]"
          :disabled="(!editable)||column.readOnly"
        ></el-color-picker>

        <!-- 单选择框 / 复选框 / 系统常量数组 -->
        <el-select style="width:100%"
          v-else-if="column.tool=='select' || column.tool=='constants' || column.tool=='list'"
          v-model="item[column.prop]"
          :disabled="(!editable)||column.readOnly"
          clearable
          filterable
          placeholder="请选择"
          :multiple="column.tool=='list'"
        >
          <el-option
            v-for="element in (column.depandOn ? column.depandOn.param : column.param)" :key="element.id"
            :label="element.name"
            :value="element[column.toolParamKey]"
          >
            <span style="float: right; color: #8492a6; font-size: 12px" v-html="element[column.toolParamKey]"></span>
            <span  v-html="element.name"></span>
          </el-option>
        </el-select>

<!--         非可编辑状态下的对象 -->
        <el-input style="width:100%"
            v-else-if="column.tool=='object'&&column.readOnly"
            :value="item[column.prop]?item[column.prop].name:''"
            disabled
        ></el-input>

        <!-- 可编辑状态下的对象 -->
        <el-select style="width:100%"
          v-else-if="column.tool=='object'&&!column.readOnly"
          v-model="item[column.prop]"
          :disabled="!editable"
          clearable
          filterable
          placeholder="请选择"
          @change="objectChange($event,column)"
          :multiple="column.tool=='list'"
        >
          <el-option
            v-for="element in column.param" :key="element.id"
            :label="element.name"
            :value="element.id"
          >
            <span style="float: right; color: #8492a6; font-size: 12px" v-html="element[column.toolParamKey]"></span>
            <span  v-html="element.name"></span>
          </el-option>
        </el-select>

        <!-- 文本框 -->
        <el-input style="width:100%"
          v-else-if="column.tool=='textarea'"
          v-model="item[column.prop]"
          :disabled="(!editable)||column.readOnly"
          type="textarea"
        ></el-input>

<!--         输入框：除上述以外所有内容都以输入框展示-->
        <el-input
          v-else-if="column.tool=='input'"
          style="width:100%"
          v-model="item[column.prop]"
          :disabled="(!editable)||column.readOnly"
        ></el-input>

        <el-input
          v-else
          style="width:100%"
          :value="item[column.prop]+' | '+JSON.stringify(column.param)"
          disabled
        ></el-input>

    </el-form-item>
    </div>
    <slot></slot>
  </el-form>
</template>

<script>
import meta from './meta'
export default { // 注意：item不在此处克隆
  props: {
    item: {
      type: Object
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  mixins: [meta],
  beforeMount () {
    this.selectedItem = this.item
    this.initMeta(this.loadDepandOn)
  },
  methods: {

    objectChange (val, column) {
      // const arr = column.param.filter(function (element) {
      //   return element.id === val
      // })
      // if (arr.length === 1) {
      //   const sel = arr[0]
      //   this.item[column.prop] = sel
      // }
    },
    getData () {
      const th = this
      const object = {}
      this.META.COLUMNS.filter(function (column) {
        const prop = column.prop
        const val = th.item[prop]
        if (val === null || val === undefined) return
        if (column.tool === 'object') {
          if (column.param) {
            column.param.filter(function (o) {
              if (o.id === val) {
                object[prop] = { id: o.id }
              }
            })
          } else {
            object[prop] = { id: val.id }
          }
        } else {
          object[prop] = val
        }
      })
      return object
    }
  },
  data () {
    return {
      data: {}
    }
  }

}
</script>

<style scoped>

</style>
