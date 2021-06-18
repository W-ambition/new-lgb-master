import { defHttp } from '/@/utils/http/axios';
import {
  GetMachineShortInfoParams,
  GetMachineShortInfoModel,
  GetMachineDetailParams,
  GetMachineDetailModal
} from './model/machineModel';

enum Api {
  GetMachineShortInfo = '/machine/querymachineshortinfo',
  GetMachineDetail = '/machine/getdetail',
}

/**
 * @description: 获取机器dic
 */
 export function getMachineShortInfo(params: GetMachineShortInfoParams) {
  return defHttp.post<GetMachineShortInfoModel>({
    url: Api.GetMachineShortInfo,
    params,
  });
}

/**
 * @description: 获取机器详情
 */
 export function getMachineDetail(params: GetMachineDetailParams) {
  return defHttp.post<GetMachineDetailModal>({
    url: Api.GetMachineDetail,
    params,
  });
}
