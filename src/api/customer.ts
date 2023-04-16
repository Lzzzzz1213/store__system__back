import { request } from "@/utils/service"

export interface IEmplData {
  id?: number
  head_portrait_url?: string
  email?: string
  phone?: string
  last_login?: string
  username?: string
}

interface IGetCustomerListDataApi {
  currentPage: number
  size: number
}
export function getCustomerListApi(params: IGetCustomerListDataApi) {
  return request({
    url: "/customer/list/",
    method: "get",
    params
  })
}
