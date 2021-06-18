<template>
  <PageWrapper>
    <BasicTable
      size="small"
      title="工单列表"
      ref="tableRef"
      @register="register"
      class="error-handle-table"
    >
      <template #action="{ record }">
        <TableAction
          :actions="[
            { label: '查看', onClick: handleSee.bind(null, record.WorkOrderId, record.WorkOrderType) },
            { label: '编辑', onClick: handleEdit.bind(null, record.WorkOrderId, record.WorkOrderType) },
          ]"
        />
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';

  import { useGo } from '/@/hooks/web/usePage';
  import { BasicTable, useTable, TableAction, TableActionType  } from '/@/components/Table';

  import { getWorkOrderList } from '/@/api/workOrder/workOrder';

  import { getColumns, searchFormSchema } from './data';

  export default defineComponent({
    name: 'OtherTicket',
    components: { PageWrapper, BasicTable, TableAction },
    setup() {
      const tableRef = ref<Nullable<TableActionType>>(null);

      const go = useGo();

      const [register, { setTableData, reload }] = useTable({
        columns: getColumns(),
        rowKey: 'WorkOrderId',
        showTableSetting: true,
        showIndexColumn: false,
        useSearchForm: true,
        scroll: {x: 1500},
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        api: getWorkOrderList,
        beforeFetch: beforeFetch,
        actionColumn: {
          width: 100,
          title: '操作',
          fixed: 'right',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      function handleEdit(id, type) {
        go(`detail?WorkOrderId=${id}&WorkOrderType=${type}&actionType=edit`);
      }

      function handleSee(id, type) {
        go(`detail?WorkOrderId=${id}&WorkOrderType=${type}&actionType=see`);
      }

      function handleSuccess() {
        reload();
      }

      function beforeFetch(data) {
        const { CreateTime, FinishTime, field, order, ...reset } = data;
        const params = { ...reset };
        if(CreateTime) {
          params.CreateBeginTime = CreateTime[0].replace(" ", "T");
          params.CreateEndTime = CreateTime[1].replace(" ", "T")
        }
        if(FinishTime) {
          params.FinishBeginTime = FinishTime[0].replace(" ", "T");
          params.FinishEndTime = FinishTime[1].replace(" ", "T")
        }
        if(field === "CreateTime" && order !== undefined) {
          params.CreateTimeOrderType = order === "ascend" ? 1 : order === "descend" ? 0 : undefined;
        }
        return params
      }

      return {
        tableRef,
        register,
        setTableData,
        handleEdit,
        handleSee,
        handleSuccess,
      };
    },
  });
</script>
