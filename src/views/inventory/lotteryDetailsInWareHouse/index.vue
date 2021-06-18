<template>
  <PageWrapper
    :title="`${LotteryName}库存详情`"
    :contentBackground="true"
  >
    <template #extra>
      <a-button type="primary" @click="goToLotteryEnter">创建入库单</a-button>
    </template>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="已入库">
        <StockTable
          :columns="entryColumns"
          :StockId="StockId"
          tabActive="1"
          @onActionRecord="goToActionRecord"
        />
      </a-tab-pane>
      <a-tab-pane key="2" tab="已出库" force-render>
        <StockTable
          :columns="outColumns"
          :StockId="StockId"
          tabActive="2"
          @onActionRecord="goToActionRecord"
        />
      </a-tab-pane>
    </a-tabs>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, } from 'ant-design-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useRouter } from 'vue-router';

  import StockTable from './StockTable.vue';

  import { getColumns } from './data';

  export default defineComponent({
    name: 'LotteryDetailsInWareHouse',
    components: {
      PageWrapper,
      StockTable,
      [Tabs.name]: Tabs,
      [Tabs.TabPane.name]: Tabs.TabPane,
    },
    setup() {
      const { currentRoute } = useRouter();
      const { query } = unref(currentRoute);
      const StockId = ref<string>(String(query.StockId));
      const LotteryName = ref<string>(String(query.LotteryName));
      const WareHouseId = ref<string>(String(query.WareHouseId));
      const StockType = ref<number>(Number(query.StockType));
      const activeKey = ref<string>('1');

      const entryColumns = getColumns(1);
      const outColumns = getColumns(2);

      const go = useGo();

      function goToLotteryEnter() {
        go(`lotteryEnter?WareHouseId=${WareHouseId.value}&StockType=${StockType.value}`);
      }

      function goToActionRecord(StockDetailId) {
        console.log(StockDetailId)
      }

      return {
        activeKey,
        StockId,
        LotteryName,
        entryColumns,
        outColumns,
        goToLotteryEnter,
        goToActionRecord,
      };
    },
  })
</script>
