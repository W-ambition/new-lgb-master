import { BasicColumn } from '/@/components/Table/index';
import { FormSchema } from '/@/components/Table';
import { getLotteryList } from '/@/api/lottery/lottery';

export function getColumns(type?: number): BasicColumn[] {
  const defaultColumns: BasicColumn[] = [
    {
      dataIndex: 'LotteryPurchaseId',
      title: '编号',
    },
    {
      dataIndex: 'ProvinceName',
      title: '销售地区',
      customRender: ({ record }) => `${record.ProvinceName} - ${record.CityName}`,
    },
    {
      title: '彩票类型',
      dataIndex: 'LotteryType',
      customRender: ({ text }) => text === 1 ? '体彩' : text === 2 ? '福彩' : '-',
    },
    {
      title: '票种',
      dataIndex: 'LotteryName',
    },
    {
      title: '包数',
      dataIndex: 'TotalPackageCount',
      sorter: true,
    },
    {
      title: '金额',
      dataIndex: 'TotalAmount',
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'EntryStatus',
      customRender: ({ text }) => text === 1 ? '已创建' : text === 3 ? '已审核' : '-',
    },
    {
      title: '创建人',
      dataIndex: 'Contacts',
    },
    {
      title: '创建时间',
      dataIndex: 'InsertTime',
      customRender: ({ text }) => text ? text.replace('T', ' ') : '-',
    },
  ];
  if(type === 1) {
    defaultColumns.splice(7, 0, {
      title: '渠道名称',
      dataIndex: 'PartnerName',
    })
  }
  return defaultColumns;
}

export function getSearchFormSchema(type?: number): FormSchema[] {
  const defaultSearchFormSchema: FormSchema[] = [
    {
      field: 'Area',
      label: '销售地区',
      component: 'DefaultCascader',
      colProps: { span: 8 },
      componentProps: {
        params: { Level: 1 }
      }
    },
    {
      field: 'LotteryType',
      label: '彩票类型',
      component: 'Select',
      componentProps: {
        options: [
          { label: '体彩', value: 1 },
          { label: '福彩', value: 2 },
        ],
      },
      colProps: { span: 8 },
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
    },
    {
      field: 'EntryStatus',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: [
          { label: '已创建', value: 1 },
          { label: '已审核', value: 3 },
        ],
      },
      colProps: { span: 8 },
    },
  ];
  if(type === 1) {
    defaultSearchFormSchema.splice(7, 0, {
      field: 'PId',
      label: '渠道',
      component: 'DefaultChannel',
      colProps: { span: 8 },
    })
  }
  return defaultSearchFormSchema
}

export const BuyTicketFormSchema: FormSchema[] = [
  {
    field: 'LotteryType',
    label: '彩票类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '体彩', value: 1 },
        { label: '福彩', value: 2 },
      ],
    },
    rules: [{ type: 'number', required: true }],
  },
  {
    field: 'Area',
    label: '销售地区',
    component: 'DefaultCascader',
    required: true,
  },
  {
    field: 'WareHouseId',
    label: '选择购买仓库',
    component: 'Select',
    required: true,
  },
  {
    field: 'LotteryId',
    label: '票种',
    component: 'Input',
    required: true,
  },
];
