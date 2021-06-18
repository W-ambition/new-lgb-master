<template>
  <PageWrapper>
    <a-row type="flex" :gutter="[16,16]">
      <a-col :xs="24" :sm="12" :xl="4" v-for="item in createButton" :key="item.key">
        <a-button :type="active === item.key ? 'primary' : 'default'" @click="handleCreate(item.key)">
          <template #icon><PlusOutlined /></template>
          {{item.name}}
        </a-button>
      </a-col>
    </a-row>
    <div class="create-content">
      <AddTicketInfo v-if="active === '1'" title="创建加票工单" />
      <RepairTicketInfo v-else-if="active === '2'" title="创建维修工单" />
      <MachineOutOfWarehouseInfo v-else-if="active === '3'" title="创建机器出库工单" />
      <MachineReturnToWarehouseInfo v-else-if="active === '4'" title="创建机器返库工单" />
      <Refund v-else-if="active === '5'" title="退款工单" />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { Row, Col, Button } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { PageWrapper } from '/@/components/Page';
  import AddTicketInfo from '../components/AddTicketInfo.vue';
  import RepairTicketInfo from '../components/RepairTicketInfo.vue';
  import MachineReturnToWarehouseInfo from '../components/MachineReturnToWarehouseInfo.vue';
  import MachineOutOfWarehouseInfo from '../components/MachineOutOfWarehouseInfo.vue';
  import Refund from '../components/Refund.vue';

  interface buttonItem {
    key: string;
    name: string;
  }
  export default defineComponent({
    name: 'CreateWorkOrder',
    components: {
      PageWrapper,
      PlusOutlined,
      AddTicketInfo,
      RepairTicketInfo,
      MachineReturnToWarehouseInfo,
      MachineOutOfWarehouseInfo,
      Refund,
      [Row.name]: Row,
      [Col.name]: Col,
      [Button.name]: Button
    },
    setup() {
      const active = ref<string>('');
      const createButton = reactive<buttonItem[]>([
        { key: '1', name: '创建加票工单' },
        { key: '2', name: '创建维修工单' },
        { key: '3', name: '机器出库工单' },
        { key: '4', name: '机器返库工单' },
        { key: '5', name: '退款工单' },
      ]);

      function handleCreate(type) {
        active.value = type;
      }

      return {
        active,
        createButton,
        handleCreate
      };
    },
  });
</script>

<style lang="less" scoped>
  .create-content {
    margin-top: 40px;
  }
</style>
