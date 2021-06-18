<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { LotteryInfoFormSchema } from './data';

  import { useMessage } from '/@/hooks/web/useMessage';

  import { addLottery, editLottery } from '/@/api/lottery/lottery';

  export default defineComponent({
    name: 'LotteryInfoModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const LotteryId = ref<null | number>(null);

      const { createMessage } = useMessage();

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: LotteryInfoFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        isUpdate.value ? LotteryId.value = data.record.LotteryId : null;
        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));

      async function handleSubmit() {
        try {
          let values = await validate();
          setModalProps({ confirmLoading: true });
          values.FrontPic = values.FrontPic[0];
          values.BackPic = values.BackPic[0];
          let requestMethod = addLottery;
          if(unref(isUpdate)) {
            requestMethod = editLottery;
            values.LotteryId = LotteryId.value;
          }
          const result = await requestMethod(values);
          createMessage.success(result);
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
