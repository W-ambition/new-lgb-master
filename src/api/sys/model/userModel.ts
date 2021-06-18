import type { UserInfo, MerchantInfo, PartnerInfo } from '/#/store';
/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  UserName: string;
  UserPwd: string;
  Code?: string;
}

/**
 * @description: Get user information
 */
export interface GetUserInfoByUserIdParams {
  UserId: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  UserId: string;
  UserType: number;
  UserName: string;
  IsDefaultPwd: number;
  Token: string;
  RoleType: number;
  Plevel: number;
}

/**
 * @description: Get user information return value
 */

interface RoleInfo {
  PID: number;
  RoleType: number;
  SysRoleId: number;
  SysRoleName: string;
}
export interface GetUserInfoByUserIdModel {
  MerchantInfo: Nullable<MerchantInfo>;
  UserInfo: UserInfo;
  PartnerInfo: Nullable<PartnerInfo>;
  UserRoleInfo: RoleInfo[];
}

export interface PermCodeItem {
  SysPermissionId: number;
  SysPermissionName: string;
  SysPermissionCode: string;
  SysPermissionType: number;
}

export interface GetPermCodeByUserIdModel {
  PermissionType: number;
  PermissionList: PermCodeItem[]
}
