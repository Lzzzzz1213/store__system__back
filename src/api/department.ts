import { request } from "@/utils/service"

interface IGetDepartmentListDataApi {
  currentPage: number
  size: number
}

export function getDepartmentListApi(params: IGetDepartmentListDataApi) {
  return request({
    url: "/department/depart/",
    method: "get",
    params
  })
}
