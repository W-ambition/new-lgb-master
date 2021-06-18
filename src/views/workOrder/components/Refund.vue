<template>
  <div>
    <a-card :title="title">
      <BasicForm
        @register="register"
        @submit="handleSubmit"
        :showResetButton="true"
        :showSubmitButton="true"
      >
        <template #orderId="{ model, field }">
          <a-row type="flex">
            <a-col :span="16"><a-input placeholder="请输入订单编号" v-model:value="model[field]" /></a-col>
            <a-col :span="6" :style="{marginLeft: '10px'}"><a-button type="primary" @click="getOrderInfo(model[field])">读取订单</a-button></a-col>
          </a-row>

        </template>
        <template #Executor="{ model, field }">
          <SelectExecutor
            v-model:value="model[field]"
            :disabled="(orderDetail.CurrentStatus >= 5) ? true : false"
            @listernSetFieldsValue="setFields"
            @select="handleSelect"
          />
        </template>
        <template #OrderItemsDTO>
          <a-table
            :bordered="true"
            :columns="columns"
            :dataSource="orderDetail.OrderItemsDTO"
            :pagination="false"
            rowKey="MachineHeadId"
          >
            <template #RefoundNum="{ index }">
              <a-input-number
                placeholder="请输入退票数量"
                :min="0"
                v-model:value="orderDetail.OrderItemsDTO[index].LotteryCount"
              />
            </template>
          </a-table>
        </template>
      </BasicForm>
      <Loading :loading="loading" :absolute="false" />
    </a-card>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, reactive } from 'vue';
  import { Card, message, Input, Row, Col, Table, InputNumber } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Loading } from '/@/components/Loading';
  import SelectExecutor from './SelectExecutor.vue';
  import { getOrderDetail } from '/@/api/order/order';
  import { addRefund } from '/@/api/workOrder/workOrder';
  import { WorkOrderAddRefundLotterysItem } from '/@/api/workOrder/model/workOrderModel';
  import { refundSchemas } from './data';

  interface OrderDetailParams {
    CurrentStatus: number;
    AreaName: string;
    PartnerName: string;
    MerchantName: string;
    MachineId: string;
    TotalAmout: number;
    PrintedAmount: number;
    PayPlatformName: string;
    PaySourceName: string;
    InsertedTime: string;
    OrderStastus: number;
    OrderItemsDTO: OrderItemsDTOItem[];
  }

  interface OrderItemsDTOItem {
    OrderId: string;
    LotteryId: number;
    MachineHeadId: string;
    LotteryType: number;
    LotteryName: string;
    LotteryPrice: number;
    Count: number;
    RefoundCount: number;
    PaidAmount: number;
    PrintedCount: number;
    RefoundAmount: number;
    InsertTime: string;
    PaidTime: string;
    LastRefoundTime: string;
    LotteryCount?: number;
  }

  const defaultOrderDetail: OrderDetailParams = {
    CurrentStatus: 0,
    AreaName: '',
    PartnerName: '',
    MerchantName: '',
    MachineId: '',
    TotalAmout: 0,
    PrintedAmount: 0,
    PayPlatformName: '',
    PaySourceName: '',
    InsertedTime: '',
    OrderStastus: 0,
    OrderItemsDTO: []
  }
  export default defineComponent({
    components: {
      BasicForm,
      SelectExecutor,
      Loading,
      [Card.name]: Card,
      [Input.name]: Input,
      [Row.name]: Row,
      [Col.name]: Col,
      [Table.name]: Table,
      [InputNumber.name]: InputNumber
    },
    props: {
      title: {
        type: String,
        default: '退款工单'
      },
    },
    setup() {
      const loading = ref<boolean>(false);
      const orderDetail = reactive({ ...defaultOrderDetail });

      const columns = [
        {
          title: '彩票名称',
          dataIndex: 'LotteryName',
        },
        {
          title: '购买数量',
          dataIndex: 'Count',
        },
        {
          title: '购买金额',
          dataIndex: 'PaidAmount',
          customRender: ({ record }) => record.Count * record.LotteryPrice,
        },
        {
          title: '出票数量',
          dataIndex: 'PrintedCount',
        },
        {
          title: '出票金额',
          dataIndex: 'PrintedMoney',
          customRender: ({ record }) => record.PrintedCount * record.LotteryPrice,
        },
        {
          title: '退票数量',
          dataIndex: 'RefoundCount',
        },
        {
          title: '退款金额',
          dataIndex: 'RefoundAmount',
        },
        {
          title: '退票数量',
          dataIndex: 'RefoundNum',
          slots: { customRender: 'RefoundNum' },
        },
      ]
      const [register, { updateSchema, setFieldsValue, resetFields }] = useForm({
        labelWidth: 120,
        schemas: refundSchemas,
        actionColOptions: {
          offset: 8,
          span: 6,
        },
        submitButtonOptions: {
          text: '提交',
        },
        resetFunc: handleReset
      });

      onMounted(async () => {
        showOrHideSchema(false);
      });
      //获取订单信息
      async function getOrderInfo(OrderId) {
        try {
          loading.value = true;
          const result = await getOrderDetail(OrderId);
          orderDetail.AreaName = result.AreaName;
          orderDetail.PartnerName = result.PartnerName;
          orderDetail.MerchantName = result.MerchantName;
          orderDetail.MachineId = result.MachineId;
          orderDetail.TotalAmout = result.TotalAmout;
          orderDetail.PrintedAmount = result.PrintedAmount;
          orderDetail.PayPlatformName = result.PayPlatformName;
          orderDetail.PaySourceName = result.PaySourceName;
          const InsertedTime = result.InsertedTime ? result.InsertedTime.replace("T", " ") : "-";
          orderDetail.InsertedTime = InsertedTime;
          orderDetail.OrderStastus = result.OrderStastus;
          orderDetail.OrderItemsDTO = result.OrderItemsDTO;
          setFieldsValue({
            AreaName: result.AreaName,
            PartnerName: result.PartnerName,
            MerchantName: result.MerchantName,
            MachineId: result.MachineId,
            TotalAmout: result.TotalAmout,
            PrintedAmount: result.PrintedAmount,
            PayPlatformName: result.PayPlatformName,
            PaySourceName: result.PaySourceName,
            InsertedTime: InsertedTime,
            OrderStastus: result.OrderStastus,
          })
          showOrHideSchema(true);
          loading.value = false;
        } catch {}
      }
      //控制不同状态下，需要显示\隐藏的formItem
      function showOrHideSchema(show: boolean) {
        updateSchema([
          {
            field: 'AreaName',
            ifShow: show
          },
          {
            field: 'PartnerName',
            ifShow: show
          },
          {
            field: 'MerchantName',
            ifShow: show
          },
          {
            field: 'MachineId',
            ifShow: show
          },
          {
            field: 'TotalAmout',
            ifShow: show
          },
          {
            field: 'PrintedAmount',
            ifShow: show
          },
          {
            field: 'PayPlatformName',
            ifShow: show
          },
          {
            field: 'PaySourceName',
            ifShow: show
          },
          {
            field: 'InsertedTime',
            ifShow: show
          },
          {
            field: 'OrderStastus',
            ifShow: show
          },
          {
            field: 'OrderItemsDTO',
            ifShow: show
          }
        ])
      }


      function setFields(data) {
        setFieldsValue(data)
      }

      function handleSelect(_, option) {
        setFieldsValue({
          ExecutorPhone: option.UserName
        })
      }

      //校验退票数量是否大于0,当条件都满足时，生成符合接口要求数据
      function judgeLotteryCount() {
        const WorkOrderAddRefundLotterys: WorkOrderAddRefundLotterysItem[] = [];
        let TotalCount: number = 0;
        orderDetail.OrderItemsDTO.map(item => {
          let LotteryCount = item.LotteryCount || 0;
          WorkOrderAddRefundLotterys.push({
            MachineHeadId: item.MachineHeadId,
            LotteryId: item.LotteryId,
            LotteryCount: LotteryCount
          })
          TotalCount = TotalCount + LotteryCount
        })
        const flag = TotalCount > 0 ? true : false;
        return {
          flag,
          WorkOrderAddRefundLotterys
        }
      }

      //创建退款工单
      async function create(values) {
        const { flag, WorkOrderAddRefundLotterys } = judgeLotteryCount();
        if(!flag) {
          message.warning('请输入退票数量');
          return false;
        }
        const params = {
          Executor: values.Executor,
          ExecutorPhone: values.ExecutorPhone,
          OrderId: values.OrderId,
          RefundType: 1,
          Remark: values.Remark,
          WorkOrderAddRefundLotterys: WorkOrderAddRefundLotterys
        }
        try {
          await addRefund(params);
          message.success('创建成功');
          return true
        } catch { return false }
      }

      async function handleSubmit(values) {
        try {
          const result = await create(values);
          if(result) {
            resetFields();
            handleReset();
          }
        } finally {}
      }

      //重置
      async function handleReset() {
        for(let key in orderDetail) {
          orderDetail[key] = defaultOrderDetail[key]
        }
        showOrHideSchema(false);
      }

      return {
        register,
        setFields,
        loading,
        handleSelect,
        handleSubmit,
        orderDetail,
        getOrderInfo,
        columns
      }
    }
  })
</script>

<style lang="less" scoped>
  @import './index.less';
</style>
