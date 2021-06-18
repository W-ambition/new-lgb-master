<template>
  <BasicTable
    size="small"
    ref="tableRef"
    @register="register"
  >
    <template #tableTitle>
      <a-input-search
        placeholder="包号"
        enter-button
        allowClear
        :style="{width: '200px'}"
        @search="onSearch"
      />
    </template>
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
  import { Input } from 'ant-design-vue';
  import { BasicColumn } from '/@/components/Table/index';
  import { BasicTable, useTable, TableAction, TableActionType  } from '/@/components/Table';
  import { queryStockDetail } from '/@/api/wareHouse/wareHouse';

  export default defineComponent({
    components: {
      BasicTable,
      TableAction,
      [Input.Search.name]: Input.Search
    },
    props: {
      columns: Array as PropType<BasicColumn[]>,
      StockId: {
        type: String,
        default: ''
      },
      tabActive: {
        type: String,
        default: '1'
      }
    },
    emits: ['onActionRecord'],
    setup(props, ctx) {
      const tableRef = ref<Nullable<TableActionType>>(null);
      const { StockId, tabActive } = toRefs(props);

      const [register, { reload }] = useTable({
        columns: props.columns,
        rowKey: 'StockDetailId',
        showTableSetting: true,
        useSearchForm: false,
        showIndexColumn: false,
        api: queryStockDetail,
        beforeFetch: beforeFetch,
        searchInfo: {
          StockId: StockId.value,
          StockDetailStatus: tabActive.value === '1' ? 0 : 1,
        },
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        }
      });

      function beforeFetch(data) {
        const { field, order, ...reset } = data;
        const params = { ...reset };
        if(field === 'LsastInTime' || field === 'LsastOutTime') {
          order === 'ascend' ? (params.OrderByType = 1) : (params.OrderByType = 0);
        }
        return params;
      }

      function onActionRecord(StockDetailId) {
        ctx.emit('onActionRecord', StockDetailId)
      }

      function onSearch(value: string) {
        const params = {
          searchInfo: { StockDetailName: value || undefined }
        }
        reload(params)
      }

      return {
        tableRef,
        register,
        onActionRecord,
        onSearch
      };
    },
  })
</script>
