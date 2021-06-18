import { FormSchema } from '/@/components/Table';
import { getWareHouseList } from '/@/api/wareHouse/wareHouse';
import { getMerchantList } from '/@/api/merchant/merchant';

export const schemas: FormSchema[] = [
  {
    field: 'MachineId',
    component: 'ApiSelect',
    label: '终端编号',
    colProps: {
      span: 24
    },
    required: true
  },
  {
    field: 'Destination',
    component: 'Input',
    label: '机器地址',
    colProps: {
      xl: 12,
      sm: 24
    },
    componentProps: {
      disabled: true,
    },
    required: true
  },
  {
    field: 'WareHouseName',
    component: 'Input',
    label: '仓库',
    colProps: {
      xl: 12,
      sm: 24
    },
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'Executor',
    component: 'ApiSelect',
    label: '实施者',
    colProps: {
      xl: 12,
      sm: 24
    },
    slot: 'Executor',
    required: true
  },
  {
    field: 'ExecutorPhone',
    component: 'Input',
    label: '联系电话',
    colProps: {
      xl: 12,
      sm: 24
    },
    required: true
  },
  {
    field: 'CurrentStatus',
    component: 'Input',
    label: '工单状态',
    colProps: {
      xl: 12,
      sm: 24
    },
    ifShow: false,
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'SubStatus',
    component: 'Input',
    label: '物流状态',
    colProps: {
      xl: 12,
      sm: 24
    },
    ifShow: false,
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'CheckTicketStatus',
    component: 'Input',
    label: '验票状态',
    colProps: {
      xl: 12,
      sm: 24
    },
    ifShow: false,
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'MachineHeaderInfo',
    component: 'Input',
    label: '票仓信息',
    colProps: {
      span: 24
    },
    colSlot: 'header',
  },
  {
    field: 'ErrorTicket',
    component: 'Input',
    label: '验票失败',
    colProps: {
      span: 24
    },
    colSlot: 'errorTicket',
  },
  {
    field: 'IsTakeBackUnCheckedTicket',
    component: 'Checkbox',
    label: ' ',
    colProps: {
      span: 24
    },
    defaultValue: false,
    ifShow: false,
    renderComponentContent: '本次回收验票失败票'
  },
  {
    field: 'RemarkList',
    component: 'Input',
    label: '备注列表',
    colProps: {
      span: 24
    },
    colSlot: 'remarkList',
  },
  {
    field: 'Remark',
    component: 'InputTextArea',
    label: '备注',
    colProps: {
      span: 24
    },
  },
];

export const repairSchemas: FormSchema[] = [
  {
    field: 'MachineId',
    component: 'ApiSelect',
    label: '终端编号',
    colProps: {
      span: 24
    },
    required: true
  },
  {
    field: 'Destination',
    component: 'Input',
    label: '机器地址',
    colProps: {
      span: 24
    },
    componentProps: {
      disabled: true,
    },
    required: true
  },
  {
    field: 'Executor',
    component: 'ApiSelect',
    label: '实施者',
    colProps: {
      xl: 12,
      sm: 24
    },
    slot: 'Executor',
    required: true
  },
  {
    field: 'ExecutorPhone',
    component: 'Input',
    label: '联系电话',
    colProps: {
      xl: 12,
      sm: 24
    },
    required: true
  },
  {
    field: 'RemarkList',
    component: 'Input',
    label: '备注列表',
    colProps: {
      span: 24
    },
    colSlot: 'remarkList',
  },
  {
    field: 'Remark',
    component: 'InputTextArea',
    label: '备注',
    colProps: {
      span: 24
    },
  },
  {
    field: 'CurrentStatus',
    component: 'Select',
    label: '工单状态',
    colProps: {
      span: 24
    },
    rules: [{ type: 'number', required: true }],
    componentProps: () => {
      return {
        options: [
          { label: '已创建', value: 1 },
          { label: '执行中', value: 4 },
          { label: '已完成', value: 5 }
        ]
      }
    },
    required: true
  },
];

