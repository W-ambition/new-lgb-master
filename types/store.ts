import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}

export interface UserInfo {
  UserName: string;
  ActualName: string;
  Email: string;
  Phone: string;
  Sex: number;
  IdCard: string;
  JobStatus: number;
  PId: number;
  MerchantId: string;
}

export interface LoginInfo {
  UserId: string;
  UserType: number;
  UserName: string;
  IsDefaultPwd: number;
  RoleType: number;
  Plevel: number;
  Token: string;
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}

interface Info {
  PartnerName: string;
  IdCard: string;
  ProvinceId: number;
  ProvinceName: string;
  CityId: number;
  CityName: string;
  AreaId: number;
  AreaName: string;
  Address: string;
  Email: string;
  Phone: string;
  Zip?: string;
  Longitude?: string;
  Latitude?: string;
  ContractNo: string;
  CommissionType: number;
  CommissionAvailable: number;
  CommissionLock: number;
  ContractBeginTime: string;
  ContractEndTime: string;
}

export interface MerchantInfo extends Info {
  MerchantName: string;
  PId: number;
  ShopPic: string;
  OperationType: number;
  MonthRent: number;
  Deposit: number;
  SettlementCycle: number;
  StartSettlementTime: string;
  SettlementDay: number;
  BankCode: string;
  BankProvinceId: string;
  BankCityId: string;
  BankLocaltion: string;
  BankNameDetail: string;
  UnionBankCode: string;
  CardNum: string;
  ContractPic: string;
  TotalCommission: number;
}

export interface PartnerInfo extends Info {
  ParentNodeId: number;
  ParentNodeName: string;
  PartnerType: number;
  CompanyName: string;
  BusinessLic: string;
  BusinessLicPic: string;
  IdCardPic1: string;
  IdCardPic2: string;
  Contact: string;
  ContractLotteryType: number;
  ContractUrl: string;
  CommissionRate: number;
  CommissionStep: string;
  CommissionStepStartTime: string;
  CommissionStepEndTime: string;
  ActualName: string;
  TotalSaleTicketsAmount: number;
  TotalCommission: number;
}
