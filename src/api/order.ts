import { request } from "@/utils/service"

export interface OrderListData {
  id?: number

  order_no?: string

  order_amount?: number

  payment_amount?: number

  status?: string

  customer_id?: number

  shipping_address_id?: number

  remark?: string

  updated_time?: string

  created_time?: string
}

interface GetOrderListDataApi {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number

  order_no: string
}

export function getOrderListApi(params?: GetOrderListDataApi) {
  return request({
    url: "/order/list/",
    method: "get",
    params
  })
}
