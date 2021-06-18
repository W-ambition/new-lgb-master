import type { MenuModule } from '/@/router/types';

const inventory: MenuModule = {
  orderNo: 1000000,
  menu: {
    path: '/inventory',
    name: '库存管理',
    children: [
      {
        path: '/inventory/logistics',
        name: '物流仓库'
      },
      {
        path: '/inventory/selfBuild',
        name: '自建仓库'
      },
      {
        path: '/inventory/buyTicket',
        name: '购票'
      },
    ]
  },
};
export default inventory;
