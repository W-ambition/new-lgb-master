export interface GetMachineShortInfoParams {
  ProvinceId?: number;
  CityId?: number;
  AreaId?: number;
  PId?: number;
  TreeQueryType?: number;
  MerchantId?: string;
  MachineId?: string;
  MachineType?: number;
  AppVersion?: string;
  MachineSerialId?: number;
  ErrorStatus?: number;
  LocationType?: number;
  PageSize?: number;
  CurrentPage?: number;
}

export interface GetMachineShortInfoModel {
  MachineId: string;
  MachineCode: string;
  MachineName: string;
  PartnerName: string;
  MerchantName: string;
  ProvinceId: number;
  ProvinceName: string;
  CityId: number;
  CityName: string;
  AreaId: number;
  AreaName: string;
  Address: string;
  TicketWareHouseId: string;
  TicketWareHouseName: string;
}


export interface GetMachineDetailParams {
  MachineId: string;
}

export interface MachineHeader {
  MachineHeadId: string;
  MachineHeadName: string;
  LotteryId: number;
  LotteryType: number;
  LotteryName: string;
  LotteryPrice: number;
  PackageQuantity: number;
  Size: string;
  AlertQuantity: number;
  MaxQuantity: number;
  MaxPrice: number;
  TicketQuantity: number;
  LockQuantity: number;
  LimitQuantity: number;
  IsFull: number;
  LockStatus: number;
  ActiveStatus: number;
  HealthCode: string;
  ErrorMsg: string;
  ErrorTime: string;
  IsCheck: number;
}

export interface GetMachineDetailModal {
  MachineId: string;
  MachineCode: string;
  MachineName: string;
  MachineType: number;
  MachineSerialCode: string;
  WareHouseId: string;
  WareHouseName: string;
  Price: number;
  ScreenSize: string;
  Supplier: string;
  Warranty: number;
  HavaSoftWare: number;
  SaleType: number;
  MaxQuantity: number;
  LotteryType: number;
  NetSetting: number;
  Address: string;
  ProvinceId: number;
  ProvinceName: string;
  CityId: number;
  CityName: string;
  AreaId: number;
  AreaName: string;
  MerchantId: string;
  MerchantName: string;
  PId: number;
  PartnerName: string;
  MachineUseType: number;
  HeadCount: number;
  MachineLabel: string;
  Contact: string;
  ServicePhone: string;
  MachineStatus: number;
  BootUpStatus: number;
  NetLevel: number;
  NetErrorMsg: string;
  NetErrorTime: string;
  NetStatus: number;
  DoorStatus: number;
  DoorError: string;
  DoorErrorTime: string;
  ScreenStatus: number;
  ScreenError: string;
  ScreenErrorTime: string;
  Volumet: number;
  BootUpTime: string;
  ShutDownTime: string;
  SIMId: string;
  PhoneNum: string;
  IP: string;
  SIMCode: string;
  Longitude: string;
  Latitude: string;
  AppVersion: string;
  Token: string;
  Remark: string;
  IsStrictCash: number;
  TestPassStatus: number;
  ErrorCode: string;
  ErrorMsg: string;
  CommissionRate: number;
  IsLogRecord: number;
  IsCheckPicRecord: number;
  LogisticsCode: string;
  CoreCode: string;
  UncheckedBoxMaxQty: number;
  UncheckedBoxAlertQty: number;
  UncheckedBoxQty: number;
  TicketWareHouseId: string;
  TicketWareHouseName: string;
  BusinessType: number;
  IsAutoCheckTicket: number;
  getMachineDetailMachineHeads: MachineHeader[];
}
