import { defHttp } from '/@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoByUserIdParams,
  GetUserInfoByUserIdModel,
  GetPermCodeByUserIdModel,
} from './model/userModel';

import { ErrorMessageMode } from '/@/utils/http/axios/types';

enum Api {
  Login = '/user/login',
  GetUserInfoById = '/user/getuserinfo',
  // GetPermCodeByUserId = '/getPermCodeByUserId',
  GetPermCodeByUserId = '/userpermission/getbyid',
}

/**
 * @description: 登录
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

/**
 * @description: 获取用户信息
 */
export function getUserInfoById(params: GetUserInfoByUserIdParams) {
  return defHttp.post<GetUserInfoByUserIdModel>({
    url: Api.GetUserInfoById,
    params,
  });
}

export function getPermCodeByUserId(params: {UserId: string}) {
  return defHttp.post<GetPermCodeByUserIdModel>({
    url: Api.GetPermCodeByUserId,
    params
  });
}
