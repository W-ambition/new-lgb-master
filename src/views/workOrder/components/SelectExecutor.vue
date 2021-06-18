<template>
  <a-row type="flex" :gutter="12">
    <a-col :span="14" v-if="type === 1">
      <ApiSelect
        :api="getUserDic"
        placeholder="请选择实施者"
        labelField='ActualName'
        valueField='UserId'
        showSearch
        :allowClear="true"
        :filterOption= "filterOption"
        v-bind="$attrs"
        :disabled="disabled"
        v-on="$listeners"
      />
    </a-col>
    <a-col :span="14" v-else>
      <a-select
        placeholder="请输入11位手机号码"
        labelField='ActualName'
        valueField='UserId'
        showSearch
        :allowClear="true"
        :filterOption= "false"
        :options="userDic"
        @search="handleSearch"
        v-bind="$attrs"
        :disabled="disabled"
        v-on="$listeners"
      />
    </a-col>
    <a-col :span="8" v-if="!disabled">
      <a-button type="primary" @click="handleClick">{{ type === 1 ? '根据电话号码指定' : '正常选择' }}</a-button>
    </a-col>
  </a-row>
</template>

<script lang="ts">
  import { defineComponent, ref, unref, reactive, toRefs } from 'vue';
  import { ApiSelect } from '/@/components/Form/index';
  import { Row, Col, Select } from 'ant-design-vue';
  import { getUserDic, getUserDetail } from '/@/api/staff/staff';
  import { isPhone } from '/@/utils/is';
  export default defineComponent({
    components: {
      ApiSelect,
      [Row.name]: Row,
      [Col.name]: Col,
      [Select.name]: Select
    },

    props: {
      disabled: {
        type: Boolean,
        default: false
      }
    },

    setup(props, { emit }) {
      const type = ref<number>(1);
      const isLoading = ref<boolean>(false);
      const { disabled } = toRefs(props);
      const userDic = reactive([]);

      console.log(disabled)

      function handleClick() {
        type.value = unref(type) === 1 ? 2 : 1;
        userDic.length = 0;
        console.log(props)
        emit('listernSetFieldsValue', { Executor: undefined, ExecutorPhone: undefined })
      }

      function filterOption(input: string, option: any) {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }

      async function handleSearch(value: string) {
        const isFeach = isPhone(value);
        if(!isFeach) {
          userDic.length = 0;
        }
        if (isFeach && (!unref(isLoading))) {
          isLoading.value = true;
          const response = await getUserDetail({ UserName: value });
          isLoading.value = false;
          userDic.length = 0;
          if(response) {
            userDic.push({
              value: response.UserId,
              label: response.ActualName,
              ...response
            })
          }
        }
      }

      return {
        type,
        userDic,
        getUserDic,
        disabled,
        handleClick,
        filterOption,
        handleSearch
      }
    }
  })
</script>
