import { request } from "@/utils/service"

export interface CategoryListData {
  id?: number
  name?: string

  updated_time?: string

  created_time?: string
}

interface GetCategoryListDataApi {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数 */
  name?: string
}

interface AddCategoryDataApi {
  name: string
}

export function getCategoryListApi(params?: GetCategoryListDataApi) {
  return request({
    url: "/category/list/",
    method: "get",
    params
  })
}

export function addCategoryApi(data: AddCategoryDataApi) {
  return request({
    url: "/category/list/",
    method: "post",
    data
  })
}

export function updataCategoryApi(id: number, data: AddCategoryDataApi) {
  return request({
    url: `/category/edit/${id}/`,
    method: "put",
    data
  })
}

export function deleteCategoryApi(id: number) {
  return request({
    url: `/category/edit/${id}/`,
    method: "delete"
  })
}
