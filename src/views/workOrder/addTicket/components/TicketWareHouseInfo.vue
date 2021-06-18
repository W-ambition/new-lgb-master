<template>
  <a-list item-layout="horizontal" :data-source="ticketInfo">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-row type="flex" :gutter="18" :style="{width: '100%'}">
          <a-col :span="2">{{item.LotteryType === 1 ? '体彩' : '福彩'}}</a-col>
          <a-col :span="2">{{item.LotteryName}}</a-col>
          <a-col :span="2">{{item.LotteryPrice}}元</a-col>
          <a-col :span="3">票仓容量：{{item.MaxQuantity}}张</a-col>
          <a-col :span="4">{{item.WorkLotteryType === 1 ? '加票' : `换票 更换前票种：${item.LotteryNameBefore}`}}</a-col>
          <a-col :span="3">申请：{{`${item.LotteryCount}张 ${item.PackageCount}包`}}</a-col>
          <a-col v-if="CurrentStatus > 1" :span="3">出库：{{item.ActualLotteryCount}}张</a-col>
          <a-col v-if="CurrentStatus > 1" :span="3">验票成功：{{item.CheckSuccessTicketsQty}}张</a-col>
        </a-row>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { List, Row, Col  } from 'ant-design-vue';
  export default defineComponent({
    name: 'TicketWareHouseInfo',
    components: {
      [List.name]: List,
      [List.Item.name]: List.Item,
      [Col.name]: Col,
      [Row.name]: Row
    },
    props: {
      ticketInfo: {
        type: Array,
        default: () => []
      },
      CurrentStatus: {
        type: Number,
        default: 0
      }
    }
  })
</script>
