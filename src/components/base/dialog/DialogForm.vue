<template>
  <el-form ref="form"  label-width="100px" :model="form" :rules="rules">
    <el-form-item v-for="col in meta" :key="col.prop" :label="col.label" :prop="col.prop" >

      <el-date-picker v-if="col.tool=='date'"
                      v-model="form[col.prop]"
                      :disabled="(!editable)||col.readOnly"
                      type="date"
                      value-format="yyyy/MM/dd"
                      placeholder="选择日期">
      </el-date-picker>

      <el-select
        style="width:100%"
        v-else-if="col.tool=='select' || col.tool=='constants' || col.tool=='list'"
        v-model="form[col.prop]"
        :disabled="(!editable)||col.readOnly"
        :multiple="col.tool=='list'"
        filterable
        clearable
        placeholder="无">
        <el-option
          v-for="item in param[col.prop]"
          :key="item.id"
          :value="item[col.selectValueKey]"
          :label="item.name"
        >
          <span v-if="col.tool=='list'" style="float: right; color: #8492a6; font-size: 12px">{{ item[col.selectValueKey] }}</span>
          <span  v-html="item.name"></span>
        </el-option>
      </el-select>

      <el-switch
        v-else-if="col.tool=='switch'"
        v-model="form[col.prop]"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :disabled="(!editable)||col.readOnly"
      >
      </el-switch>

      <el-color-picker
        v-else-if="col.tool=='color'"
        v-model="form[col.prop]"
        :disabled="(!editable)||col.readOnly"
      ></el-color-picker>

      <el-slider
        v-else-if="col.tool=='number'"
        v-model="form[col.prop]"
        :disabled="(!editable)||col.readOnly"
        :show-input="true"
        input-size="mini"
        :max="param[col.prop].max"
        :min="param[col.prop].min"
        :step="param[col.prop].step">
      </el-slider>

      <el-input v-else-if="col.tool=='textarea'||col.tool=='input'" :type="col.tool"  v-model="form[col.prop]" :disabled="(!editable)||col.readOnly"></el-input>

      <el-input v-else-if="col.tool=='object'" disabled :value="form[col.prop][col.selectValueKey]"></el-input>

    </el-form-item>

  </el-form>
</template>

<script>

export default {
  name: 'Form',
  props: ['item', 'meta', 'editable', 'search', 'allowEqual', 'param'],
  methods: {
    confirm (callback) {
      let flag = this.$utils.isObjectValueEqual(this.item, this.form)
      if (this.allowEqual) {
        flag = false
      }
      if (flag) {
        this.$message.warning('数据未被修改')
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (callback) {
              callback(this.form)
            } else {
              this.$message.warning('无操作')
            }
          } else {
            this.$message.warning('表单验证不通过')
          }
        })
      }
    },
    reset () {
      this.form = this.$utils.deepClone(this.item)
    }
  },
  data () {
    return {
      form: {},
      rules: {}
    }
  },
  beforeMount () {
    this.form = this.$utils.deepClone(this.item)

    // 检索条件作为数据插入条件
    if (this.item.id === undefined) {
      this.form = this.$utils.objectMerge(this.form, this.search.exact)
      this.form = this.$utils.objectMerge(this.form, this.search.fuzzy)
      delete this.form.id
    }

    // 验证规则
    for (const i in this.meta) {
      const m = this.meta[i]
      this.rules[m.prop] = []
    }
  }
}
</script>

<style scoped>

</style>
