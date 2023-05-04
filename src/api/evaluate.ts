import { request } from "@/utils/service"

interface IGetEvaluateListDataApi {
  currentPage: number
  size: number
  remark?: string
}
export function getEvaluateList(params: IGetEvaluateListDataApi) {
  return request({
    url: "/evaluate/list/",
    method: "get",
    params: params
  })
}

export function EvaluateDisableOrEnable(id: any) {
  return request({
    url: `/evaluate/state/${id}/`,
    method: "put"
  })
}
