import { defHttp } from '/@/utils/http/axios';
import {
  GetLotteryInfoListParams,
  GetLotteryInfoListModel,
  GetLotteryListParams,
  GetLotteryListModel,
  AddLotteryParams,
  DeleteLotteryParams,
  EditLotteryParams,
  GetLotteryDetailsParams,
  DeleteLotteryPackageRuleParams,
  AddLotteryPackageRuleParams,
  EditLotteryPackageRuleParams,
  GetLotteryBatchParams,
  AddLotteryBatchParams,
  DeleteLotteryBatchParams,
  GetLotteryBatchListModel,
  EditLotteryBatchParams,
  GetLotteryDetailByWareHouseIdParams,
  CheckLotteryInWoreHouseParams
} from './model/lotteryModel';

enum Api {
  GetLotteryInfoList = '/lottery/getlist',
  GetLotteryList = '/lottery/listlottery',
  AddLottery = '/lottery/addlottery',
  DeleteLottery = '/lottery/deletelottery',
  EditLottery = '/lottery/editlottery',
  GetLotteryDetails = '/lottery/getlotterydetails',
  DeleteLotteryPackageRule = '/lottery/deletelotterypackagerule',
  AddLotteryPackageRule = '/lottery/addlotterypackagerule',
  EditLotteryPackageRule = '/lottery/editlotterypackagerule',
  GetLotteryBatch = '/lotterybatch/querylotterybatch',
  AddLotteryBatch = '/lotterybatch/addlotterybatch',
  DeleteLotteryBatch = '/lotterybatch/deletelotterybatch',
  EditLotteryBatch = '/lotterybatch/editlotterybatch',
  GetLotteryDetailByWareHouseId = '/stockdetail/checklotterystockdetail',
  CheckLotteryInWoreHouse = '/stockdetail/checklotteryoutstockdetail'
}

/**
 * @description: 获取票种信息列表
 */
export function getLotteryInfoList(params: GetLotteryInfoListParams) {
  return defHttp.post<GetLotteryInfoListModel>({
    url: Api.GetLotteryInfoList,
    params,
  });
}

/**
 * @description: 获取彩票列表，字典
 */
 export function getLotteryList(params: GetLotteryListParams) {
  return defHttp.post<GetLotteryListModel>({
    url: Api.GetLotteryList,
    params,
  });
}

/**
 * @description: 添加彩种
 */
 export function addLottery(params: AddLotteryParams) {
  return defHttp.post({
    url: Api.AddLottery,
    params,
  });
}

/**
 * @description: 删除彩种
 */
 export function deleteLottery(params: DeleteLotteryParams) {
  return defHttp.post({
    url: Api.DeleteLottery,
    params,
  });
}

/**
 * @description: 修改彩种
 */
 export function editLottery(params: EditLotteryParams) {
  return defHttp.post({
    url: Api.EditLottery,
    params,
  });
}

/**
 * @description: 获取彩种详情
 */
 export function getLotteryDetails(params: GetLotteryDetailsParams) {
  return defHttp.post({
    url: Api.GetLotteryDetails,
    params,
  });
}

/**
 * @description: 获取指定仓库下彩种库存及彩种信息
 */
 export function getLotteryDetailByWareHouseId(params: GetLotteryDetailByWareHouseIdParams) {
  return defHttp.post({
    url: Api.GetLotteryDetailByWareHouseId,
    params,
  });
}

/**
 * @description: 删除彩票包规则
 */
 export function deleteLotteryPackageRule(params: DeleteLotteryPackageRuleParams) {
  return defHttp.post({
    url: Api.DeleteLotteryPackageRule,
    params,
  });
}

/**
 * @description: 新增彩票包规则
 */
 export function addLotteryPackageRule(params: AddLotteryPackageRuleParams) {
  return defHttp.post({
    url: Api.AddLotteryPackageRule,
    params,
  });
}

/**
 * @description: 修改彩票包规则
 */
 export function editLotteryPackageRule(params: EditLotteryPackageRuleParams) {
  return defHttp.post({
    url: Api.EditLotteryPackageRule,
    params,
  });
}

/**
 * @description: 查询彩票批次
 */
 export function getLotteryBatch(params: GetLotteryBatchParams) {
  return defHttp.post<GetLotteryBatchListModel>({
    url: Api.GetLotteryBatch,
    params,
  });
}

/**
 * @description: 新增彩票批次
 */
 export function addLotteryBatch(params: AddLotteryBatchParams) {
  return defHttp.post({
    url: Api.AddLotteryBatch,
    params,
  });
}

/**
 * @description: 修改彩票批次
 */
 export function editLotteryBatch(params: EditLotteryBatchParams) {
  return defHttp.post({
    url: Api.EditLotteryBatch,
    params,
  });
}

/**
 * @description: 删除彩票批次
 */
 export function deleteLotteryBatch(params: DeleteLotteryBatchParams) {
  return defHttp.post({
    url: Api.DeleteLotteryBatch,
    params,
  });
}

/**
 * @description: 彩票出库时 校验彩票包是否在仓库中
 */
 export function checkLotteryInWoreHouse(params: CheckLotteryInWoreHouseParams) {
  return defHttp.post({
    url: Api.CheckLotteryInWoreHouse,
    params,
  });
}
