<template>
  <PageWrapper>
    <BasicTable
      size="small"
      :title="`${WorkOrderId}工单`"
      ref="tableRef"
      @register="register"
      class="error-handle-table"
    />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useRouter } from 'vue-router';
  import { BasicTable, useTable, TableActionType  } from '/@/components/Table';

  import { getWorkOrderLog } from '/@/api/workOrder/workOrder';

  import { getColumns } from './data';

  export default defineComponent({
    name: 'WorkOrderLog',
    components: { PageWrapper, BasicTable },
    setup() {
      const { currentRoute } = useRouter();
      const { query } = unref(currentRoute);
      const WorkOrderId = ref<string>(String(query.WorkOrderId));

      const tableRef = ref<Nullable<TableActionType>>(null);

      const [register, { setTableData }] = useTable({
        columns: getColumns(),
        rowKey: 'WorkOrderLogId',
        showTableSetting: true,
        showIndexColumn: false,
        useSearchForm: false,
        searchInfo: {
          WorkOrderId
        },
        api: getWorkOrderLog,
      });

      return {
        WorkOrderId,
        tableRef,
        register,
        setTableData,
      };
    },
  });
</script>
