<template>
  <PageWrapper>
    <BasicTable
      size="small"
      :title="WareHouseName"
      ref="tableRef"
      @edit-end="handleEditEnd"
      @register="register"
    >
      <template #toolbar>
        <a-row type="flex" :gutter="16" v-if="StockType === 2 || LevelType === 1">
          <a-col :span="12"><a-button type="primary" @click="goToLotteryEnter"> 创建入库单 </a-button></a-col>
          <a-col :span="12"><a-button type="primary" @click="goToEntryRecord"> 入库记录 </a-button></a-col>
        </a-row>
        <a-row v-else>
          <a-button type="primary" @click="goToBuyTicket"> 发起购票申请 </a-button>
        </a-row>
      </template>
      <template #stockquantity="{ text, record }">
        <a
          v-if="LevelType === 1"
          @click="goToChildLotteryStock(record.WareHouseId, record.ObjectId, record.ObjectName, record.LotteryPrice)"
        >
          {{text}}
        </a>
        <span v-else>{{text}}</span>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            { label: '明细', onClick: goToLotteryDetail.bind(null, record.StockId, record.ObjectName) },
          ]"
        />
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';

  import { useRouter } from 'vue-router';

  import { Row, Col } from 'ant-design-vue'

  import { useGo } from '/@/hooks/web/usePage';
  import { BasicTable, useTable, TableAction, TableActionType  } from '/@/components/Table';

  import { useMessage } from '/@/hooks/web/useMessage';

  import { queryLotteryStock, updateStockThreshold } from '/@/api/wareHouse/wareHouse';

  import { getColumns, searchFormSchema } from './data';

  export default defineComponent({
    name: 'LotteryListInWareHouse',
    components: {
      PageWrapper,
      BasicTable,
      TableAction,
      [Row.name]: Row,
      [Col.name]: Col
    },
    setup() {
      const { currentRoute } = useRouter();
      const { query } = unref(currentRoute);
      const WareHouseId = ref<string>(String(query.WareHouseId));
      const WareHouseName = ref<string>(String(query.WareHouseName));
      const LevelType = ref<number>(Number(query.LevelType));
      const StockType = ref<number>(Number(query.StockType));

      const tableRef = ref<Nullable<TableActionType>>(null);
      const { createMessage } = useMessage();

      const [register, { reload }] = useTable({
        columns: getColumns(),
        rowKey: 'StockId',
        showTableSetting: true,
        useSearchForm: true,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        showIndexColumn: false,
        scroll: {x: 1100},
        api: queryLotteryStock,
        beforeFetch: beforeFetch,
        actionColumn: StockType.value === 2 || (StockType.value === 1 && LevelType.value === 1) ? {
          width: 50,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        } : undefined,
      });

      const go = useGo();

      function beforeFetch(data) {
        const { field, order, ...reset } = data;
        const params = { ...reset };
        if(field === 'StockQuantity') {
          order === 'ascend' ? (params.StockQuantityOrderByType = 1) : (params.StockQuantityOrderByType = 0);
        } else if(field === 'Threshold') {
          order === 'ascend' ? (params.ThresholdOrderByType = 1) : (params.ThresholdOrderByType = 0);
        }
        params.WareHouseId = WareHouseId.value;
        return params;
      }

      async function handleEditEnd({ record, value }: Recordable) {
        const params = {
          StockId: record.StockId,
          Threshold: value
        }
        try {
          await updateStockThreshold(params);
          createMessage.success('修改成功');
          reload();
        }catch{}
      }

      function goToLotteryEnter() {
        go(`lotteryEnter?WareHouseId=${WareHouseId.value}&StockType=${StockType.value}`)
      }

      function goToEntryRecord() {
        go(`entryRecord?WareHouseId=${WareHouseId.value}&StockType=${StockType.value}`)
      }

      function goToBuyTicket() {
        console.log('goToBuyTicket')
      }

      function handleSuccess() {
        reload();
      }

      function goToLotteryDetail(StockId, ObjectName) {
        go(`lotteryDetailsInWareHouse?StockId=${StockId}&LotteryName=${ObjectName}&WareHouseId=${WareHouseId.value}&StockType=${StockType.value}`);
      }

      function goToChildLotteryStock(WareHouseId, ObjectId, ObjectName, LotteryPrice) {
        go(`childWareHouse?LotteryName=${ObjectName}&LotteryId=${ObjectId}&LotteryPrice=${LotteryPrice}&WareHouseId=${WareHouseId}`);
      }

      return {
        tableRef,
        WareHouseName,
        LevelType,
        StockType,
        register,
        goToLotteryDetail,
        goToLotteryEnter,
        goToEntryRecord,
        goToBuyTicket,
        handleSuccess,
        handleEditEnd,
        goToChildLotteryStock
      };
    },
  });
</script>
