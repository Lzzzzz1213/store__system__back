import { request } from "@/utils/service"

// interface FormRuleCommodityImgProps {
//   imgText?: string
//   disabledType?: boolean
// }

export function uploadCommodityImgApi(id: number, data: any) {
  console.log("id", id)
  return request({
    url: `/img/commodityimgupload/${id}/`,
    method: "put",
    data: data,
    headers: { "Content-Type": "multipart/form-data" }
  })
}
