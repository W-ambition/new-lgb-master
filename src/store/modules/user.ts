import type { UserInfo, LoginInfo, MerchantInfo, PartnerInfo } from '/#/store';
import type { ErrorMessageMode } from '/@/utils/http/axios/types';

import { defineStore } from 'pinia';
import { store } from '/@/store';

import { PageEnum } from '/@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY, LOGIN_KEY, MERCHANT_INFO_KEY, PARTNER_INFO_KEY } from '/@/enums/cacheEnum';

import { getAuthCache, setAuthCache } from '/@/utils/auth';
import {
  GetUserInfoByUserIdModel,
  GetUserInfoByUserIdParams,
  LoginParams,
} from '/@/api/sys/model/userModel';

import { getUserInfoById, loginApi, getPermCodeByUserId } from '/@/api/sys/user';

import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import router from '/@/router';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  loginInfo: Nullable<LoginInfo>;
  merchantInfo: Nullable<MerchantInfo>;
  partnerInfo: Nullable<PartnerInfo>;
  roleList: string[];
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    loginInfo: null,
    merchantInfo: null,
    partnerInfo: null,
    // roleList
    roleList: [],
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getLoginInfo(): LoginInfo {
      return this.loginInfo || getAuthCache<LoginInfo>(LOGIN_KEY);
    },
    getMerchantInfo(): MerchantInfo {
      return this.merchantInfo || getAuthCache<MerchantInfo>(MERCHANT_INFO_KEY);
    },
    getPartnerInfo(): PartnerInfo {
      return this.partnerInfo || getAuthCache<PartnerInfo>(PARTNER_INFO_KEY);
    },
    getRoleList(): string[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<string[]>(ROLES_KEY);
    },
  },
  actions: {
    setToken(info: string) {
      this.token = info;
      setAuthCache(TOKEN_KEY, info);
    },
    setLoginInfo(info: LoginInfo) {
      this.loginInfo = info;
      setAuthCache(LOGIN_KEY, info);
    },
    setRoleList(roleList: string[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo) {
      this.userInfo = info;
      setAuthCache(USER_INFO_KEY, info);
    },
    setMerchantInfo(info: Nullable<MerchantInfo>) {
      this.merchantInfo = info;
      setAuthCache(MERCHANT_INFO_KEY, info);
    },
    setPartnerInfo(info: Nullable<PartnerInfo>) {
      this.partnerInfo = info;
      setAuthCache(PARTNER_INFO_KEY, info);
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.loginInfo = null;
      this.merchantInfo = null;
      this.partnerInfo = null;
    },
    /**
     * @description: 登录
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      }
    ): Promise<GetUserInfoByUserIdModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        const { Token, UserId } = data;

        // 保存token和登录信息
        this.setToken(Token);
        this.setLoginInfo(data);
        // get user info
        const userInfo = await this.getUserInfoAction({ UserId });
        await this.getPermissionCode({ UserId });

        goHome && (await router.replace(PageEnum.BASE_HOME));
        return userInfo;
      } catch (error) {
        return null;
      }
    },
    async saveLoginInfo(params: {
      loginInfo?: any
    }) {
      try{
        const { loginInfo } = params;
        const data = loginInfo;
        const { Token, UserId } = data;

        // 保存token和登录信息
        this.setToken(Token);
        this.setLoginInfo(data);
        // get user info
        const userInfo = await this.getUserInfoAction({ UserId });
        await this.getPermissionCode({ UserId });
        await router.replace(PageEnum.BASE_HOME)
        return userInfo;
      } catch {
        return null
      }
    },
    async getUserInfoAction({ UserId } : GetUserInfoByUserIdParams) {
      const userInfo = await getUserInfoById({ UserId });
      const { MerchantInfo, PartnerInfo, UserInfo } = userInfo;
      this.setUserInfo(UserInfo);
      this.setMerchantInfo(MerchantInfo);
      this.setPartnerInfo(PartnerInfo);
      return userInfo;
    },
    async getPermissionCode(params: { UserId }) {
      try {
        const permissionList = await getPermCodeByUserId(params);
        const { PermissionType, PermissionList } = permissionList;
        let roleList: string[] = [];
        if(PermissionType === 0) {
          roleList.push('super');
        }else if(PermissionType === 1){
          PermissionList.map(item => {
            roleList.push(item.SysPermissionCode)
          })
        }
        this.setRoleList(roleList || []);
        return permissionList;
      } catch {}
    },
    /**
     * @description: logout
     */
    logout(goLogin = false) {
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    async confirmLoginOut(isConfirm: boolean=true) {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      if(isConfirm) {
        createConfirm({
          iconType: 'warning',
          title: t('sys.app.logoutTip'),
          content: t('sys.app.logoutMessage'),
          onOk: async () => {
            await this.logout(true);
          },
        });
      }else {
        await this.logout(true);
      }
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
