<template>
  <div>

    <BaseDialog ref="addDialog" title="添加属性" width="650px" @confirm="add">
      <template >
        <BaseTransfer ref="transfer" ></BaseTransfer>
      </template>
    </BaseDialog>
    <BaseDialog ref="copyDialog"   title="复制操作规范" width="700px" @confirm="copy">
      <template >
          <BaseSelect ref="copyEntity" url="types/domain/entity" value-key="code" title="复制到元数据" :default-value="$store.state.menu.metaEntity" :clearable="false"></BaseSelect>
          <BaseSelect ref="copyType" url="types/domain/meta" value-key="code" title="复制到规范" :clearable="false"></BaseSelect>
      </template>
    </BaseDialog>
    <BaseDialog ref="entityDialog"   title="添加元数据" width="400px" @confirm="addEntity">
      <template v-slot="{data}">
        <el-form label-width="100px">
          <el-form-item label="名称">
            <el-input v-model="data.name"></el-input>
          </el-form-item>
          <el-form-item label="标识">
            <el-input v-model="data.code"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </BaseDialog>

    <BaseDialog ref="operationDialog" @confirm="operation"   title="操作" width="400px">
      <template v-slot="{data}">
        <BaseForm entity="meta-operation" type="edit" :item="data"></BaseForm>
      </template>
    </BaseDialog>

    <BaseDialog ref="metaTypes"  title="系统参数" width="700px" :buttons="false">
      <template >
        <SysTypes></SysTypes>
      </template>
    </BaseDialog>

    <el-row>
      <el-col :span="6">
        <BaseSelect ref="entity" url="types/domain/entity" value-key="code" title="元数据" size="small" :default-value="$store.state.menu.metaEntity" :clearable="false" @select="changeEntity"></BaseSelect>
      </el-col>
      <el-col :span="1" style="padding: 5px">
        <el-button @click="$refs.entityDialog.open({domain:'entity',name:'',code:''})" size="small" icon="fa fa-plus" type="primary"></el-button>
      </el-col>
      <el-col :span="6">
        <BaseSelect ref="type" url="types/domain/meta" value-key="code" title="操作规范" size="small"  :default-value="$store.state.menu.metaType" :clearable="false" @select="changeMeta"></BaseSelect>
      </el-col>
      <el-col :span="11" style="padding: 5px">

        <el-button @click="openAdd" style="margin-left: 20px" size="small" plain type="success">添加字段</el-button>
        <el-button @click="openCopy" style="margin-left: 20px" size="small" plain type="warning">复制规范</el-button>
        <el-button @click="openOperation" style="margin-left: 20px" size="small" plain type="danger">全局规范</el-button>
        <el-button @click="$refs.metaTypes.open()" style="margin-left: 20px; float: right" size="small" >系统参数</el-button>
      </el-col>
    </el-row>

    <BaseTable ref="table" entity="meta" type="edit" :search="search" style="margin-top: 10px"></BaseTable>

  </div>
</template>

<script>

import BaseTable from '~table'
import BaseSelect from '../../BaseSelect'
import BaseDialog from '../../BaseDialog'
import BaseTransfer from '../../BaseTransfer'
import BaseForm from '../../BaseForm'
import SysTypes from './SysTypes'

export default {
  name: 'MenuManage',
  components: {
    BaseTransfer,
    BaseTable,
    BaseSelect,
    BaseDialog,
    BaseForm,
    SysTypes
  },
  data () {
    return {
      copyVisible: false,
      operationVisible: false,
      search: {
        page: 1,
        size: 10,
        exact: {
          entity: this.$store.state.menu.metaEntity,
          type: this.$store.state.menu.metaType
        },
        fuzzy: {}
      },
      entities: [],
      types: []
    }
  },
  beforeDestroy () {
    // this.$confirm('是否刷新当前页面', '提示', {
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   type: 'info'
    // }).then(() => {
    //   this.$router.go(0)
    // }).catch(() => {
    // })
  },
  mounted () {
    this.$base.types('entity')
      .then(res => {
        this.entities = res.data.list
      })
    this.$base.types('meta')
      .then(res => {
        this.types = res.data.list
      })
  },
  methods: {
    changeEntity (val) {
      this.$store.state.menu.metaEntity = val
      this.search.exact.entity = val
      this.search.exact.type = this.$store.state.menu.metaType
    },
    changeMeta (val) {
      this.$store.state.menu.metaType = val
      this.search.exact.type = val
      this.search.exact.entity = this.$store.state.menu.metaEntity
    },
    openCopy () {
      if (this.search.exact.entity && this.search.exact.type) {
        this.$refs.copyDialog.open()
      } else {
        this.$message.warning('请选被复制的元数据实体与元数据类别')
      }
    },
    copy () {
      const fromEntity = this.$refs.entity.getValue()
      const fromType = this.$refs.type.getValue()
      const toEntity = this.$refs.copyEntity.getValue()
      const toType = this.$refs.copyType.getValue()

      console.log(fromEntity, fromType, toEntity, toType)

      const flag = fromEntity === toEntity && fromType === toType
      if (toType && toEntity && !flag) {
        this.$base.http.get('meta/copy', {
          fromEntity, fromType, toEntity, toType
        })
      } else {
        this.$message.warning('目标类别不能为空且不能等于被复制的类别')
      }
    },
    openOperation () {
      if (this.search.exact.entity && this.search.exact.type) {
        const entity = this.$store.state.menu.metaEntity
        const type = this.$store.state.menu.metaType
        this.$base.search('meta-operation', {
          exact: { entity, type }
        }).then(res => {
          const list = res.data.list
          let operation = null
          if (list.length > 1) {
            this.$message.warning('数据错误：不唯一')
          } else if (list.length === 0) {
            operation = {
              entity, type
            }
          } else {
            operation = list[0]
          }
          this.$refs.operationDialog.open(operation)
        })
      } else {
        this.$message.warning('请选被复制的元数据实体与元数据类别')
      }
    },
    operation (data) {
      this.$base.update('meta-operation', data)
        .then(() => {
        })
    },
    openAdd () {
      const th = this
      if (this.search.exact.entity && this.search.exact.type) {
        const entity = this.$store.state.menu.metaEntity
        const type = this.$store.state.menu.metaType
        const url = entity + '/fields'
        this.$base.http.all([
          this.$base.http.get(url),
          this.$base.meta(entity, type)
        ]).then(res => {
          const fields = []

          const data = res[0].data
          const list = res[1].data.list

          for (const i in data) {
            const d = data[i]
            const temp = list.filter(function (item) {
              return item.prop === d
            })
            if (temp.length === 0) {
              fields.push({ id: d, name: d })
            }
          }

          this.$refs.addDialog.open({},
            function () {
              th.$refs.transfer.init(fields, [], true)
            }
          )
        })
      } else {
        this.$message.warning('请选被复制的元数据实体与元数据类别')
      }
    },
    add () {
      const entity = this.$store.state.menu.metaEntity
      const type = this.$store.state.menu.metaType
      const value = this.$refs.transfer.getValue()
      if (value && value.length !== 0) {
        const url = 'meta/add/' + entity + '/' + type + '/' + value
        this.$base.http.get(url)
          .then(res => {
            this.$refs.table.load()
          })
      } else {
        this.$message.warning('请选择字段')
      }
    },
    addEntity (data) {
      this.$base.insert('types', data)
        .then(() => {
          this.$refs.entity.load()
        })
    }
  }
}
</script>

<style scoped>
</style>
