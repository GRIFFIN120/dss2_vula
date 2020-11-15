<template>
  <el-form ref="form"  label-width="100px" :model="search" > <!-- :rules="rules" -->
    <div v-for="column in meta.COLUMNS" :key="column.prop">
      <el-form-item v-if="column.tool!='list' && column.tool!='object'" :label="column.label" > <!-- :prop="col.prop" -->
        <!-- 开关 -->
        <el-select style="width:100%"
          v-if="column.tool=='switch'"
          v-model="search.exact[column.prop]"
          clearable
          placeholder="请选择">
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>

        <!-- 数字滑块 -->
        <el-slider style="width:100%"
           v-else-if="column.tool=='number'"
           v-model="search.exact[column.prop]"
           :show-input="true"
           input-size="mini"
           :max="column.param.max"
           :min="column.param.min"
           :step="column.param.step">
        </el-slider>

        <!-- 单选择框 / 系统常量数组 -->
        <el-select style="width:100%"
           v-else-if="column.tool=='select' || column.tool=='constants'"
           v-model="search.exact[column.prop]"
           clearable
           filterable
           placeholder="请选择"
        >
          <el-option
            v-for="element in column.param" :key="element.id"
            :label="element.name"
            :value="element[column.toolParamKey]"
          >
            <span style="float: right; color: #8492a6; font-size: 12px" v-html="element[column.toolParamKey]"></span>
            <span  v-html="element.name"></span>
          </el-option>
        </el-select>

<!--   color,date,textarea,input     -->
        <el-input
          v-else
          style="width:100%"
          v-model="search.fuzzy[column.prop]"
        ></el-input>

      </el-form-item>
    </div>
  </el-form>
</template>

<script>

export default {
  props: ['search', 'meta']
}
</script>

<style scoped>

</style>
