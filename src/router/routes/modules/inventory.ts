import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';

const inventory: AppRouteModule = {
  path: '/inventory',
  name: 'Inventory',
  component: LAYOUT,
  redirect: '/inventory/logistics',
  meta: {
    icon: 'icon-kucunguanli',
    title: '库存管理',
    roles: [RoleEnum.Inventory, RoleEnum.SUPER]
  },
  children: [
    {
      path: 'logistics',
      name: 'Logistics',
      component: () => import('/@/views/inventory/logistics/index.vue'),
      meta: {
        title: '物流仓库',
        roles: [RoleEnum.InventoryLogistics, RoleEnum.SUPER]
      }
    },
    {
      path: 'selfBuild',
      name: 'SelfBuild',
      component: () => import('/@/views/inventory/selfBuild/index.vue'),
      meta: {
        title: '自建仓库',
        roles: [RoleEnum.InventorySelfBuild, RoleEnum.SUPER]
      }
    },
    {
      path: 'lotteryListInWareHouse',
      name: 'LotteryListInWareHouse',
      component: () => import('/@/views/inventory/lotteryListInWareHouse/index.vue'),
      meta: {
        title: '彩票库存',
        currentActiveMenu: '/inventory/logistics'
      }
    },
    {
      path: 'lotteryDetailsInWareHouse',
      name: 'LotteryDetailsInWareHouse',
      component: () => import('/@/views/inventory/lotteryDetailsInWareHouse/index.vue'),
      meta: {
        title: '彩票库存明细',
        currentActiveMenu: '/inventory/logistics'
      }
    },
    {
      path: 'childWareHouse',
      name: 'ChildWareHouse',
      component: () => import('/@/views/inventory/childWareHouse/index.vue'),
      meta: {
        title: '子渠道彩票库存',
        currentActiveMenu: '/inventory/logistics'
      }
    },
    {
      path: 'entryRecord',
      name: 'WareHouseEntryRecord',
      component: () => import('/@/views/inventory/entryRecord/index.vue'),
      meta: {
        title: '入库记录',
        currentActiveMenu: '/inventory/logistics'
      }
    },
    {
      path: 'lotteryEnter',
      name: 'LotteryEnter',
      component: () => import('/@/views/inventory/lotteryEnter/index.vue'),
      meta: {
        title: '彩票入库',
        currentActiveMenu: '/inventory/logistics'
      }
    },
    {
      path: 'buyTicket',
      name: 'BuyTicket',
      component: () => import('/@/views/inventory/buyTicket/index.vue'),
      meta: {
        title: '购票'
      }
    },
  ]
}

export default inventory;