export const machineReturnSchemas: FormSchema[] = [
  {
    field: 'MachineId',
    component: 'ApiSelect',
    label: '终端编号',
    colProps: {
      span: 24
    },
    required: true
  },
  {
    field: 'Destination',
    component: 'Input',
    label: '机器地址',
    colProps: {
      span: 24
    },
    componentProps: {
      disabled: true,
    },
    required: true
  },
  {
    field: 'MerchantName',
    component: 'Input',
    label: '商户',
    colProps: {
      span: 24
    },
    componentProps: {
      disabled: true,
    }
  },
  {
    field: 'Executor',
    component: 'ApiSelect',
    label: '实施者',
    colProps: {
      xl: 12,
      sm: 24
    },
    slot: 'Executor',
    required: true
  },
  {
    field: 'ExecutorPhone',
    component: 'Input',
    label: '联系电话',
    colProps: {
      xl: 12,
      sm: 24
    },
    required: true
  },
  {
    field: 'WareHouseId',
    component: 'ApiSelect',
    label: '仓库',
    colProps: {
      span: 24
    },
    componentProps: () => {
      return {
        placeholder: '请选择仓库',
        params: {PageSize: 10000, PageIndex: 1, BusinessType: 1},
        api: getWareHouseList,
        allowClear: true,
        labelField: 'WareHouseName',
        valueField: 'WareHouseId',
        resultField: 'Records',
        disabled: false,
        showSearch: true,
        filterOption: (input: string, option: any) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        getPopupContainer: triggerNode => triggerNode.parentNode,
      }
    },
    required: true
  },
  {
    field: 'RemarkList',
    component: 'Input',
    label: '备注列表',
    colProps: {
      span: 24
    },
    colSlot: 'remarkList',
  },
  {
    field: 'Remark',
    component: 'InputTextArea',
    label: '备注',
    colProps: {
      span: 24
    },
  },
  {
    field: 'CurrentStatus',
    component: 'Select',
    label: '工单状态',
    colProps: {
      span: 24
    },
    rules: [{ type: 'number', required: true }],
    componentProps: () => {
      return {
        options: [
          { label: '已创建', value: 1 },
          { label: '执行中', value: 4 },
          { label: '已完成', value: 5 }
        ]
      }
    },
    required: true
  },
]

export const machineOutSchemas: FormSchema[] = [
  {
    field: 'MachineId',
    component: 'Input',
    label: '终端编号',
    colProps: {
      span: 24
    },
    required: true
  },
  {
    field: 'Executor',
    component: 'ApiSelect',
    label: '实施者',
    colProps: {
      xl: 12,
      sm: 24
    },
    slot: 'Executor',
    required: true
  },
  {
    field: 'ExecutorPhone',
    component: 'Input',
    label: '联系电话',
    colProps: {
      xl: 12,
      sm: 24
    },
    required: true
  },
  {
    field: 'WareHouseId',
    component: 'ApiSelect',
    label: '仓库',
    colProps: {
      span: 24
    },
    componentProps: () => {
      return {
        placeholder: '请选择仓库',
        params: {PageSize: 10000, PageIndex: 1, BusinessType: 1},
        api: getWareHouseList,
        allowClear: true,
        labelField: 'WareHouseName',
        valueField: 'WareHouseId',
        resultField: 'Records',
        disabled: false,
        showSearch: true,
        filterOption: (input: string, option: any) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        getPopupContainer: triggerNode => triggerNode.parentNode,
      }
    },
    required: true
  },

  {
    field: 'MerchantName',
    component: 'ApiSelect',
    label: '商户',
    colProps: {
      span: 24
    },
    required: true,
    componentProps: {
      placeholder: '请选择商户',
      api: getMerchantList,
      allowClear: true,
      labelField: 'MerchantName',
      valueField: 'MerchantId',
      disabled: false,
      showSearch: true,
      filterOption: (input: string, option: any) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
      getPopupContainer: triggerNode => triggerNode.parentNode,
    }
  },

  {
    field: 'Destination',
    component: 'Input',
    label: '机器地址',
    colProps: {
      span: 24
    },
    slot: 'address',
    required: true
  },
  {
    field: 'Longitude',
    component: 'Input',
    label: '经度',
    colProps: {
      span: 6
    },
    componentProps: {
      disabled: true
    }
  },
  {
    field: 'Latitude',
    component: 'Input',
    label: '纬度',
    colProps: {
      span: 6
    },
    componentProps: {
      disabled: true
    }
  },
  {
    field: 'Map',
    component: 'Input',
    label: '地图',
    colProps: {
      span: 24
    },
    colSlot: 'map',
  },

  {
    field: 'RemarkList',
    component: 'Input',
    label: '备注列表',
    colProps: {
      span: 24
    },
    colSlot: 'remarkList',
  },
  {
    field: 'Remark',
    component: 'InputTextArea',
    label: '备注',
    colProps: {
      span: 24
    },
  },
  {
    field: 'CurrentStatus',
    component: 'Select',
    label: '工单状态',
    colProps: {
      span: 24
    },
    rules: [{ type: 'number', required: true }],
    componentProps: () => {
      return {
        options: [
          { label: '已创建', value: 1 },
          { label: '执行中', value: 4 },
          { label: '已完成', value: 5 }
        ]
      }
    },
    required: true
  },
]

