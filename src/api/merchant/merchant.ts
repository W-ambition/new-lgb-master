import { defHttp } from '/@/utils/http/axios';
import {
  GetMerchantListParams,
} from './model/merchantModel';

enum Api {
  GetMerchantList = '/merchant/getdic',
}

/**
 * @description: 获取商户列表dic
 */
 export function getMerchantList(params: GetMerchantListParams) {
  return defHttp.post({
    url: Api.GetMerchantList,
    params,
  });
}
