<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import {
  getCommodityListApi,
  addCommodityApi,
  updataCommodityApi,
  deleteCommodityApi,
  editCommoditDetailApi
} from "@/api/commodity"
import { getCategoryListApi } from "@/api/category"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight, UploadFilled } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { uploadCommodityImgApi } from "@/api/commodity_imgupload"
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  name: "",
  item_no: undefined,
  price: undefined,
  introduction: "",
  category_id: undefined
})
const formDetail = reactive({
  store: undefined
})
const formDeatilRules: FormRules = reactive({
  store: [{ required: true, trigger: "blur", message: "请输入商品库存" }]
})
const formRules: FormRules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入商品名" }],
  category_id: [{ required: true, trigger: "blur", message: "请选择商品种类" }],
  item_no: [{ required: true, trigger: "blur", message: "请输入商品编号" }],
  price: [{ required: true, trigger: "blur", message: "请输入商品价格" }],
  introduction: [{ required: true, trigger: "blur", message: "请输入商品描述" }]
})
const handleCreate = () => {
  console.log(formData.category_id)
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        addCommodityApi({
          name: formData.name,
          item_no: formData.item_no,
          price: formData.price,
          introduction: formData.introduction,
          category: formData.category_id
        }).then(() => {
          ElMessage.success("添加成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        updataCommodityApi(currentUpdateId.value as number, {
          name: formData.name,
          item_no: formData.item_no,
          price: formData.price,
          introduction: formData.introduction,
          category: formData.category_id
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
  formData.name = ""
}
//#endregion

//#region 删
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`正在删除种类：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCommodityApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion
//#region 编辑信息
const currentDetailId = ref<undefined | number>(undefined)
const editDetailImg = ref(false)
const editDetail = (row: any) => {
  currentDetailId.value = row.id
  editCommoditDetailApi(currentDetailId.value as number)
    .then((res) => {
      if (res.msg != null) {
        editDetailImg.value = true
        currentConmmodityImgId.value = res.data.img
        formDetail.store = res.data.store
      } else {
        editDetailImg.value = true
        currentConmmodityImgId.value = res.data[0].img
        formDetail.store = res.data[0].store
      }
    })
    .catch((error) => {
      ElMessage.error("打开商品库存编辑页面失败!")
      console.log(error)
    })
    .finally(() => {
      currentDetailId.value = undefined
    })
}
//#endregion
//#region 改
const currentUpdateId = ref<undefined | number>(undefined)
const handleUpdate = (row: any) => {
  currentUpdateId.value = row.id
  formData.name = row.name
  dialogVisible.value = true
}
//#endregion

//#region 图片上传
const currentConmmodityImgId = ref<undefined | number>(undefined)
const uploadFile = ref(false)
const fileList = ref([])
const upload = (row: any) => {
  currentConmmodityImgId.value = row.img
  fileList.value = []
  uploadFile.value = true
}
const clickSave = () => {
  //验证数据是否合格
  // formEL.validate((flag: any) => {
  //   console.log("flag", flag)
  //   if (!flag) {
  //     ElMessage.error("上传的图片有误，请重新上传")
  //     return
  //   }
  // })
}
//上传前校验
const beforeUpload = (file: any) => {
  const rawFile = file
  const isLt2M = file.size / 1024 / 1024 < 10
  if (!isLt2M) {
    ElMessage.error("上传图片大小不能超过 10MB！")
    return
  }
  if (fileList.value.length > 1) {
    ElMessage.error("只支持上传一个文件")
    return
  }
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png" && rawFile.type !== "image/jpg") {
    console.log("仅支持格式为jpg, jpeg, png的图片")
    ElMessage.error("仅支持格式为jpg, jpeg, png的图片")
    console.log("仅支持格式为jpg, jpeg, png的图片")
    return
  }
  const fd = new FormData()
  fd.append("path", file)
  fd.append("name", file.name)
  uploadCommodityImgApi(currentConmmodityImgId.value as number, fd)
    .then(() => {
      ElMessage.success("上传成功")
    })
    .catch(() => {
      ElMessage.error("上传失败")
    })
    .finally(() => {
      currentConmmodityImgId.value = undefined
    })
}

//文件移除配置方法
const handleRemove = (file: any, files: never[]) => {
  fileList.value = files
}
//#endregion

//#region 查
const tableData = ref<any[]>([])
const categoryData = ref<any[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  name: "",
  category: "",
  item_no: undefined
})
const getCategoryData = () => {
  getCategoryListApi()
    .then((res: any) => {
      console.log("321421313213", res)
      categoryData.value = res.data
    })
    .catch(() => {
      categoryData.value = []
    })
}
getCategoryData()
console.log("categoryData", categoryData)
const getTableData = () => {
  loading.value = true
  getCommodityListApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    name: searchData.name || undefined,
    category: searchData.category || undefined,
    item_no: searchData.item_no || undefined
  })
    .then((res: any) => {
      paginationData.total = res.total
      tableData.value = res.data
      console.log("123444", res.data)
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
        <el-form-item prop="name" label="商品名称">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="name" label="种类名称">
          <el-input v-model="searchData.category" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="name" label="商品编号">
          <el-input v-model="searchData.item_no" placeholder="请输入" />
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增商品</el-button>
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
          <el-table-column prop="name" label="名称" align="center" />
          <!-- <el-table-column prop="img" label="商品图片" align="center" />-->
          <el-table-column prop="" label="商品图片">
            <!-- 通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据，用法参考 demo。 -->
            <!-- slot插槽可以传递任何属性或html元素，但是在调用组件的页面中我们可以使用 template slot-scope="props"来获取插槽上的属性值，获取到的值是一个对象。 -->
            <template v-slot="scope">
              <!-- scope.row获取当前行所有数据 作用域插槽获取当前行的数据（可以是图片连接如下：:src="scope.row.iconImgLarge"） -->
              <el-image
                style="width: 50px; height: 50px"
                :src="`http://127.0.0.1:9000/demo/api/img/media/${scope.row.img_path}`"
                fit=""
              />
            </template>
          </el-table-column>
          <el-table-column prop="category_name" label="商品类别" align="center" />
          <el-table-column prop="item_no" label="商品编号" align="center" />
          <el-table-column prop="price" label="商品价格" align="center" />
          <el-table-column prop="introduction" label="商品描述" align="center" />
          <el-table-column prop="created_time" label="添加时间" align="center" />
          <el-table-column prop="updated_time" label="修改时间" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改商品</el-button>
              <el-button type="primary" text bg size="small" @click="upload(scope.row)">上传图片</el-button>
              <el-button type="primary" text bg size="small" @click="editDetail(scope.row)">编辑商品详细信息</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除商品</el-button>
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
      :title="currentUpdateId === undefined ? '新增商品' : '修改商品'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="name" label="商品名称">
          <el-input v-model="formData.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item prop="item_no" label="商品编号">
          <el-input v-model="formData.item_no" placeholder="请输入商品编号" />
        </el-form-item>
        <el-form-item prop="price" label="商品价格">
          <el-input v-model="formData.price" placeholder="请输入商品价格" />
        </el-form-item>
        <el-form-item prop="introduction" label="商品描述">
          <el-input v-model="formData.introduction" placeholder="请输入商品描述" />
        </el-form-item>
        <el-form-item prop="category_id" label="商品类别">
          <el-select v-model="formData.category_id" placeholder="请选择类别">
            <el-option v-for="item in categoryData" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog title="编辑商品详细信息图录" :close-on-click-modal="false" v-model="editDetailImg" width="500px">
      <el-form ref="formRef" :model="formDetail" :rules="formDeatilRules" label-width="50px" label-position="left">
        <el-form-item prop="store" label="库存">
          <el-input v-model="formDetail.store" placeholder="请输入商品库存" />
        </el-form-item>
      </el-form>
      <el-upload
        class="upload-demo"
        drag
        accept=".jpeg,.png,.jpg"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :on-remove="handleRemove"
        :limit="1"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，<em>或点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">只支持jpg, jpeg, png格式的图片文件</div>
        </template>
      </el-upload>

      <template #footer>
        <div style="text-align: center; width: 100%">
          <el-button type="primary" style="width: 200px" @click="clickSave()">提交</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="上传文件" :close-on-click-modal="false" v-model="uploadFile" width="500px">
      <el-upload
        class="upload-demo"
        drag
        accept=".jpeg,.png,.jpg"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :on-remove="handleRemove"
        :limit="1"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，<em>或点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">只支持jpg, jpeg, png格式的图片文件</div>
        </template>
      </el-upload>

      <template #footer>
        <div style="text-align: center; width: 100%">
          <el-button type="primary" style="width: 200px" @click="clickSave()">提交</el-button>
        </div>
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
