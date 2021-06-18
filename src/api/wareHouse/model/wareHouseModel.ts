export interface GetWareHouseListParams {
  WareHouseId?: string;
  KeyWords?: string;
  BusinessType?: number;
  LevelType?: number;
  PId?: number;
  ProvinceId?: number;
  CityId?: number;
  PageIndex?: number;
  PageSize?: number;
}

export interface DeleteWareHouseParams {
  warehouseId: string;
}

export interface CreateWareHouseParams {
  WareHouseName: string;
  BusinessType: number;
  PId: number;
  ProvinceId: number;
  CityId: number;
}

export interface UpdateWarehouseParams {
  WareHouseId: string;
  WareHouseName?: string;
}

export interface QueryLotteryStockParams {
  WareHouseId: string;
  LotteryType?: number;
  LotteryId?: number;
  StockQuantityOrderByType?: number;
  ThresholdOrderByType?: number;
  PageIndex?: number;
  PageSize?: number;
}

export interface UpdateStockThresholdParams {
  StockId: string;
  Threshold: number;
}

export interface QueryStockDetailParams {
  StockId: string;
  StockDetailName?: string;
  StockDetailStatus: number;
  OrderByType?: number;
  PageIndex?: number;
  PageSize?: number;
}

export interface QueryChildWareHouseStockParams {
  WareHouseId: string;
  LotteryId: number;
  OrderByType?: number;
  PageIndex?: number;
  PageSize?: number;
}

export interface QueryStockInOrderParams {
  StockInOrderId?: string;
  WareHouseId: string;
  StockInOrderType?: number;
  OrderByType?: number;
  PageIndex?: number;
  PageSize?: number;
}

export interface DeleteStockInOrderParams {
  stockInOrderId: string;
}

export interface QueryStockInOrderItemParams {
  StockInOrderId: string;
  LotteryId?: number;
  PackageNo?: string;
  OrderByType?: number;
  PageIndex?: number;
  PageSize?: number;
}

export interface CreateStockInOrderParams {
  WareHouseId: string;
}

export interface AddStockInOrderItemParams {
  StockInOrderId: string;
  PackageNo: string;
}

export interface SubmitStockInOrderParams {
  StockInOrderId: string;
}

export interface EditStockInOrderItemParams {
  TicketQuantity: number;
  StockInOrderId: string;
  PackageNo: string;
}

export interface DeleteStockInOrderItemParams {
  stockInOrderItemId: string;
}

export interface QueryLotteryPurchasesParams {
  PurchasePackageId?: string;
  PId?: number;
  ProvinceId?: number;
  CityId?: number;
  LotteryType?: number;
  LotteryId?: number;
  EntryStatus?: number;
  OrderCondition?: number;
  OrderByType?: number;
  IsOwn?: boolean;
  PageIndex?: number;
  PageSize?: number;
}
