import type { MenuModule } from '/@/router/types';

const workOrder: MenuModule = {
  orderNo: 1000000,
  menu: {
    path: '/work',
    name: '工单管理',
    children: [
      {
        path: '/work/addTicket',
        name: '加票工单'
      },
      {
        path: '/work/otherTicket',
        name: '其他工单'
      },
      {
        path: '/work/create',
        name: '创建工单'
      },
    ]
  },
};
export default workOrder;
