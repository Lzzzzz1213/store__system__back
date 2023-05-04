<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { getEvaluateList, EvaluateDisableOrEnable } from "@/api/evaluate"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { getEmployeeListApi } from "@/api/employee"
import moment from "moment/moment"
import { useUserStore } from "@/store/modules/user"

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const server = import.meta.env.VITE_APP_SERVER_IP
const userStore = useUserStore()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  username: "",
  password: "",
  email: "",
  id_card: "",
  phone: "",
  head_portrait_url: "https://img2.woyaogexing.com/2023/01/17/d2ca4e40164bd990d83e51d066b8053e.jpg",
  type: "user"
})
const formRules: FormRules = reactive({
  username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }],
  email: [{ required: true, trigger: "blur", message: "请输入邮箱" }],
  id_card: [{ required: true, trigger: "blur", message: "请输入身份证" }],
  phone: [{ required: true, trigger: "blur", message: "请输入手机号" }]
})

const resetForm = () => {
  currentUpdateId.value = undefined
  formData.username = ""
  formData.password = ""
  formData.email = ""
  formData.id_card = ""
  formData.phone = ""
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: any) => {
  currentUpdateId.value = row.id
  formData.username = row.username
  formData.password = row.password
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<any[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  remark: ""
})
const getTableData = () => {
  loading.value = true
  getEvaluateList({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    remark: searchData.remark || undefined
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
function userDisableOrEnable(evalute_id: any) {
  EvaluateDisableOrEnable(evalute_id)
    .then(() => {
      ElMessage.success("修改状态成功")
      getTableData()
    })
    .catch((error) => {
      ElMessage.error(`修改状态失败,${error.msg}`)
    })
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="remark" label="留言信息">
          <el-input v-model="searchData.remark" placeholder="请输入留言相关关键字" />
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
          <el-button type="danger" :icon="Delete" disabled>批量删除</el-button>
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
          <el-table-column prop="customer_id" label="客户编号" align="center" />
          <el-table-column prop="grade" label="客户评分" align="center" />
          <el-table-column prop="remark" label="留言内容" align="center" />
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status" type="success" effect="plain" @click="userDisableOrEnable(scope.row.id)"
                >启用</el-tag
              >
              <el-tag v-else type="danger" effect="plain" @click="userDisableOrEnable(scope.row.id)">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="评价日期" align="center">
            <template #default="scope">
              {{ moment(scope.row.created_time).format("YYYY-MM-DD HH:mm:ss") }}
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
.el-tag:hover {
  cursor: pointer;
}
</style>
