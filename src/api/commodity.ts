import { request } from "@/utils/service"

interface GetCommodityListDataApi {
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数 */
  name?: string
  category?: string
  item_no?: number
}
interface AddCommodityDataApi {
  name: string
  item_no?: number
  price?: number
  introduction: string
  category?: number
}

export function getCommodityListApi(params: GetCommodityListDataApi) {
  return request({
    url: "/commodity/search/",
    method: "get",
    params
  })
}

export function addCommodityApi(data: AddCommodityDataApi) {
  return request({
    url: "/commodity/list/",
    method: "post",
    data
  })
}

export function updataCommodityApi(id: number, data: AddCommodityDataApi) {
  return request({
    url: `/commodity/edit/${id}/`,
    method: "put",
    data
  })
}

export function deleteCommodityApi(id: number) {
  return request({
    url: `/commodity/edit/${id}/`,
    method: "delete"
  })
}
export function editCommoditDetailApi(id: number) {
  return request({
    url: `/commodity/editdetail/?method=created&id=${id}`,
    method: "get"
  })
}

export function CommodityDisableOrEnable(id: any) {
  return request({
    url: `/commodity/status/${id}/`,
    method: "put"
  })
}
