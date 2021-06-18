import { BasicColumn } from '/@/components/Table/index';
import { FormSchema } from '/@/components/Table';
import { getLotteryList } from '/@/api/lottery/lottery';

export function getColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'LotteryType',
      title: '彩票类型',
      customRender: ({ text }) => text === 1 ? '体彩' : text === 2 ? '福彩' : '-',
    },
    {
      dataIndex: 'ObjectName',
      title: '彩票名称',
    },
    {
      title: '面值',
      dataIndex: 'LotteryPrice',
    },
    {
      title: '余票总数量（张）',
      dataIndex: 'StockQuantity',
      slots: { customRender: 'stockquantity' },
      sorter: true,
    },
    {
      title: '总金额（元）',
      dataIndex: 'TotalAmount',
      customRender: ({ record }) => record.StockQuantity * record.LotteryPrice
    },
    {
      title: '预警阈值（张）',
      dataIndex: 'Threshold',
      sorter: true,
      edit: true,
      editComponent: 'InputNumber',
    },
  ];
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'LotteryType',
    label: '彩票类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '体彩', value: 1 },
        { label: '福彩', value: 2 },
      ]
    },
    colProps: { xs: 24, sm: 24, xl: 12, xxl: 8 },
  },
  {
    field: 'LotteryId',
    label: '彩票名称',
    component: 'ApiSelect',
    componentProps: {
      api: getLotteryList,
      labelField: 'LotteryName',
      valueField: 'LotteryId',
      showSearch: true,
      filterOption: (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    },
    colProps: { span: 8 },
  }
];

export const WareHouseInfoFormSchema: FormSchema[] = [
  {
    field: 'WareHouseName',
    label: '仓库名称',
    component: 'Input',
    required: true,
  },
];
