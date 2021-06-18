<template>
  <div>
    <PageWrapper>
      <BasicTable
        size="small"
        title="入库记录"
        ref="tableRef"
        @register="register"
      >
        <template #toolbar>
          <a-button type="primary" @click="handleCreate"> 创建入库单 </a-button>
        </template>
        <template #action="{ record }">
          <TableAction
            :actions="[
              { label: '详情', onClick: goToLotteryEnter.bind(null, record.StockInOrderId, record.StockInOrderStatus) },
              { label: '删除', color: 'error', popConfirm: {
                title: '确定删除吗？',
                confirm: onRemove.bind(null, record.StockInOrderId)
              } },
            ]"
          />
        </template>
      </BasicTable>
    </PageWrapper>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useRouter } from 'vue-router';

  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';

  import { BasicColumn } from '/@/components/Table/index';
  import { FormSchema } from '/@/components/Table';
  import { BasicTable, useTable, TableAction, TableActionType  } from '/@/components/Table';

  import { queryStockInOrder, deleteStockInOrder } from '/@/api/wareHouse/wareHouse';

  export default defineComponent({
    name: 'WareHouseEntryRecord',
    components: {
      PageWrapper,
      BasicTable,
      TableAction,
    },

    setup() {
      const { currentRoute } = useRouter();
      const { query } = unref(currentRoute);
      const WareHouseId = ref<string>(String(query.WareHouseId));
      const StockType = ref<number>(Number(query.StockType));
      const tableRef = ref<Nullable<TableActionType>>(null);
      const { createMessage } = useMessage();

      const columns: BasicColumn[] = [
        {
          dataIndex: 'StockInOrderId',
          title: '入库单编号',
        },
        {
          title: '状态',
          dataIndex: 'StockInOrderStatus',
          customRender: ({ text }) => {
            switch (text) {
              case 0:
                return '已创建';
              case 1:
                return '已提交';
              case 2:
                return '收货完成';
              default:
                return '-';
            }
          },
        },
        {
          title: '类型',
          dataIndex: 'StockInOrderType',
          customRender: ({ text }) => {
            switch (text) {
              case 0:
                return '普通入库';
              case 1:
                return '退票入库';
              default:
                return '-';
            }
          }
        },
        {
          dataIndex: 'CreateTime',
          title: '入库时间',
          sorter: true,
          customRender: ({ text }) => (text ? text.replace('T', ' ') : '')
        },
      ];

      const searchFormSchema: FormSchema[] = [
        {
          field: 'StockInOrderId',
          label: '物流订单编号',
          component: 'Input',
          colProps: { xs: 24, sm: 24, xl: 12, xxl: 8 },
        },
        {
          field: 'StockInOrderType',
          label: '类型',
          component: 'Select',
          componentProps: {
            options: [
              { label: '普通入库', value: 0 },
              { label: '退票入库', value: 1 },
            ]
          },
          colProps: { xs: 24, sm: 24, xl: 12, xxl: 8 },
        },
      ]

      const [register, { reload }] = useTable({
        columns: columns,
        rowKey: 'StockInOrderId',
        showTableSetting: true,
        useSearchForm: true,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        showIndexColumn: false,
        api: queryStockInOrder,
        beforeFetch: beforeFetch,
        searchInfo: {
          WareHouseId: WareHouseId.value,
        },
        actionColumn: {
          width: 100,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      const go = useGo();

      function beforeFetch(data) {
        const { field, order, ...reset } = data;
        const params = { ...reset };
        if(field === 'CreateTime') {
          order === 'ascend' ? (params.OrderByType = 1) : (params.OrderByType = 0);
        }
        return params;
      }

      function handleCreate() {
        goToLotteryEnter()
      }

      function goToLotteryEnter(StockInOrderId?, StockInOrderStatus?) {
        go(`lotteryEnter?WareHouseId=${WareHouseId.value}&StockInOrderId=${StockInOrderId}&StockType=${StockType.value}&StockInOrderStatus=${StockInOrderStatus}`)
      }

      async function onRemove(stockInOrderId) {
        try {
          await deleteStockInOrder({stockInOrderId});
          createMessage.success('删除成功');
          reload();
        } catch {}
      }

      return {
        tableRef,
        register,
        goToLotteryEnter,
        handleCreate,
        onRemove
      }
    }
  })
</script>
