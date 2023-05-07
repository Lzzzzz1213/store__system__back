<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { getOrderListApi, orderDetail } from "@/api/order"
import { userShoppingAddressDetail } from "@/api/address"
import { addLogistics, getLogistics, editLogistics } from "@/api/logistics"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, ElScrollbar } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import moment from "moment/moment"

const loading = ref<boolean>(false)
const visible = ref<boolean>(false)
const logistics_no = ref<string>("没有物流信息")
const order = ref<number>(0)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const server = import.meta.env.VITE_APP_SERVER_IP
//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  orderNumber: "",
  status: "",
  receiverName: "",
  phoneNumber: "",
  address: "",
  goodsList: [],
  totalAmount: undefined,
  orderTime: ""
})
const activeNames = ref(["detail"])
const formRules: FormRules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入订单编号" }]
})
const resetForm = () => {
  formData.orderNumber = ""
  formData.status = ""
  formData.receiverName = ""
  formData.phoneNumber = ""
  formData.address = ""
  formData.goodsList = []
  formData.totalAmount = undefined
  formData.orderTime = ""
  logistics_no.value = "没有物流信息"
  order.value = -1
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | number>(undefined)
const handleUpdate = (row: any) => {
  visible.value = true
  order.value = row.id
}
//#endregion

//#region 查
const tableData = ref<any[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  order_no: "",
  status: ""
})
const getTableData = () => {
  loading.value = true
  getOrderListApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    order_no: searchData.order_no || undefined,
    status: searchData.status || undefined
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
function orderDetailHandler(id: any) {
  dialogVisible.value = true
  order.value = id
  orderDetail(id).then((res) => {
    formData.orderNumber = res.data.order_no
    formData.status = res.data.status
    formData.goodsList = JSON.parse(res.data.details)
    formData.totalAmount = res.data.order_amount
    formData.orderTime = res.data.created_time
    if (formData.status === "2") {
      getLogistics(id).then((res) => {
        if (!res.data.msg) {
          logistics_no.value = res.data.logistics_no
        }
      })
    }
    userShoppingAddressDetail(res.data.shipping_address).then((res) => {
      formData.receiverName = res.data.linkMan
      formData.phoneNumber = res.data.mobile
      formData.address = res.data.provinceStr + res.data.cityStr + res.data.areaStr + res.data.address
    })
  })
}
function AddLogistics() {
  const params = {
    logistics_no: logistics_no.value,
    order: order.value
  }
  addLogistics(params)
    .then(() => {
      ElMessage.success("添加物流成功！")
    })
    .catch((error) => {
      ElMessage.error(`添加物流失败！${error}`)
    })
}

function EditLogistics() {
  const params = {
    logistics_no: logistics_no.value,
    order: order.value
  }
  editLogistics(params)
    .then(() => {
      ElMessage.success("修改物流成功！")
    })
    .catch((error) => {
      ElMessage.error(`修改物流失败！${error}`)
    })
}
function handleSubmit() {
  const params = {
    logistics_no: logistics_no.value,
    order: order.value
  }
  console.log(params)
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="order_no" label="订单编号">
          <el-input v-model="searchData.order_no" placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item prop="status" label="订单状态">
          <el-select v-model="searchData.status" placeholder="请选择订单状态">
            <el-option-group label="订单状态">
              <el-option label="未支付" value="0" />
              <el-option label="已支付" value="1" />
              <el-option label="已发货" value="2" />
              <el-option label="已签收" value="3" />
            </el-option-group>
          </el-select>
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
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="编号" align="center" />
          <el-table-column prop="order_no" label="订单编号" align="center" />
          <el-table-column prop="order_amount" label="订单金额" align="center" />
          <el-table-column prop="payment_amount" label="实付金额" align="center" />
          <el-table-column prop="status" label="订单状态" align="center">
            <template #default="scope">
              <span v-if="scope.row.status === '2'">已发货，等待客户签收</span>
              <span v-else-if="scope.row.status === '1'">客户已支付，等待发货</span>
              <span v-else-if="scope.row.status === '3'">客户已签收，订单结束</span>
              <span v-else-if="scope.row.status === '0'">等待客户支付订单</span>
            </template>
          </el-table-column>
          <el-table-column prop="customer" label="客户id" align="center" />
          <el-table-column prop="remark" label="备注" align="center" />
          <el-table-column label="添加时间" align="center">
            <template #default="scope">
              {{ moment(scope.row.created_time).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column label="修改时间" align="center">
            <template #default="scope">
              {{ moment(scope.row.updated_time).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <!--              <el-button-->
              <!--                type="primary"-->
              <!--                v-if="scope.row.status === '1'"-->
              <!--                text-->
              <!--                round-->
              <!--                bg-->
              <!--                size="small"-->
              <!--                @click="handleUpdate(scope.row)"-->
              <!--                >发货-->
              <!--              </el-button>-->
              <el-button type="primary" text round bg size="small" @click="orderDetailHandler(scope.row.id)"
                >详情
              </el-button>
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
    <el-dialog v-model="dialogVisible" title="订单详情" @close="resetForm" width="40%">
      <el-scrollbar class="scrollbar-container">
        <el-form ref="form" :model="formData" label-width="120px" class="form-container">
          <el-form-item label="订单编号">
            <span>{{ formData.orderNumber }}</span>
          </el-form-item>
          <el-form-item label="收货人">
            <span>{{ formData.receiverName }}</span>
          </el-form-item>
          <el-form-item label="联系电话">
            <span>{{ formData.phoneNumber }}</span>
          </el-form-item>
          <el-form-item label="收货地址">
            <span>{{ formData.address }}</span>
          </el-form-item>
          <el-form-item label="订单金额">
            <span>{{ formData.totalAmount }}</span>
          </el-form-item>
          <el-form-item label="下单时间">
            <span>{{ moment(formData.orderTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
          </el-form-item>
          <el-form-item label="订单状态">
            <span>
              {{
                formData.status === "0"
                  ? "未支付"
                  : formData.status === "1"
                  ? "待发货"
                  : formData.status === "2"
                  ? "等待签收"
                  : formData.status === "3"
                  ? "已完成"
                  : ""
              }}
            </span>
          </el-form-item>
          <el-collapse v-model="activeNames" class="collapse-container">
            <el-collapse-item title="商品列表" name="goods">
              <div class="list">
                <div v-for="(item, index) in formData.goodsList" :key="index" class="list-item">
                  <el-image
                    fit="contain"
                    class="list-item-pic"
                    :src="`http://${server}/demo/api/img/media/${item.commodity_path}`"
                  />
                  <div class="list-item-content">
                    <div class="list-item-title">{{ item.commodity_name }}</div>
                    <div class="list-item-bottom">
                      <div class="list-item-price text-brand-color">
                        <span class="list-item-price-symbol">¥</span>
                        <span class="list-item-price-integer">{{ item.price }}</span>
                      </div>
                      <div class="list-item-number">x{{ item.number }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <div class="dialog-footer">
              <el-form inline>
                <el-form-item label="物流编号:">
                  <el-input :disabled="formData.status === '0' || formData.status === '3'" v-model="logistics_no" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="AddLogistics" v-if="formData.status === '1'">发 货</el-button>
                  <el-button type="primary" @click="EditLogistics" v-if="formData.status === '2'">修改物流</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse>
        </el-form>
      </el-scrollbar>
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

.el-scrollbar__wrap {
  padding: 10px;
  display: block;
}

.form-container {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
}

.el-form-item__label {
  color: #606266;
  font-weight: bold;
}

.el-form-item__content {
  font-size: 14px;
  margin-top: 5px;
}

.el-collapse-item__header {
  font-size: 16px;
  color: #409eff;
  border: none;
  padding: 0;
}

.el-collapse-item__content {
  padding: 0;
}

.goods-table {
  margin-top: 20px;
  font-size: 14px;
}

.submit-btn {
  margin-top: 20px;
}

.list {
  max-width: 800px;
  margin: 0 auto;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.list-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.list-item-pic {
  width: 80px;
  height: 80px;
  margin-right: 20px;
  border-radius: 5px;
}

.list-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.list-item-title {
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.list-item-prop {
  font-size: 14px;
  color: #666;
}

.list-item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.list-item-price {
  font-size: 16px;
  color: #f00;
}

.list-item-price-symbol {
  font-size: 14px;
}

.list-item-price-integer {
  font-weight: bold;
  font-size: 18px;
}

.list-item-number {
  font-size: 14px;
  color: #666;
}

.dialog-footer {
  padding: 20px;
  border-top: 1px solid #ebebeb;
}
</style>
