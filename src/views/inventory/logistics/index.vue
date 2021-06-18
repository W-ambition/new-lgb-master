<template>
  <PageWrapper>
    <BasicTable
      size="small"
      title="物流仓库"
      ref="tableRef"
      @register="register"
    >
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 创建仓库 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            { label: '彩票', onClick: goToLottery.bind(null, record.WareHouseId, record.WareHouseName, record.LevelType) },
            { label: '编辑', onClick: handleEdit.bind(null, record) },
            { label: '删除', color: 'error', popConfirm: {
              title: '确定删除吗？',
              confirm: handleDelete.bind(null, record.WareHouseId)
            } },
          ]"
        />
      </template>
    </BasicTable>
    <WareHouseInfoModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import WareHouseInfoModal from './WareHouseInfoModal.vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { BasicTable, useTable, TableAction, TableActionType  } from '/@/components/Table';

  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { getWareHouseList, deleteWareHouse } from '/@/api/wareHouse/wareHouse';

  import { getColumns, searchFormSchema } from './data';

  export default defineComponent({
    name: 'LogisticsList',
    components: {
      PageWrapper,
      BasicTable,
      TableAction,
      WareHouseInfoModal
    },
    setup() {
      const tableRef = ref<Nullable<TableActionType>>(null);
      const [registerModal, { openModal }] = useModal();
      const { createMessage } = useMessage();

      const [register, { setTableData, reload }] = useTable({
        columns: getColumns(),
        rowKey: 'WareHouseId',
        showTableSetting: true,
        useSearchForm: true,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        showIndexColumn: false,
        scroll: {x: 900},
        api: getWareHouseList,
        beforeFetch: beforeFetch,
        actionColumn: {
          width: 170,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      const go = useGo();

      function handleEdit(record) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

      function goToLottery(id, name, type) {
        go(`lotteryListInWareHouse?WareHouseId=${id}&WareHouseName=${name}&LevelType=${type}&StockType=${1}`);
      }

      async function handleDelete(id: string) {
        try {
          const result = await deleteWareHouse({warehouseId: id});
          createMessage.success(result || '删除成功');
          handleSuccess();
        } catch(error) {
          throw new Error(error);
        }
      }

      function beforeFetch(params) {
        if(params.Area) {
          params.ProvinceId = params.Area[0];
          params.CityId = params.Area[1];
        }
        params.BusinessType = 2;
        return params;
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
        setTableData,
        handleEdit,
        handleDelete,
        handleCreate,
        registerModal,
        handleSuccess,
        goToLottery
      };
    },
  });
</script>
