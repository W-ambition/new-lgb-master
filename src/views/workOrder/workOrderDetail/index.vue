<template>
  <div>
    <AddTicketInfo v-if="WorkOrderType === 101 || WorkOrderType === 102" :WorkOrderId="WorkOrderId" :isEdit="isEdit" />
    <RepairTicketInfo v-else-if="WorkOrderType === 7" :WorkOrderId="WorkOrderId" :isEdit="isEdit" />
    <MachineReturnToWarehouseInfo v-else-if="WorkOrderType === 4" :WorkOrderId="WorkOrderId" :isEdit="isEdit" />
    <MachineReturnToWarehouseInfo v-else-if="WorkOrderType === 11" :WorkOrderId="WorkOrderId" :isEdit="isEdit" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, unref, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import AddTicketInfo from '../components/AddTicketInfo.vue';
  import RepairTicketInfo from '../components/RepairTicketInfo.vue';
  import MachineReturnToWarehouseInfo from '../components/MachineReturnToWarehouseInfo.vue';
  import MachineOutOfWarehouseInfo from '../components/MachineOutOfWarehouseInfo.vue';
  export default defineComponent({
    name: 'WorkOrderDetail',
    components: { AddTicketInfo, RepairTicketInfo, MachineReturnToWarehouseInfo, MachineOutOfWarehouseInfo },
    setup() {
      const { currentRoute } = useRouter();
      const { query } = unref(currentRoute);
      const WorkOrderId = ref<string>(String(query.WorkOrderId));
      const WorkOrderType = ref<number>(Number(query.WorkOrderType));
      const isEdit: boolean = String(query.actionType) === 'see' ? false : true;
      return {
        WorkOrderType,
        WorkOrderId,
        isEdit
      }
    }
  })
</script>
