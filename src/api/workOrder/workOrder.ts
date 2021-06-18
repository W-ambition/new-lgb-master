import { defHttp } from '/@/utils/http/axios';
import {
  GetWorkOrderListParams,
  GetWorkOrderLogParams,
  AddWorkOrderByLotteryParams,
  GetWorkOrderDetailByLotteryParams,
  GetWorkOrderDetailByLotteryModal,
  ExecuteWorkOrderByLotteryParams,
  DeleteWorkOrderParams,
  UpdateWorkOrderByLotteryParams,
  CompleteWorkOrderByLotteryParams,
  GetFailureTicketsParams,
  GetSuccessPackagesParams,
  GetSuccessTicketsParams,
  UpdateCheckTicketsParams,
  GetWorkOrderDetailByRepairParams,
  AddWorkOrderByRepairParams,
  UpdateWorkOrderByRepairParams,
  AddWorkOrderByMachineReturnParams,
  UpdateWorkOrderByMachineReturnParams,
  GetWorkOrderDetailByMachineReturnParams,
  AddWorkOrderByMachineOutParams,
  GetWorkOrderDetailByMachineOutParams,
  UpdateWorkOrderByMachineOutParams,
  AddRefundParams
} from './model/workOrderModel';

enum Api {
  GetWorkOrderList = '/workorder/queryworkorderlist',
  GetWorkOrderLog = '/workorder/queryworkorderlog',
  AddWorkOrderByLottery = '/workorder/createlotteryworkorder',
  GetWorkOrderDetailByLottery = '/workorder/getlotterydetail',
  ExecuteWorkOrderByLottery = '/workorder/executelotteryworkorder',
  DeleteWorkOrder = '/workorder/delete',
  UpdateWorkOrderByLottery = '/workorder/updatelotteryworkorder',
  CompleteWorkOrderByLottery = '/workorder/completelotteryworkorder',
  GetFailureTickets = '/workorder/queryfailuretickets',
  GetSuccessPackages = '/workorder/queryquccesspackages',
  GetSuccessTickets = '/workorder/querysuccesstickets',
  UpdateCheckTickets = '/workorder/updatechecktickets',
  GetWorkOrderDetailByRepair = '/workorder/getrepairdetail',
  AddWorkOrderByRepair = '/workorder/addrepair',
  UpdateWorkOrderByRepair = '/workorder/updaterepair',
  AddWorkOrderByMachineReturn = '/workorder/addmachinereturn',
  UpdateWorkOrderByMachineReturn = '/workorder/updatemachinereturn',
  GetWorkOrderDetailByMachineReturn = '/workorder/getmachinereturndetail',
  AddWorkOrderByMachineOut = '/workorder/addmachine',
  GetWorkOrderDetailByMachineOut = '/workorder/getmachinedetail',
  UpdateWorkOrderByMachineOut = '/workorder/updatemachine',
  AddRefund = '/workorder/addrefund',
}

/**
 * @description: 获取工单列表
 */
 export function getWorkOrderList(params: GetWorkOrderListParams) {
  return defHttp.post({
    url: Api.GetWorkOrderList,
    params,
  });
}

/**
 * @description: 获取工单日志
 */
 export function getWorkOrderLog(params: GetWorkOrderLogParams) {
  return defHttp.post({
    url: Api.GetWorkOrderLog,
    params,
  });
}

/**
 * @description: 发起加票工单
 */
 export function addWorkOrderByLottery(params: AddWorkOrderByLotteryParams) {
  return defHttp.post({
    url: Api.AddWorkOrderByLottery,
    params,
  });
}

/**
 * @description: 获取加票工单详情
 */
 export function getWorkOrderDetailByLottery(params: GetWorkOrderDetailByLotteryParams) {
  return defHttp.post<GetWorkOrderDetailByLotteryModal>({
    url: Api.GetWorkOrderDetailByLottery,
    params,
  });
}

/**
 * @description: 执行加票工单
 */
 export function executeWorkOrderByLottery(params: ExecuteWorkOrderByLotteryParams) {
  return defHttp.post({
    url: Api.ExecuteWorkOrderByLottery,
    params,
  });
}

