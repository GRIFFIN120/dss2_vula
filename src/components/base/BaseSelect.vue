<template>
  <div style="display: inline;">
    <el-form label-width="100px" >
      <el-form-item :label="title" >
        <el-select
          style="width: 100%"
          v-model="value"
          @change="change"
          :size="size"
          :clearable="clearable"
          filterable
          :disabled="disabled"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :value="item[valueKey]"
            :label="item.name"
          >
            <span style="float: right; color: #8492a6; font-size: 12px;margin-left: 30px" v-html="item[valueKey]"></span>
            <span style="" v-html="item.name"></span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

<!--    <div style="width: 300px; padding-right: 10px; font-size: 15px; display: inline ">-->
<!--      {{title}}-->
<!--    </div>-->
<!--    <el-select-->
<!--      v-model="value"-->
<!--      @change="change"-->
<!--      size="small"-->
<!--      :clearable="clearable"-->
<!--      filterable-->
<!--    >-->
<!--      <el-option-->
<!--        v-for="item in options"-->
<!--        :key="item.id"-->
<!--        :value="item[valueKey]"-->
<!--        :label="item.name"-->
<!--      >-->
<!--        <span style="float: right; color: #8492a6; font-size: 12px;margin-left: 30px" v-html="item[valueKey]"></span>-->
<!--        <span style="" v-html="item.name"></span>-->
<!--      </el-option>-->
<!--    </el-select>-->
  </div>
</template>

<script>
export default { // @select
  props: {
    url: { type: String }, // *
    data: {
      type: Array
    },
    defaultValue: {},
    title: { type: String }, // *
    valueKey: {
      type: String,
      default: 'id'
    },
    clearable: {
      type: Boolean,
      default: false
    },
    size: {
      type: String
    },
    width: {
      type: String
    },
    param: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      value: null,
      options: []
    }
  },
  watch: {
    data () {
      this.options = this.data
    }
  },
  mounted () {
    if (this.defaultValue) { this.value = this.defaultValue }
    this.load()
  },
  methods: {
    load () {
      if (this.url) {
        this.$base.http.post(this.url, this.param)
          .then(res => {
            this.options = res.data
          })
      }
    },
    change (val) {
      this.$emit('select', val)
    },
    getValue () {
      return this.value
    },
    setValue (val) {
      this.value = val
      this.$emit('select', val)
    }
  }
}
</script>

<style scoped>

</style>
