import { BasicColumn } from '/@/components/Table/index';
import { FormSchema } from '/@/components/Table';
import { getLotteryList, getLotteryDetails } from '/@/api/lottery/lottery';

export function getColumns(handleClick: Fn): BasicColumn[] {
  return [
    {
      dataIndex: 'LotteryType',
      title: '彩票类型',
      customRender: ({ text }) => text === 1 ? '体彩' : text === 2 ? '福彩' : '-',
    },
    {
      dataIndex: 'LotteryName',
      title: '彩票名称',
    },
    {
      dataIndex: 'RuleName',
      title: '编码规则',
      customRender: ({ text, record }) => <a onClick={handleClick.bind(null, record)}>{text}</a>
    },
    {
      title: '彩票批号',
      dataIndex: 'LotteryBatchId',
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
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
    field: 'BatchNo',
    label: '彩票批号',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const LotteryBatchFormSchema: FormSchema[] = [
  {
    field: 'LotteryType',
    label: '彩票类型',
    component: 'Select',
    rules: [{ type: 'number', required: true }],
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: '体彩', value: 1 },
          { label: '福彩', value: 2 },
        ],
        onChange: () => {
          formModel.LotteryId = undefined;
          formModel.LotteryPackageRuleId = undefined;
        }
      }
    }
  },
  {
    field: 'LotteryId',
    label: '彩票名称',
    component: 'ApiSelect',
    rules: [{ type: 'number', required: true }],
    componentProps: ({ formModel }) => {
      return {
        params: {LotteryType: formModel.LotteryType},
        api: getLotteryList,
        labelField: 'LotteryName',
        valueField: 'LotteryId',
        showSearch: true,
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        onChange: () => {
          formModel.LotteryPackageRuleId = undefined;
        }
      }
    }
  },
  {
    field: 'LotteryPackageRuleId',
    label: '编码规则',
    component: 'ApiSelect',
    rules: [{ type: 'number', required: true }],
    componentProps: ({ formModel }) => {
      return {
        params: {LotteryId: formModel.LotteryId},
        api: getLotteryDetails,
        labelField: 'RuleName',
        valueField: 'LotteryPackageRuleId',
        showSearch: true,
        resultField: 'LotteryPackageRuleList',
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      }
    },
  },
  {
    field: 'BatchNo',
    label: '彩票批号',
    component: 'Input',
    required: true,
    slot: 'img',
    componentProps: ({ formModel }) => {
      return {
        LotteryType: formModel.LotteryType
      }
    }
  },
];