export const refundSchemas: FormSchema[] = [
  {
    field: 'Executor',
    component: 'ApiSelect',
    label: '实施者',
    colProps: {
      xl: 12,
      sm: 24
    },
    slot: 'Executor',
    required: true
  },
  {
    field: 'ExecutorPhone',
    component: 'Input',
    label: '联系电话',
    colProps: {
      xl: 12,
      sm: 24
    },
    required: true
  },
  {
    field: 'OrderId',
    component: 'Input',
    label: '订单号',
    colProps: {
      span: 24
    },
    slot: 'orderId',
    required: true
  },
  {
    field: 'AreaName',
    component: 'Input',
    label: '地区',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: true
    },
    ifShow: false,
  },
  {
    field: 'PartnerName',
    component: 'Input',
    label: '渠道',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: true
    },
    ifShow: false,
  },
  {
    field: 'MerchantName',
    component: 'Input',
    label: '商户',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: true
    },
    ifShow: false,
  },
  {
    field: 'MachineId',
    component: 'Input',
    label: '终端编号',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: true
    },
    ifShow: false,
  },
  {
    field: 'TotalAmout',
    component: 'Input',
    label: '购买金额',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: true
    },
    ifShow: false,
  },
  {
    field: 'PrintedAmount',
    component: 'Input',
    label: '出票金额',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: true
    },
    ifShow: false,
  },
  {
    field: 'PayPlatformName',
    component: 'Input',
    label: '支付平台',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: true
    },
    ifShow: false,
  },
  {
    field: 'PaySourceName',
    component: 'Input',
    label: '支付方式',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: true
    },
    ifShow: false,
  },
  {
    field: 'InsertedTime',
    component: 'Input',
    label: '下单时间',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: true
    },
    ifShow: false,
  },
  {
    field: 'OrderStastus',
    component: 'Select',
    label: '订单状态',
    colProps: {
      span: 12
    },
    componentProps: () => {
      return {
        disabled: true,
        options: [
          { label: '已创建', value: 1 },
          { label: '交易成功', value: 2 },
          { label: '已交易关闭完成', value: 3 }
        ]
      }
    },
    ifShow: false,
  },
  {
    field: 'OrderItemsDTO',
    component: 'Input',
    label: '购买信息',
    colProps: {
      span: 24
    },
    slot: 'OrderItemsDTO',
    ifShow: false,
  },
  {
    field: 'Remark',
    component: 'InputTextArea',
    label: '备注',
    colProps: {
      span: 24
    },
  },
]
