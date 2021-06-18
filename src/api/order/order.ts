import { defHttp } from '/@/utils/http/axios';



enum Api {
  GetOrderDetail = '/order/queryorder',
}


/**
 * @description: 根据订单Id查询订单信息
 */
 export function getOrderDetail(id: string) {
  return defHttp.get({
    url: `${Api.GetOrderDetail}/${id}`,
  });
}
