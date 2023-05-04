<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { deleteTableDataApi, updateTableDataApi } from "@/api/table"
import { createUserDataApi, getUserDataApi, UserDisableOrEnable } from "@/api/user"
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

// 验证用户名长度是否符合要求
const validateUsernameLength = (rule: any, value: any, callback: Function) => {
  if (value && (value.length < 6 || value.length > 20)) {
    return callback(new Error("用户名长度必须在 6-20 个字符之间"))
  }
  callback()
}

// 验证邮箱格式是否正确
const validateEmailFormat = (rule: any, value: any, callback: Function) => {
  // 正则表达式用于验证邮箱格式
  const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  if (value && !reg.test(value)) {
    return callback(new Error("请输入正确的邮箱格式"))
  }
  callback()
}

// 验证手机号长度是否等于11位
const validateMobileLength = (rule: any, value: any, callback: Function) => {
  if (value && value.length !== 11) {
    return callback(new Error("手机号码长度必须为11位"))
  }
  callback()
}

// 验证身份证格式是否正确
const validateIdCardFormat = (rule: any, value: any, callback: Function) => {
  const checkDate = (year: number, month: number, day: number) => {
    const date = new Date(`${year}/${month}/${day}`)
    return (
      date.getFullYear() === Number(year) && date.getMonth() + 1 === Number(month) && date.getDate() === Number(day)
    )
  }
  if (!value) {
    return callback(new Error("请输入身份证号码"))
  }
  const len = value.length
  if (len !== 18) {
    return callback(new Error("请输入18位身份证号码"))
  }
  if (!/^\d{17}(\d|x)$/i.test(value)) {
    return callback(new Error("身份证号码格式错误"))
  }
  // 加权因子 Weight factor
  const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  // 身份证号码校验码的设置
  const VerificationCode = "10X98765432"
  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += +value[i] * Wi[i]
  }
  const modValue = sum % 11
  const checkCode = value[17].toUpperCase() === "X" ? 10 : +value[17]
  if (checkCode === parseInt(VerificationCode[modValue]) || (checkCode === 10 && modValue === 2)) {
    const birthYear = value.slice(6, 10)
    const birthMonth = value.slice(10, 12)
    const birthDay = value.slice(12, 14)
    if (!checkDate(birthYear, birthMonth, birthDay)) {
      console.log("2")
      return callback(new Error("身份证号码格式错误"))
    }
    const sex = +value[16] % 2 === 0 ? "女" : "男"
    callback()
  } else {
    return callback(new Error("身份证号码格式错误"))
  }
}
const validatePasswordLength = (rule: any, value: any, callback: Function) => {
  if (value && (value.length < 6 || value.length > 20)) {
    return callback(new Error("密码长度必须在 6-20 个字符之间"))
  }
  callback()
}

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
  username: [
    { required: true, trigger: "blur", message: "请输入用户名" },
    { validator: validateUsernameLength, trigger: "blur" }
  ],
  password: [
    { required: true, trigger: "blur", message: "请输入密码" },
    { validator: validatePasswordLength, trigger: "blur" }
  ],
  email: [
    { required: true, trigger: "blur", message: "请输入邮箱" },
    { validator: validateEmailFormat, trigger: "blur" }
  ],
  id_card: [
    { required: true, trigger: "blur", message: "请输入身份证" },
    { validator: validateIdCardFormat, trigger: "blur" }
  ],
  phone: [
    { required: true, trigger: "blur", message: "请输入手机号" },
    { validator: validateMobileLength, trigger: "blur" }
  ]
})

const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createUserDataApi({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          head_portrait_url: formData.head_portrait_url,
          id_card: formData.id_card,
          phone: formData.phone,
          type: formData.type
        }).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        updateTableDataApi({
          id: currentUpdateId.value,
          username: formData.username
        }).then(() => {
          ElMessage.success("修改成功")
          dialogVisible.value = false
          getTableData()
        })
      }
    } else {
      return false
    }
  })
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.username = ""
  formData.password = ""
  formData.email = ""
  formData.id_card = ""
  formData.phone = ""
}
//#endregion

//#region 删
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`正在删除用户：${row.username}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTableDataApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
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
  username: "",
  email: "",
  phone: ""
})
const getTableData = () => {
  loading.value = true
  getEmployeeListApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    username: searchData.username || undefined,
    phone: searchData.phone || undefined,
    email: searchData.email || undefined
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
function userDisableOrEnable(user_id: any) {
  if (Number(user_id) === Number(userStore.id)) {
    ElMessage.error("不能操作自己的账号！")
    return
  }
  UserDisableOrEnable(user_id)
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
        <el-form-item prop="username" label="用户名">
          <el-input v-model="searchData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱号">
          <el-input v-model="searchData.email" placeholder="请输入邮箱号" />
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增用户</el-button>
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
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="head_portrait_url" label="头像" align="center">
            <template #default="scope">
              <el-avatar :src="`http://${server}/demo/api/img/media/${scope.row.img_path}`" :size="50" />
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" />
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-tag
                v-if="scope.row.is_active"
                type="success"
                effect="plain"
                @click="userDisableOrEnable(scope.row.id)"
                >启用</el-tag
              >
              <el-tag v-else type="danger" effect="plain" @click="userDisableOrEnable(scope.row.id)">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="上一次登陆" align="center">
            <template #default="scope">
              {{ scope.row.last_login ? moment(scope.row.last_login).format("YYYY-MM-DD HH:mm:ss") : "没有登录记录" }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
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
      :title="currentUpdateId === undefined ? '新增用户' : '修改用户'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="formData.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item prop="id_card" label="身份证">
          <el-input v-model="formData.id_card" placeholder="请输入身份证" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
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
.el-tag:hover {
  cursor: pointer;
}
</style>
