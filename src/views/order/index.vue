<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { getOrderListApi } from "@/api/order"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { status } from "nprogress"

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  status: ""
})
const formRules: FormRules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入订单编号" }]
})
// const handleCreate = () => {
//   formRef.value?.validate((valid: boolean) => {
//     if (valid) {
//       if (currentUpdateId.value === undefined) {
//         addCategoryApi({
//           name: formData.name
//         }).then(() => {
//           ElMessage.success("添加成功")
//           dialogVisible.value = false
//           getTableData()
//         })
//       } else {
//         updataCategoryApi(currentUpdateId.value as number, { name: formData.name }).then(() => {
//           ElMessage.success("修改成功")
//           dialogVisible.value = false
//           getTableData()
//         })
//       }
//     } else {
//       return false
//     }
//   })
// }
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.status = ""
}
//#endregion

//#region 删
// const handleDelete = (row: any) => {
//   ElMessageBox.confirm(`正在删除种类：${row.name}，确认删除？`, "提示", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     type: "warning"
//   }).then(() => {
//     deleteCategoryApi(row.id).then(() => {
//       ElMessage.success("删除成功")
//       getTableData()
//     })
//   })
// }
//#endregion

//#region 改
const currentUpdateId = ref<undefined | number>(undefined)
const handleUpdate = (row: any) => {
  currentUpdateId.value = row.id
  formData.status = row.status
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<any[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  order_no: ""
})
const getTableData = () => {
  loading.value = true
  getOrderListApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    order_no: searchData.order_no
  })
    .then((res: any) => {
      paginationData.total = res.total
      tableData.value = res.data
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}
const handleRefresh = () => {
  getTableData()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="name" label="订单编号">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <!--          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增种类</el-button>-->
          <el-button type="danger" :icon="Delete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <!--        <el-table >:data="userlist"-->
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="编号" align="center" />
          <el-table-column prop="order_no" label="订单编号" align="center" />
          <el-table-column prop="order_amount" label="订单金额" align="center" />
          <el-table-column prop="payment_amount" label="实付金额" align="center" />
          <el-table-column prop="status" label="订单状态" align="center" />
          <el-table-column prop="customer" label="客户id" align="center" />
          <el-table-column prop="remark" label="备注" align="center" />
          <el-table-column prop="created_time" label="添加时间" align="center" />
          <el-table-column prop="updated_time" label="修改时间" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button
                type="primary"
                v-if="scope.row.status === '1'"
                text
                bg
                size="small"
                @click="handleUpdate(scope.row)"
                >发货
              </el-button>
              <!--              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增种类' : '修改种类'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="name" label="物流编号">
          <el-input v-model="formData.name" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
