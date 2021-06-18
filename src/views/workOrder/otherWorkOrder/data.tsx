import { BasicColumn } from '/@/components/Table/index';
import { FormSchema } from '/@/components/Table';

export function getColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'WorkOrderId',
      title: '工单编号',
      width: 250
    },
    {
      dataIndex: 'MachineId',
      title: '机器编号',
    },
    {
      dataIndex: 'Address',
      title: '机器地址',
    },
    {
      title: '工单类型',
      dataIndex: 'WorkOrderType',
      customRender: ({ text }) => {
        switch(text) {
          case 7:
            return '维修工单';
          case 4:
            return '机器出库';
          case 11:
            return '机器返库';
          default:
            return '-';
        }
      },
    },
    {
      dataIndex: 'ApplicantName',
      title: '创建者',
    },
    {
      dataIndex: 'CreateTime',
      title: '创建时间',
      width: 230,
      sorter: true,
      customRender: ({ text }) => text ? text.replace("T", " ") : "",
    },
    {
      dataIndex: 'ExecutorName',
      title: '实施者',
    },
    {
      dataIndex: 'FinishTime',
      title: '完成时间',
      width: 230,
      customRender: ({ text }) => text ? text.replace("T", " ") : "",
    },
    {
      title: '工单状态',
      dataIndex: 'CurrentStatus',
      customRender: ({ text }) => {
        switch(text) {
          case 1:
            return '已创建';
          case 4:
            return '执行中';
          case 5:
            return '已完成';
          default:
            return '-';
        }
      }
    },
  ];
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'PId',
    label: '渠道',
    component: 'TreeSelect',
    colProps: { xs: 24, sm: 24, xl: 12, xxl: 8 },
  },
  {
    field: 'MachineId',
    label: '终端编号',
    component: 'Input',
    colProps: { xs: 24, sm: 24, xl: 12, xxl: 8 },
  },
  {
    field: 'WorkOrderId',
    label: '工单编号',
    component: 'Input',
    colProps: { xs: 24, sm: 24, xl: 12, xxl: 8 },
  },
  {
    field: 'WorkOrderType',
    label: '工单类型',
    component: 'Select',
    colProps: { xs: 24, sm: 24, xl: 12, xxl: 8 },
    componentProps: () => {
      return {
        options: [
          { label: '维修工单', value: 7 },
          { label: '机器出库', value: 4 },
          { label: '机器返库', value: 11 },
        ]
      }
    },
  },
  {
    field: 'CurrentStatus',
    label: '工单状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '已创建', value: 1 },
        { label: '执行中', value: 4 },
        { label: '已完成', value: 5 },
      ],
    },
    colProps: { xs: 24, sm: 24, xl: 12, xxl: 8 },
  },
  {
    field: 'TreeQueryType',
    label: '查询类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部数据', value: 0 },
        { label: '选中节点数据', value: 1 },
        { label: '排除选中节点数据', value: 2 },
      ],
    },
    colProps: { xs: 24, sm: 24, xl: 12, xxl: 8 },
  },
  {
    field: 'CreateTime',
    label: '创建时间',
    component: 'RangePicker',
    componentProps: {
      showTime: { format: 'HH:mm:ss' },
    },
    colProps: { xs: 24, sm: 24, lg: 12, xxl: 8 },
  },
  {
    field: 'FinishTime',
    label: '完成时间',
    component: 'RangePicker',
    componentProps: {
      showTime: { format: 'HH:mm:ss' },
    },
    colProps: { xs: 24, sm: 24, xl: 12, xxl: 8 },
  },
];
