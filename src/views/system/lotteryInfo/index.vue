<template>
  <PageWrapper>
    <BasicTable
      size="small"
      title="票种信息"
      ref="tableRef"
      @register="register"
      class="error-handle-table"
    >
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增票种 </a-button>
      </template>
      <template #lotteryImg="{ record }">
        <TableImg
          :imgList="[record.FrontPic, record.BackPic]"
        />
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            { label: '编辑', onClick: handleEdit.bind(null, record) },
            { label: '删除', color: 'error', popConfirm: {
              title: '确定删除吗？',
              confirm: handleDelete.bind(null, record.LotteryId)
            } },
            { label: '编码规则', onClick: goToLotteryRule.bind(null, record.LotteryId, record.LotteryType) },
          ]"
        />
      </template>
    </BasicTable>
    <LotteryInfoModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import LotteryInfoModal from './LotteryInfoModal.vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { BasicTable, useTable, TableAction, TableActionType, TableImg  } from '/@/components/Table';

  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { getLotteryInfoList, deleteLottery } from '/@/api/lottery/lottery';
  import { LotteryItem } from '/@/api/lottery/model/lotteryModel';

  import { getColumns, searchFormSchema } from './data';

  export default defineComponent({
    name: 'LotteryInfo',
    components: { PageWrapper, BasicTable, TableAction, TableImg, LotteryInfoModal },
    setup() {
      const tableRef = ref<Nullable<TableActionType>>(null);
      const [registerModal, { openModal }] = useModal();
      const { createMessage } = useMessage();

      const [register, { reload }] = useTable({
        columns: getColumns(),
        rowKey: 'LotteryId',
        bordered: true,
        showTableSetting: true,
        useSearchForm: true,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        showIndexColumn: false,
        scroll: {x: 1200},
        api: getLotteryInfoList,
        beforeFetch: beforeFetch,
        afterFetch: afterFetch,
        actionColumn: {
          width: 170,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      const go = useGo();

      function handleEdit(record) {
        record.FrontPic = new Proxy([record.FrontPic], {});
        record.BackPic = new Proxy([record.BackPic], {});
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

      function goToLotteryRule(id, type) {
        go(`lotteryRule?LotteryId=${id}&LotteryType=${type}`);
      }

      async function handleDelete(id: number) {
        try {
          const result = await deleteLottery({LotteryId: id});
          createMessage.success(result);
          handleSuccess();
        } catch(error) {
          throw new Error(error);
        }
      }

      function beforeFetch(params) {
        params.LotteryType === undefined ?  params.LotteryType  = -1 : null;
        return params;
      }

      function afterFetch(response: LotteryItem[]) {
        response.map(item => {
          let sizeInfo = item.Size.split("*");
          item.Width = Number(sizeInfo[1]);
          item.Height = Number(sizeInfo[0]);
          item.LotteryType = String(item.LotteryType);
          item.UpdateTime = item.UpdateTime.replace("T", " ");
        })
        return response
      }

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleSuccess() {
        reload();
      }

      return {
        tableRef,
        register,
        handleEdit,
        handleDelete,
        handleCreate,
        registerModal,
        handleSuccess,
        goToLotteryRule
      };
    },
  });
</script>
