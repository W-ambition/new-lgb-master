import { defHttp } from '/@/utils/http/axios';
import {
  userItem,
  GetUserDicParams
} from './model/staffModel';

enum Api {
  GetUserDic = '/user/getdic',
  GetUserDetail = '/user/getdetail',
}

/**
 * @description: 获取用户字典
 */
 export function getUserDic(params?: GetUserDicParams) {
  return defHttp.post<userItem[]>({
    url: Api.GetUserDic,
    params,
  });
}

/**
 * @description: 根据手机号获取用户信息
 */
 export function getUserDetail(params: GetUserDicParams) {
  return defHttp.post<userItem>({
    url: Api.GetUserDetail,
    params,
  });
}
