<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" :showOkBtn="!isSee" :showCancelBtn="!isSee">
    <BasicForm @register="registerForm">
      <template #img="{ model, field }">
        <a-input v-model:value="model[field]" :disabled="isSee" placeholder="请输入彩票批号" />
        <img
          :src="model['LotteryType'] === 2 ? FLotteryBatch : TLotteryBatch"
          mode="scaleToFill"
          class="batchImg"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Input } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { LotteryBatchFormSchema } from './data';

  import { useMessage } from '/@/hooks/web/useMessage';

  import { addLotteryBatch, editLotteryBatch } from '/@/api/lottery/lottery';

  import FLotteryBatch from '/@/assets/images/flcp-lottery-batch.png';
  import TLotteryBatch from '/@/assets/images/tycp-lottery-batch.png';

  export default defineComponent({
    name: 'LotteryBatchModal',
    components: { BasicModal, BasicForm, [Input.name]: Input },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const isSee = ref(false);
      const LotteryBatchId = ref<null | number>(null);

      const { createMessage } = useMessage();

      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: LotteryBatchFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const getTitle = computed(() => unref(isSee) ? '查看批号' : unref(isUpdate) ? '编辑批号' : '新增批号');

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        isSee.value = !!data?.isSee;
        isUpdate.value ? LotteryBatchId.value = data.record.LotteryBatchId : null;
        if (unref(isUpdate) || unref(isSee)) {
          setFieldsValue({
            ...data.record
          });
        }

        updateSchema([
          {
            field: 'LotteryType',
            dynamicDisabled: unref(isUpdate) || unref(isSee)
          },
          {
            field: 'LotteryId',
            dynamicDisabled: unref(isSee)
          },
          {
            field: 'LotteryPackageRuleId',
            dynamicDisabled: unref(isSee)
          },
        ])
      });

      async function handleSubmit() {
        try {
          let values = await validate();
          setModalProps({ confirmLoading: true });
          let requestMethod = addLotteryBatch;
          if(unref(isUpdate)) {
            requestMethod = editLotteryBatch;
            values.LotteryBatchId = LotteryBatchId.value;
          }
          const result = await requestMethod(values);
          createMessage.success(result);
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, handleSubmit, getTitle, FLotteryBatch, TLotteryBatch, isSee };
    },
  });
</script>

<style lang="less" scoped>
  .batchImg {
    width: 355px;
    height: 109px;
  }
</style>
