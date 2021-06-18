import { BasicColumn } from '/@/components/Table/index';
import { FormSchema } from '/@/components/Table';
import { DefaultCascader } from '/@/components/Form/index';
import { DefaultChannel } from '/@/components/Form/index';
import { getPartnerDic } from '/@/api/channel/channel';

export function getColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'Area',
      title: '地区',
      customRender: ({ record }) => `${record.ProvinceName}-${record.CityName}`,
    },
    {
      dataIndex: 'WareHouseName',
      title: '仓库名称',
    },
    {
      dataIndex: 'LevelType',
      title: '仓库类型',
      customRender: ({ text }) => text === 1 ? '总仓' : text === 2 ? '分仓' : '-',
    },
    {
      title: '渠道商',
      dataIndex: 'PartnerName',
    }
  ];
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'KeyWords',
    label: '仓库编号/名称',
    component: 'Input',
    colProps: { xs: 24, sm: 24, xl: 12, xxl: 8 },
  },
  {
    field: 'Area',
    label: '地区',
    component: 'DefaultCascader',
    colProps: { xs: 24, sm: 24, xl: 12, xxl: 8 },
    rules: [{ type: 'array' }],
    componentProps: {
      params: {
        Level: 1,
        QueryType: 2
      },
      placeholder: '请选择地区',
      getPopupContainer: triggerNode => triggerNode.parentNode,
    }
  },
  {
    field: 'LevelType',
    label: '仓库类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '总仓', value: 1 },
        { label: '分仓', value: 2 },
      ],
    },
    colProps: { xs: 24, sm: 24, xl: 12, xxl: 8 },
  },
  {
    field: 'PId',
    label: '渠道商',
    component: 'DefaultChannel',
    componentProps: {
      placeholder: '请选择渠道商'
    },
    colProps: { xs: 24, sm: 24, xl: 12, xxl: 8 },
  }
];

export const WareHouseInfoFormSchema: FormSchema[] = [
  {
    field: 'WareHouseName',
    label: '仓库名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'Area',
    label: '地区',
    component: 'DefaultCascader',
    rules: [{ type: 'array', required: true }],
    componentProps: {
      params: {
        Level: 1,
        QueryType: 2
      },
      placeholder: '请选择地区',
      getPopupContainer: triggerNode => triggerNode.parentNode,
    },
  },
  {
    field: 'PId',
    label: '渠道商',
    component: 'DefaultChannel',
    rules: [{ type: 'number', required: true }],
    componentProps: {
      placeholder: '请选择渠道商'
    },
  }
];
