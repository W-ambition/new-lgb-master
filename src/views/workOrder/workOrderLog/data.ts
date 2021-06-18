import { BasicColumn } from '/@/components/Table/index';

export function getColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'Remark',
      title: '操作',
    },
    {
      dataIndex: 'ExecutorName',
      title: '操作人',
    },
    {
      dataIndex: 'CreateTime',
      title: '操作时间',
      customRender: ({ text }) => text ? text.replace("T", " ") : "",
    }
  ];
}
