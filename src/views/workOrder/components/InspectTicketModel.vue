<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :showCancelBtn="false"
    :showOkBtn="false"
    :minHeight="600"
    :loading="loading"
  >
    <div v-if="type === 'success'">
      <Collapse expandIconPosition="right" @change="handleChange">
        <CollapsePanel v-for="item in successListData" :key="item.PackageNo">
          <template #header>
            <Row type="flex" justify="space-between">
              <Col :span="12">包号：{{item.PackageNo}}</Col>
              <Col :span="12" :style="{textAlign: 'right'}">{{item.SuccessQty}}张</Col>
            </Row>
          </template>
          <Row type="flex" class="collapse-panel-item" justify="space-between" align="middle" v-for="ticketItem in item.TicketList" :key="ticketItem.TicketId">
            <Col :span="12">{{ticketItem.TicketId}}</Col>
            <Col :span="12" :style="{textAlign: 'right'}">{{ticketItem.EndTime}}</Col>
          </Row>
        </CollapsePanel>
      </Collapse>
    </div>
    <div v-if="type === 'error'">
      <List
        item-layout="horizontal"
        :pagination="errorPagination"
        :data-source="errorListData"
      >
        <template #renderItem="{ item }">
          <ListItem>
            <ListItemMeta
              :description="item.EndTime"
            >
              <template #title>
                <div>{{ item.ErrorRemak }}</div>
              </template>
              <template #avatar>
                <ImagePreview class="ticket-img" :imageList="[item.Pic]" />
              </template>
            </ListItemMeta>
          </ListItem>
        </template>
      </List>
    </div>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, reactive } from 'vue';
  import { List, Collapse, Row, Col } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { ImagePreview } from '/@/components/Preview/index';
  import { getFailureTickets, getSuccessPackages, getSuccessTickets } from '/@/api/workOrder/workOrder';

  interface ErrorListDataItem {
    Pic: string;
    EndTime: string;
    ErrorRemak: string;
  }

  interface TicketListItem {
    TicketId: string;
    EndTime: string;
  }

  interface SuccessListDataItem {
    PackageNo: string;
    SuccessQty: number;
    TicketList: TicketListItem[]
  }

  export default defineComponent({
    name: 'InspectTicketModel',
    components: {
      BasicModal,
      List,
      ListItem: List.Item,
      ListItemMeta: List.Item.Meta,
      ImagePreview,
      Collapse,
      CollapsePanel: Collapse.Panel,
      Row,
      Col,
    },
    emits: ['success', 'register'],
    setup() {
      const LotteryName = ref<string>('');
      const MachineHeadId = ref<string>('');
      const WorkOrderId = ref<string>('');
      const type = ref<string>('success');
      const loading = ref<boolean>(false);
      const errorListData = reactive<ErrorListDataItem[]>([]);

      const successListData = reactive<SuccessListDataItem[]>([]);

      const errorPagination = reactive({
        onChange: (page: number) => {
          getFailList({PageIndex: page});
        },
        pageSize: 10,
        current: 1,
        size: 'small',
        hideOnSinglePage: true,
        total: 0
      });

      const getTitle = computed(() => {
        let title = '';
        if(type.value === 'success') {
          title = `${LotteryName.value}验票记录`;
        }else if(type.value === 'error') {
          title = '验票失败记录';
        }
        return title;
      });

      const [registerModal, { setModalProps }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
        LotteryName.value = data.LotteryName;
        MachineHeadId.value = data.MachineHeadId;
        WorkOrderId.value = data.WorkOrderId;
        type.value = data.type;
        if(data.type === 'success') {
          await getSuccessList();
        }else if(data.type === 'error') {
          await getFailList({PageIndex: 1});
        }
      });

      async function getFailList(values={}) {
        const params = {
          WorkOrderId: WorkOrderId.value,
          PageIndex: errorPagination.current,
          PageSize: errorPagination.pageSize,
          ...values
        }
        try {
          loading.value = true;
          const response = await getFailureTickets(params);
          loading.value = false;
          errorListData.length = 0;
          response.Records.map(item => {
            errorListData.push({
              EndTime: item.EndTime ? item.EndTime.replace('T', ' ') : '',
              ErrorRemak: item.ErrorRemak,
              Pic: item.Pic
            })
          });
          errorPagination.current = params.PageIndex;
          errorPagination.total = response.TotalCount;
        } catch {}
      }

      async function getSuccessList() {
        const params = {
          MachineHeadId: MachineHeadId.value,
          WorkOrderId: WorkOrderId.value
        }
        try {
          loading.value = true;
          const response = await getSuccessPackages(params);
          loading.value = false;
          successListData.length = 0;
          response.map(item => {
            successListData.push({
              ...item,
              TicketList: []
            })
          })
        }catch {}
      }

      async function getSuccessTicketList(data={}, index) {
        const params = {
          MachineHeadId: MachineHeadId.value,
          WorkOrderId: WorkOrderId.value,
          ...data
        }
        try {
          loading.value = true;
          const response = await getSuccessTickets(params);
          loading.value = false;
          successListData[index].TicketList.length = 0;
          response.map(item => {
            successListData[index].TicketList.push({
              TicketId: item.TicketId,
              EndTime: item.EndTime ? item.EndTime.replace("T", " ") : ""
            })
          })
        } catch {}
      }

      async function handleChange(activeArr) {
        if(activeArr.length > 0) {
          const active = activeArr[activeArr.length - 1];
          const index = successListData.findIndex(item => item.PackageNo === active);
          if(successListData[index].TicketList.length === 0) {
            await getSuccessTicketList({ PackageNo: active }, index)
          }
        }
      }

      return { registerModal, getTitle, type, errorListData, errorPagination, successListData, handleChange, loading };
    },
  });
</script>

<style lang="less" scoped>
  .ticket-img {
    width: 152px;
    height: 85px;
    cursor: pointer;
  }

  .collapse-panel-item {
    height: 40px;
    border-bottom: 1px solid rgb(228, 223, 223);
  }
</style>
