import { defHttp } from '/@/utils/http/axios';
import {
  GetRegionDicParams
} from './model/generousModel';

enum Api {
  GetRegionDic = '/region/query',
}

/**
 * @description: 获取地区联动信息
 */
 export function getRegionDic(params: GetRegionDicParams) {
  return defHttp.post({
    url: Api.GetRegionDic,
    params,
  });
}
