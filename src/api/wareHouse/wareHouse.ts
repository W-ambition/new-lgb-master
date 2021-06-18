import { defHttp } from '/@/utils/http/axios';
import {
  GetWareHouseListParams,
  DeleteWareHouseParams,
  CreateWareHouseParams,
  UpdateWarehouseParams,
  QueryLotteryStockParams,
  UpdateStockThresholdParams,
  QueryStockDetailParams,
  QueryChildWareHouseStockParams,
  QueryStockInOrderParams,
  DeleteStockInOrderParams,
  QueryStockInOrderItemParams,
  CreateStockInOrderParams,
  AddStockInOrderItemParams,
  SubmitStockInOrderParams,
  EditStockInOrderItemParams,
  DeleteStockInOrderItemParams,
  QueryLotteryPurchasesParams
} from './model/wareHouseModel';

enum Api {
  GetWareHouseList = '/warehouse/querywarehouse',
  DeleteWareHouse = '/warehouse/delete',
  CreateWareHouse = '/warehouse/add',
  UpdateWarehouse = '/warehouse/update',
  QueryLotteryStock = '/warehouse/querylotterystock',
  UpdateStockThreshold = '/warehouse/updatestockthreshold',
  QueryStockDetail = '/warehouse/querystockdetail',
  QueryChildWareHouseStock = '/warehouse/querychildwarehousestock',
  QueryStockInOrder = '/warehouse/querystockinorder',
  DeleteStockInOrder = '/warehouse/deletestockinorder',
  QueryStockInOrderItem = '/warehouse/querystockinorderitem',
  CreateStockInOrder = '/warehouse/createlotterystockinorder',
  AddStockInOrderItem = '/warehouse/addlotterystockinorderitem',
  EditStockInOrderItem = '/warehouse/editlotterystockinorderitem',
  SubmitStockInOrder = '/warehouse/submitlotterystockinorder',
  DeleteStockInOrderItem = '/warehouse/deletestockinorderitem',
  QueryLotteryPurchases = '/lotterypurchase/querylotterypurchases',
}

/**
 * @description: 获取仓库列表
 */
 export function getWareHouseList(params: GetWareHouseListParams) {
  return defHttp.post({
    url: Api.GetWareHouseList,
    params,
  });
}

/**
 * @description: 删除仓库
 */
 export function deleteWareHouse(params: DeleteWareHouseParams) {
  return defHttp.get({
    url: Api.DeleteWareHouse,
    params,
  });
}

/**
 * @description: 创建仓库
 */
 export function createWareHouse(params: CreateWareHouseParams) {
  return defHttp.post({
    url: Api.CreateWareHouse,
    params,
  });
}

/**
 * @description: 编辑仓库
 */
 export function updateWareHouse(params: UpdateWarehouseParams) {
  return defHttp.post({
    url: Api.UpdateWarehouse,
    params,
  });
}

/**
 * @description: 查询仓库库存
 */
 export function queryLotteryStock(params: QueryLotteryStockParams) {
  return defHttp.post({
    url: Api.QueryLotteryStock,
    params,
  });
}

/**
 * @description: 修改预警阈值
 */
 export function updateStockThreshold(params: UpdateStockThresholdParams) {
  return defHttp.post({
    url: Api.UpdateStockThreshold,
    params,
  });
}

/**
 * @description: 查询库存明细
 */
 export function queryStockDetail(params: QueryStockDetailParams) {
  return defHttp.post({
    url: Api.QueryStockDetail,
    params,
  });
}

/**
 * @description: 查询子仓库存
 */
 export function queryChildWareHouseStock(params: QueryChildWareHouseStockParams) {
  return defHttp.post({
    url: Api.QueryChildWareHouseStock,
    params,
  });
}

/**
 * @description: 入库记录
 */
 export function queryStockInOrder(params: QueryStockInOrderParams) {
  return defHttp.post({
    url: Api.QueryStockInOrder,
    params,
  });
}

/**
 * @description: 删除入库单
 */
 export function deleteStockInOrder(params: DeleteStockInOrderParams) {
  return defHttp.get({
    url: Api.DeleteStockInOrder,
    params,
  });
}

/**
 * @description: 查询已扫彩票包
 */
 export function queryStockInOrderItem(params: QueryStockInOrderItemParams) {
  return defHttp.post({
    url: Api.QueryStockInOrderItem,
    params,
  });
}

/**
 * @description: 创建入库订单
 */
 export function createStockInOrder(params: CreateStockInOrderParams) {
  return defHttp.post({
    url: Api.CreateStockInOrder,
    params,
  });
}

/**
 * @description: 彩票扫码入库
 */
 export function addStockInOrderItem(params: AddStockInOrderItemParams) {
  return defHttp.post({
    url: Api.AddStockInOrderItem,
    params,
  });
}

/**
 * @description: 编辑入库彩票包
 */
 export function editStockInOrderItem(params: EditStockInOrderItemParams) {
  return defHttp.post({
    url: Api.EditStockInOrderItem,
    params,
  });
}

/**
 * @description: 移除彩票包
 */
 export function deleteStockInOrderItem(params: DeleteStockInOrderItemParams) {
  return defHttp.get({
    url: Api.DeleteStockInOrderItem,
    params,
  });
}

/**
 * @description: 彩票入库提交
 */
 export function submitStockInOrder(params: SubmitStockInOrderParams) {
  return defHttp.post({
    url: Api.SubmitStockInOrder,
    params,
  });
}

/**
 * @description: 采购查询
 */
 export function queryLotteryPurchases(params: QueryLotteryPurchasesParams) {
  return defHttp.post({
    url: Api.QueryLotteryPurchases,
    params,
  });
}
