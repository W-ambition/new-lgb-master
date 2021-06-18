import { BasicColumn } from '/@/components/Table/index';

export function getColumns(type: number): BasicColumn[] {
  const defaultColumns: BasicColumn[] = [
    {
      dataIndex: 'StockDetailName',
      title: '包号',
    },
    {
      dataIndex: 'LotteryName',
      title: '彩票名称',
    },
    {
      title: '数量（张）',
      dataIndex: 'DetailQuantity',
    }
  ];
  if(type === 1) {
    defaultColumns.push({
      title: '入库时间',
      dataIndex: 'LsastInTime',
      sorter: true,
      customRender: ({ text }) => text ? text.replace('T', ' ') : '-',
    })
  }else if(type === 2) {
    defaultColumns.push({
      title: '出库时间',
      dataIndex: 'LsastOutTime',
      sorter: true,
      customRender: ({ text }) => text ? text.replace('T', ' ') : '-',
    })
  }
  return defaultColumns;
}
