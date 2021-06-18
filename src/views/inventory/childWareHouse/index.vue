<template>
  <div>
    <PageWrapper>
      <BasicTable
        size="small"
        :title="`${LotteryName}子渠道库存`"
        ref="tableRef"
        @register="register"
      />
    </PageWrapper>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useRouter } from 'vue-router';

  import { BasicColumn } from '/@/components/Table/index';
  import { BasicTable, useTable, TableAction, TableActionType  } from '/@/components/Table';

  import { queryChildWareHouseStock } from '/@/api/wareHouse/wareHouse';

  export default defineComponent({
    name: 'ChildWareHouse',
    components: {
      PageWrapper,
      BasicTable,
      TableAction,
    },
    setup() {
      const { currentRoute } = useRouter();
      const { query } = unref(currentRoute);
      const LotteryPrice = ref<number>(Number(query.LotteryPrice));
      const LotteryName = ref<string>(String(query.LotteryName));
      const LotteryId = ref<number>(Number(query.LotteryId));
      const WareHouseId = ref<string>(String(query.WareHouseId));
      const tableRef = ref<Nullable<TableActionType>>(null);

      const columns: BasicColumn[] = [
        {
          dataIndex: 'PartnerName',
          title: '子渠道仓库',
        },
        {
          title: '张数',
          dataIndex: 'StockQuantity',
          sorter: true,
        },
        {
          title: '总金额（元）',
          dataIndex: 'TotalAmount',
          customRender: ({ record }) => record.StockQuantity * LotteryPrice.value
        },
      ];

      const [register] = useTable({
        columns: columns,
        rowKey: 'PId',
        showTableSetting: true,
        useSearchForm: false,
        showIndexColumn: false,
        api: queryChildWareHouseStock,
        beforeFetch: beforeFetch,
        searchInfo: {
          LotteryId: LotteryId.value,
          WareHouseId: WareHouseId.value,
        },
        actionColumn: undefined,
      });

      function beforeFetch(data) {
        const { field, order, ...reset } = data;
        const params = { ...reset };
        if(field === 'StockQuantity') {
          order === 'ascend' ? (params.OrderByType = 1) : (params.OrderByType = 0);
        }
        return params;
      }

      return {
        tableRef,
        register,
        LotteryName
      };
    }
  })
</script>
