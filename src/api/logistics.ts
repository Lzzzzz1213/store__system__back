import { request } from "@/utils/service"
interface addLogisticsItf {
  logistics_no: string
  order: number
}

export function addLogistics(data: addLogisticsItf) {
  return request({
    url: "/logistics/add/",
    method: "post",
    data: data
  })
}

export function getLogistics(id: any) {
  return request({
    url: `/logistics/detail/${id}/`,
    method: "get"
  })
}

export function editLogistics(data: addLogisticsItf) {
  return request({
    url: "/logistics/edit/",
    method: "put",
    data: data
  })
}
