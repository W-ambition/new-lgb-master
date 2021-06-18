import { BasicColumn } from '/@/components/Table/index';
import { FormSchema } from '/@/components/Table';

export function getColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'RuleName',
      title: '规则名称',
      width: 200
    },
    {
      dataIndex: 'PackageQuantity',
      title: '每包张数',
    },
    {
      dataIndex: 'CodeLength',
      title: '票号长度',
    },
    {
      title: '开头字符',
      dataIndex: 'StartWitth',
    },
    {
      title: '包号开始位',
      dataIndex: 'PackageSta',
    },
    {
      title: '包号结束位',
      dataIndex: 'PackageEnd',
    },
    {
      dataIndex: 'TicketSta',
      title: '序号开始位',
    },
    {
      dataIndex: 'TicketEnd',
      title: '序号结束位',
    },
    {
      dataIndex: 'BatchSta',
      title: '批号开始位',
    },
    {
      dataIndex: 'BatchEnd',
      title: '批号结束位',
    },
  ];
}

export const LotteryRuleFormSchema: FormSchema[] = [
  {
    field: 'RuleName',
    label: '规则名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'PackageQuantity',
    label: '每包张数',
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'Example',
    label: '编码规则',
    required: true,
    component: 'Input',
    slot: 'rule',
  },
];