/**
 * @description: 删除工单
 */
 export function deleteWorkOrder(params: DeleteWorkOrderParams) {
  return defHttp.post({
    url: Api.DeleteWorkOrder,
    params,
  });
}

/**
 * @description: 修改加票工单
 */
 export function updateWorkOrderByLottery(params: UpdateWorkOrderByLotteryParams) {
  return defHttp.post({
    url: Api.UpdateWorkOrderByLottery,
    params,
  });
}

/**
 * @description: 完成加票工单
 */
 export function completeWorkOrderByLottery(params: CompleteWorkOrderByLotteryParams) {
  return defHttp.post({
    url: Api.CompleteWorkOrderByLottery,
    params,
  });
}

/**
 * @description: 获取验票失败列表
 */
 export function getFailureTickets(params: GetFailureTicketsParams) {
  return defHttp.post({
    url: Api.GetFailureTickets,
    params,
  });
}

/**
 * @description: 获取验票成功(包)列表
 */
 export function getSuccessPackages(params: GetSuccessPackagesParams) {
  return defHttp.post({
    url: Api.GetSuccessPackages,
    params,
  });
}

/**
 * @description: 获取验票成功包中所含票号信息
 */
 export function getSuccessTickets(params: GetSuccessTicketsParams) {
  return defHttp.post({
    url: Api.GetSuccessTickets,
    params,
  });
}

/**
 * @description: 停止/继续/完成验票
 */
 export function updateCheckTickets(params: UpdateCheckTicketsParams) {
  return defHttp.post({
    url: Api.UpdateCheckTickets,
    params,
  });
}

/**
 * @description: 获取维修工单详情
 */
 export function getWorkOrderDetailByRepair(params: GetWorkOrderDetailByRepairParams) {
  return defHttp.post({
    url: Api.GetWorkOrderDetailByRepair,
    params,
  });
}

/**
 * @description: 新增维修工单
 */
 export function addWorkOrderByRepair(params: AddWorkOrderByRepairParams) {
  return defHttp.post({
    url: Api.AddWorkOrderByRepair,
    params,
  });
}

/**
 * @description: 修改维修工单
 */
 export function updateWorkOrderByRepair(params: UpdateWorkOrderByRepairParams) {
  return defHttp.post({
    url: Api.UpdateWorkOrderByRepair,
    params,
  });
}

/**
 * @description: 新增机器返库工单
 */
 export function addWorkOrderByMachineReturn(params: AddWorkOrderByMachineReturnParams) {
  return defHttp.post({
    url: Api.AddWorkOrderByMachineReturn,
    params,
  });
}

/**
 * @description: 修改机器返库工单
 */
 export function updateWorkOrderByMachineReturn(params: UpdateWorkOrderByMachineReturnParams) {
  return defHttp.post({
    url: Api.UpdateWorkOrderByMachineReturn,
    params,
  });
}

/**
 * @description: 获取机器返库工单详情
 */
 export function getWorkOrderDetailByMachineReturn(params: GetWorkOrderDetailByMachineReturnParams) {
  return defHttp.post({
    url: Api.GetWorkOrderDetailByMachineReturn,
    params,
  });
}

/**
 * @description: 新增机器出库工单
 */
 export function addWorkOrderByMachineOut(params: AddWorkOrderByMachineOutParams) {
  return defHttp.post({
    url: Api.AddWorkOrderByMachineOut,
    params,
  });
}

/**
 * @description: 获取机器出库工单详情
 */
 export function getWorkOrderDetailByMachineOut(params: GetWorkOrderDetailByMachineOutParams) {
  return defHttp.post({
    url: Api.GetWorkOrderDetailByMachineOut,
    params,
  });
}

/**
 * @description: 修改机器出库工单
 */
 export function updateWorkOrderByMachineOut(params: UpdateWorkOrderByMachineOutParams) {
  return defHttp.post({
    url: Api.UpdateWorkOrderByMachineOut,
    params,
  });
}

/**
 * @description: 新增退款工单
 */
 export function addRefund(params: AddRefundParams) {
  return defHttp.post({
    url: Api.AddRefund,
    params,
  });
}
