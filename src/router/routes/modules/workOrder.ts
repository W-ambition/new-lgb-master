import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';

const workOrder: AppRouteModule = {
  path: '/work',
  name: 'WorkOrder',
  component: LAYOUT,
  redirect: '/work/addTicket',
  meta: {
    icon: 'icon-gongdanguanli',
    title: '工单管理'
  },
  children: [
    {
      path: 'addTicket',
      name: 'AddTicket',
      component: () => import('/@/views/workOrder/addticket/index.vue'),
      meta: {
        title: '加票工单'
      },
    },
    {
      path: 'otherTicket',
      name: 'OtherTicket',
      component: () => import('/@/views/workOrder/otherWorkOrder/index.vue'),
      meta: {
        title: '其他工单'
      },
    },
    {
      path: 'detail',
      name: 'WorkOrderDetail',
      component: () => import('/@/views/workOrder/workOrderDetail/index.vue'),
      meta: {
        title: '工单详情'
      },
    },
    {
      path: 'log',
      name: 'WorkOrderLog',
      component: () => import('/@/views/workOrder/workOrderLog/index.vue'),
      meta: {
        title: '工单日志'
      }
    },
    {
      path: 'create',
      name: 'CreateWorkOrder',
      component: () => import('/@/views/workOrder/createWorkOrder/index.vue'),
      meta: {
        title: '创建工单'
      }
    }
  ]
}

export default workOrder;
