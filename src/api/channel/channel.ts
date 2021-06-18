import { defHttp } from '/@/utils/http/axios';
import {
  GetPartnerDicParams,
  GetPartnerDicModel
} from './model/channelModel';


enum Api {
  GetPartnerDic = '/partner/getdic',
}

/**
 * @description: 获取分级渠道dic
 */
 export function getPartnerDic(params?: GetPartnerDicParams) {
  return defHttp.post<GetPartnerDicModel[]>({
    url: Api.GetPartnerDic,
    params,
  });
}
