import { BasicColumn } from '/@/components/Table/index';
import { FormSchema } from '/@/components/Table';
import { getLotteryList } from '/@/api/lottery/lottery';
import { uploadApi } from '/@/api/sys/upload';

export function getColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'LotteryName',
      title: '彩票名称',
    },
    {
      dataIndex: 'LotteryPrice',
      title: '面值(元)',
    },
    {
      dataIndex: 'MaxBonus',
      title: '最大奖金(元)',
    },
    {
      title: '长(mm)',
      dataIndex: 'Width',
    },
    {
      title: '宽(mm)',
      dataIndex: 'Height',
    },
    {
      title: '效果图',
      dataIndex: 'lotteryImg',
      slots: { customRender: 'lotteryImg' },
    },
    {
      dataIndex: 'LotteryType',
      title: '彩票类型',
      customRender: ({ text }) => text === '1' ? '体彩' : text === '2' ? '福彩' : '-',
    },
    {
      dataIndex: 'UpdateTime',
      title: '更新时间',
      width: 200
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
];

export function getDescSchema(): any {
  return getColumns().map((column) => {
    return {
      field: column.dataIndex!,
      label: column.title,
    };
  });
}

export const LotteryInfoFormSchema: FormSchema[] = [
  {
    field: 'LotteryName',
    label: '票种名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'LotteryPrice',
    label: '面值',
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'MaxBonus',
    label: '最大奖金',
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'BonusLevels',
    label: '奖金等级',
    component: 'Input',
    required: true,
  },
  {
    field: 'Width',
    label: '票面长度',
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'Height',
    label: '票面宽度',
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'LotteryType',
    label: '彩票类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '体彩', value: '1' },
        { label: '福彩', value: '2' },
      ],
    },
    required: true,
  },
  {
    field: 'Introduction',
    label: '玩法介绍',
    component: 'InputTextArea',
    required: true,
  },
  {
    field: 'FrontPic',
    label: '彩票正面',
    component: 'Upload',
    componentProps: {
      maxNumber: 1,
      multiple: false,
      api: uploadApi
    },
    required: true,
  },
  {
    field: 'BackPic',
    label: '彩票反面',
    component: 'Upload',
    componentProps: {
      maxNumber: 1,
      multiple: false,
      api: uploadApi
    },
    required: true,
  },
];
