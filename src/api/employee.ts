import { request } from "@/utils/service"

export interface IEmplData {
  id?: number
  head_portrait_url?: string
  email?: string
  phone?: string
  last_login?: string
  username?: string
}

interface IGetEmplyListDataApi {
  currentPage: number
  size: number
}
export function getEmployeeListApi(params: IGetEmplyListDataApi) {
  return request({
    url: "/user/employeelist/",
    method: "get",
    params
  })
}
