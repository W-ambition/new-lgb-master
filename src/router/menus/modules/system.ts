import type { MenuModule } from '/@/router/types';

const system: MenuModule = {
  orderNo: 1000001,
  menu: {
    path: '/system',
    name: '系统管理',
    children: [
      {
        path: '/system/lotteryInfo',
        name: '票种信息'
      },
      {
        path: '/system/lotteryBatch',
        name: '票种批号'
      }
    ]
  },
};
export default system;
