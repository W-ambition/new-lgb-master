<template>
  <div>
    <PageWrapper
      :contentBackground="true"
    >
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="发给我的">
          <BuyTable
            ref="sentToMeTable"
            :columns="sentToMeColumns"
            :searchFormSchema="sentToMeSearch"
            :IsOwn="false"
            @onActionRecord="goToActionRecord"
          />
        </a-tab-pane>
        <a-tab-pane key="2" tab="我发起的" force-render>
          <BuyTable
            ref="myStartTable"
            :columns="myStartColumns"
            :searchFormSchema="myStartSearch"
            :IsOwn="true"
            @onActionRecord="goToActionRecord"
          />
        </a-tab-pane>
        <template #tabBarExtraContent>
          <a-button type="primary" @click="handleClickAdd">发起购票申请</a-button>
        </template>
      </a-tabs>
      <BuyTicketModal
        @register="registerModal" @success="handleSuccess"
      />
    </PageWrapper>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';

  import BuyTable from './BuyTable.vue';
  import BuyTicketModal from './BuyTicketModal.vue';

  import { getColumns, getSearchFormSchema } from './data';
  export default defineComponent({
    name: 'BuyTicket',
    components: {
      PageWrapper,
      BuyTable,
      BuyTicketModal,
      [Tabs.name]: Tabs,
      [Tabs.TabPane.name]: Tabs.TabPane,
    },
    setup() {
      const activeKey = ref<string>('1');

      const sentToMeTable = ref<ElRef>(null);
      const myStartTable = ref<ElRef>(null);

      const sentToMeColumns = getColumns(1);
      const myStartColumns = getColumns();

      const sentToMeSearch = getSearchFormSchema(1);
      const myStartSearch = getSearchFormSchema();

      const [registerModal, { openModal }] = useModal();

      function handleClickAdd() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function goToActionRecord(e) {
        console.log(e)
      }

      function handleSuccess() {
        console.log(sentToMeTable)
      }

      return {
        activeKey,
        sentToMeColumns,
        myStartColumns,
        sentToMeSearch,
        myStartSearch,
        handleClickAdd,
        goToActionRecord,
        registerModal,
        handleSuccess,
        sentToMeTable,
        myStartTable
      }
    }
  })
</script>
