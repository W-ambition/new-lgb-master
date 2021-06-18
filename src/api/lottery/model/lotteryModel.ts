export interface GetLotteryInfoListParams {
  LotteryType?: number;
  LotteryName?: string;
  PageIndex: number;
  PageSize: number;
}

export interface LotteryItem {
  LotteryId: number;
  LotteryName: string;
  LotteryPrice: number;
  MaxBonus: number;
  Size: string;
  Width?: string | number;
  Height?: string | number;
  PackageQuantity: number;
  LotteryType: number | string;
  Introduction: string;
  UpdateTime: string;
  FrontPic: string;
  BackPic: string;
  ProvinceName?: string;
}

export interface GetLotteryInfoListModel {
  TotalCount: number;
  Records: LotteryItem[];
}


export interface GetLotteryListParams {
  LotteryType?: number;
  LotteryName?: string;
}

export interface GetLotteryListModel {
  LotteryType: number;
  LotteryId: number;
  LotteryName: string;
  LotteryPrice: number;
}

export interface AddLotteryParams {
  LotteryType: number | string;
  LotteryName: string;
  LotteryPrice: number | string;
  MaxBonus: number | string;
  Width: number | string;
  Height: number | string;
  FrontPic: string;
  BackPic: string;
  Introduction: string;
  BonusLevels: string;
}


export interface DeleteLotteryParams {
  LotteryId: number | string;
}

export interface EditLotteryParams extends AddLotteryParams {
  LotteryId: number | string;
}

export interface GetLotteryDetailsParams {
  LotteryId: number | string;
}

export interface DeleteLotteryPackageRuleParams {
  LotteryPackageRuleId: number | string;
  Remark?: string;
}


export interface AddLotteryPackageRuleParams {
  RuleName: string;
  LotteryId: number | string;
  CodeLength: number;
  StartWith: string;
  PackageSta: number;
  PackageEnd: number;
  TicketSta: number;
  TicketEnd: number;
  BatchSta: number;
  BatchEnd: number;
  PackageQuantity: number;
  Example: string;
  Enable?: number;
  Remark?: string;
}

export interface EditLotteryPackageRuleParams extends AddLotteryPackageRuleParams {
  LotteryPackageRuleId: number;
}

export interface GetLotteryBatchParams {
  LotteryType?: number | string;
  LotteryId?: number | string;
  BatchNo?: string;
  PageIndex: number;
  PageSize: number;
}

export interface AddLotteryBatchParams {
  BatchNo: string;
  LotteryId: number | string;
  LotteryPackageRuleId: number | string;
}

export interface DeleteLotteryBatchParams {
  LotteryBatchId: number | string;
}


export interface LotteryBatchItem {
  LotteryBatchId: number;
  LotteryType: number | string;
  LotteryId: number;
  LotteryName: string;
  LotteryPrice: number;
  LotteryPackageRuleId: number;
  RuleName: string;
  PackageQuantity: number;
  CodeLength: number;
  BatchNo: string;
  CreateTime: string;
}

export interface GetLotteryBatchListModel {
  TotalCount: number;
  Records: LotteryBatchItem[];
}


export interface EditLotteryBatchParams {
  LotteryBatchId: number;
  BatchNo: string;
  LotteryId: number;
  LotteryPackageRuleId: number;
}


export interface GetLotteryDetailByWareHouseIdParams {
  LotteryId: number;
  WareHouseId: string;
}

export interface CheckLotteryInWoreHouseParams {
  WareHouseId: string;
  LotteryId: string;
  StockDetailName: string;
  WorkOrderId: string;
}
