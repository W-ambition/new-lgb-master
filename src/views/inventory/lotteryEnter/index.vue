<template>
  <div>
    <PageWrapper :title="title">
      <BasicTable
        size="small"
        ref="tableRef"
        :immediate="isDetail ? true : false"
        @register="register"
        @edit-end="handleEditEnd"
        @fetch-success="fetchSuccess"
      >
        <template #tableTitle v-if="!isDetail">
          <a-select
            v-model:value="lotteryType"
            :style="{width: '100px'}"
            placeholder="请选择彩种"
          >
            <a-select-option value="1">体彩</a-select-option>
            <a-select-option value="2">福彩</a-select-option>
          </a-select>
          <a-input
            placeholder="请扫描或输入包号"
            allowClear
            v-model:value="PackageNo"
            :style="{width: '300px', marginLeft: '50px'}"
            @pressEnter="handlePressEnter"
          ></a-input>
        </template>
        <template #action="{ record }" v-if="!isDetail">
          <TableAction
            :actions="[
              { label: '移除', color: 'error', onClick: onRemove.bind(null, record.StockInOrderItemId) },
            ]"
          />
        </template>
        <template #footer v-if="!isDetail">
          <div class="table-footer">
            <span>共扫入<span class="tip-color">{{TotalCount}}</span>包，金额<span class="tip-color">{{TotalAmount}}</span>元</span>
            <a-button class="footer-submit" :disabled="TotalCount === 0" type="primary" @click="handleSubmit">提交</a-button>
          </div>
        </template>
      </BasicTable>
      <audio id="tipAudio" preload="none" :src="SuccessAudio"></audio>
    </PageWrapper>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, unref, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Select, Input } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { BasicTable, useTable, TableAction, TableActionType  } from '/@/components/Table';

  import { BasicColumn } from '/@/components/Table/index';
  import { useMessage } from '/@/hooks/web/useMessage';

  import SuccessAudio from '/@/assets/video/success.mp3';
  import ErrorAudio from '/@/assets/video/error.mp3';

  import { queryStockInOrderItem, createStockInOrder, addStockInOrderItem, submitStockInOrder, editStockInOrderItem, deleteStockInOrderItem } from '/@/api/wareHouse/wareHouse';

  export default defineComponent({
    name: 'LotteryEnter',
    components: {
      PageWrapper,
      TableAction,
      BasicTable,
      [Input.name]: Input,
      [Select.name]: Select,
      ASelectOption: Select.Option
    },
    setup() {
      const { currentRoute } = useRouter();
      const { query } = unref(currentRoute);
      const StockInOrderId = ref<string>(String(query.StockInOrderId || '')); //入库单号
      const isCreate = ref<boolean>(query.StockInOrderId ? true : false); //当前是否已创建入库单
      const WareHouseId = ref<string>(String(query.WareHouseId || '')); //仓库id
      const StockType = ref<number>(Number(query.StockType)); //仓库类型 1：物流仓库  2：自建仓库
      const isDetail = ref<boolean>(Number(query.StockInOrderStatus) === 1 || Number(query.StockInOrderStatus) === 2 ? true : false); // true为入库详情，不能再入库

      const lotteryType = ref<string>('1');
      const PackageNo = ref<string>('');
      const TotalCount = ref<number>(0);
      const TotalAmount = ref<number>(0);
      const { createMessage } = useMessage();

      const title = computed(() => {
        return isDetail.value ? `${StockInOrderId} 入库详情` : '彩票入库';
      })

      const tableRef = ref<Nullable<TableActionType>>(null);
      const columns: BasicColumn[] = [
        {
          dataIndex: 'PackageNo',
          title: '包号',
        },
        {
          title: '彩票类型',
          dataIndex: 'LotteryType',
          customRender: ({ text }) => (text === 1 ? '体彩' : '福彩'),
        },
        {
          title: '彩票名称',
          dataIndex: 'LotteryName',
        },
        {
          dataIndex: 'PackageQuantity',
          title: '数量（张）',
          edit: StockType.value === 1 ? true : false,
          editComponent: 'InputNumber',
        },
        {
          dataIndex: 'CreateTime',
          title: '扫码时间',
          sorter: true,
          customRender: ({ text }) => (text ? text.replace('T', ' ') : '')
        },
      ];

      const [register, { reload }] = useTable({
        columns: columns,
        rowKey: 'StockInOrderId',
        showTableSetting: true,
        useSearchForm: false,
        showIndexColumn: false,
        api: queryStockInOrderItem,
        beforeFetch: beforeFetch,
        actionColumn: isDetail.value ?
        undefined :
        {
          width: 100,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      function beforeFetch(data) {
        const { field, order, ...reset } = data;
        const params = { ...reset };
        if(field === 'CreateTime') {
          order === 'ascend' ? (params.OrderByType = 1) : (params.OrderByType = 0);
        }
        params.StockInOrderId = StockInOrderId.value;
        return params;
      }

      function fetchSuccess({ res }) {
        TotalCount.value = res.TotalCount;
        TotalAmount.value = res.TotalAmount;
      }

      async function onRemove(StockInOrderItemId) {
        try {
          await deleteStockInOrderItem({ stockInOrderItemId: StockInOrderItemId });
          createMessage.success('移除成功');
          reload();
        } catch {}
      }

      async function handlePressEnter(e) {
        const StockInOrderId = await getStockInOrderId();
        const params = {
          PackageNo: e.target.value,
          StockInOrderId: StockInOrderId
        }
        try {
          await addStockInOrderItem(params);
          createMessage.success('入库成功');
          PackageNo.value = '';
          reload({searchInfo: { StockInOrderId }});
          autoPlat(true);
        } catch {
          autoPlat(false);
        }

      }

      async function getStockInOrderId() {
        if(isCreate.value) {
          //已创建入库单，直接入库
          return StockInOrderId.value;
        }else {
          //未创建入库单，先创建后再入库
          try {
            const result = await createStockInOrder({ WareHouseId: WareHouseId.value });
            StockInOrderId.value = result;
            isCreate.value = true;
            return result;
          } catch {}
        }
      }

      async function handleEditEnd({ record, value }: Recordable) {
        const params = {
          StockInOrderId: StockInOrderId.value,
          PackageNo: record.PackageNo,
          TicketQuantity: value
        }
        try {
          await editStockInOrderItem(params);
          createMessage.success('修改成功');
          reload();
        }catch{}
      }

      function autoPlat (flag: boolean) {
        const $TipAudio: HTMLAudioElement = document.getElementById('tipAudio') as HTMLAudioElement;
        flag ? ($TipAudio.src = SuccessAudio) : ($TipAudio.src = ErrorAudio);
        if ($TipAudio !== null) {
          if ($TipAudio.paused) {
            $TipAudio.play();
          }
        }
      }

      async function handleSubmit() {
        const params = { StockInOrderId: StockInOrderId.value };
        try {
          await submitStockInOrder(params);
          createMessage.success('提交成功');
          isDetail.value = true;
        } catch {}
      }

      return {
        register,
        tableRef,
        lotteryType,
        PackageNo,
        TotalCount,
        TotalAmount,
        title,
        isDetail,
        fetchSuccess,
        onRemove,
        handlePressEnter,
        handleEditEnd,
        handleSubmit,
        SuccessAudio,
      }
    }
  })
</script>

<style lang="less" scoped>
  .tip-color {
    color: @error-color;
  }

  .table-footer {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;

    .footer-submit {
      margin-left: 20px;
    }
  }
</style>
