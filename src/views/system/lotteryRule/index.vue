<template>
  <PageWrapper>
    <BasicTable
      size="small"
      title="票种编码"
      ref="tableRef"
      @register="register"
      class="error-handle-table"
    >
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增编码规则 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            { label: record.Enable === 1 ? '禁用' : '启用', onClick: handleFlag.bind(null, record) },
            { label: '编辑', onClick: handleEdit.bind(null, record) },
            { label: '删除', color: 'error', popConfirm: {
              title: '确定删除吗？',
              confirm: handleDelete.bind(null, record.LotteryPackageRuleId)
            } }
          ]"
        />
      </template>
    </BasicTable>
    <LotteryRuleModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';

  import { useRouter } from 'vue-router';

  import { BasicTable, useTable, TableAction, TableActionType  } from '/@/components/Table';
  import { FETCH_SETTING } from '/@/components/Table/src/const';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  import LotteryRuleModal from './LotteryRuleModal.vue';

  import { getLotteryDetails, deleteLotteryPackageRule, editLotteryPackageRule } from '/@/api/lottery/lottery';
  import { EditLotteryPackageRuleParams } from '/@/api/lottery/model/lotteryModel';

  import { getColumns } from './data';

  export default defineComponent({
    name: 'LotteryRule',
    components: { PageWrapper, BasicTable, TableAction, LotteryRuleModal },
    setup() {
      const { currentRoute } = useRouter();
      const { query } = unref(currentRoute);
      const LotteryId = ref<number>(Number(query.LotteryId));
      const LotteryType = ref<number>(Number(query.LotteryType));

      const tableRef = ref<Nullable<TableActionType>>(null);
      const [registerModal, { openModal }] = useModal();
      const { createMessage } = useMessage();

      const [register, { setTableData, reload }] = useTable({
        columns: getColumns(),
        rowKey: 'LotteryPackageRuleId',
        showTableSetting: true,
        showIndexColumn: false,
        scroll: {x: 1200},
        api: getLotteryDetails,
        searchInfo: { LotteryId },
        fetchSetting: {
          ...FETCH_SETTING,
          listField: 'LotteryPackageRuleList'
        },
        pagination: false,
        actionColumn: {
          width: 140,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      function handleEdit(record) {
        if(record.Example) {
          const ExampleArr: string[] = record.Example.split("-");
          record.rule1 = ExampleArr[0];
          record.rule2 = ExampleArr[1];
          record.rule3 = ExampleArr[2];
          record.rule4 = ExampleArr[3];
        }
        openModal(true, {
          record,
          LotteryType,
          LotteryId,
          isUpdate: true,
        });
      }

      async function handleFlag(record) {
        const params: EditLotteryPackageRuleParams = {
          LotteryPackageRuleId: record.LotteryPackageRuleId,
          RuleName: record.RuleName,
          LotteryId: record.LotteryId,
          CodeLength: record.CodeLength,
          StartWith: record.StartWith,
          PackageSta: record.PackageSta,
          PackageEnd: record.PackageEnd,
          TicketSta: record.TicketSta,
          TicketEnd: record.TicketEnd,
          BatchSta: record.BatchSta,
          BatchEnd: record.BatchEnd,
          PackageQuantity: record.PackageQuantity,
          Example: record.Example,
          Enable: record.Enable === 1 ? 0 : 1,
        }
        const result = await editLotteryPackageRule(params);
        createMessage.success(result);
        handleSuccess();
      }

      async function handleDelete(id: number) {
        try {
          const result = await deleteLotteryPackageRule({LotteryPackageRuleId: id});
          createMessage.success(result);
          handleSuccess();
        } catch(error) {
          throw new Error(error);
        }
      }

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
          LotteryType,
          LotteryId
        });
      }

      function handleSuccess() {
        reload();
      }

      return {
        tableRef,
        register,
        setTableData,
        handleEdit,
        handleDelete,
        handleCreate,
        registerModal,
        handleSuccess,
        handleFlag
      };
    },
  });
</script>
