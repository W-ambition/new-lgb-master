import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';

const system: AppRouteModule = {
  path: '/system',
  name: 'System',
  component: LAYOUT,
  redirect: '/system/lotteryInfo',
  meta: {
    icon: 'icon-xitongguanli',
    title: '系统管理'
  },
  children: [
    {
      path: 'lotteryInfo',
      name: 'LotteryInfo',
      component: () => import('/@/views/system/lotteryInfo/index.vue'),
      meta: {
        title: '票种信息'
      }
    },
    {
      path: 'lotteryRule',
      name: 'LotteryRule',
      component: () => import('/@/views/system/lotteryRule/index.vue'),
      meta: {
        title: '票种编码'
      },
    },
    {
      path: 'lotteryBatch',
      name: 'LotteryBatch',
      component: () => import('/@/views/system/lotteryBatch/index.vue'),
      meta: {
        title: '票种批号'
      },
    },
  ]
}

export default system;
