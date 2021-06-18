<template>
  <BasicTable
    size="small"
    ref="tableRef"
    @register="register"
  >
    <template #action="{ record }">
      <TableAction
        :actions="[
          { label: '操作记录', onClick: onActionRecord.bind(null, record.StockDetailId) },
        ]"
      />
    </template>
  </BasicTable>
</template>

<script lang="ts">
  import { defineComponent, ref, toRefs } from 'vue';
  import { BasicColumn } from '/@/components/Table/index';
  import { FormSchema } from '/@/components/Table';
  import { BasicTable, useTable, TableAction, TableActionType  } from '/@/components/Table';
  import { queryLotteryPurchases } from '/@/api/wareHouse/wareHouse';

  export default defineComponent({
    components: {
      BasicTable,
      TableAction,
    },
    props: {
      columns: Array as PropType<BasicColumn[]>,
      searchFormSchema: Array as PropType<FormSchema[]>,
      IsOwn: {
        type: Boolean,
        default: false
      }
    },
    emits: ['onActionRecord'],
    setup(props, ctx) {
      const tableRef = ref<Nullable<TableActionType>>(null);
      const { IsOwn } = toRefs(props);

      const [register, { reload }] = useTable({
        columns: props.columns,
        rowKey: 'StockDetailId',
        showTableSetting: true,
        useSearchForm: true,
        formConfig: {
          labelWidth: 120,
          schemas: props.searchFormSchema,
        },
        showIndexColumn: false,
        api: queryLotteryPurchases,
        beforeFetch: beforeFetch,
        searchInfo: {
          IsOwn: IsOwn.value,
        },
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        }
      });

      function beforeFetch(data) {
        const { field, order, Area, ...reset } = data;
        const params = { ...reset };
        if (field === 'InsertTime') {
          params.OrderCondition = 3;
        } else if (field === 'TotalPackageCount') {
          params.OrderCondition = 1;
        } else if (field === 'TotalAmount') {
          params.OrderCondition = 2;
        }
        if(Area) {
          params.ProvinceId = Area[0];
          params.CityId = Area[1];
        }
        order === 'ascend' ? (params.OrderByType = 1) : (params.OrderByType = 0);
        return params;
      }

      function onActionRecord(StockDetailId) {
        ctx.emit('onActionRecord', StockDetailId)
      }

      function handleSuccess() {
        reload();
      }

      return {
        tableRef,
        register,
        onActionRecord,
        handleSuccess,
      };
    },
  })
</script>
