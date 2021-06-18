<template>
  <BasicModal :height="400" v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { WareHouseInfoFormSchema } from './data';

  import { useMessage } from '/@/hooks/web/useMessage';

  import { createWareHouse, updateWareHouse } from '/@/api/wareHouse/wareHouse';

  export default defineComponent({
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const WareHouseId = ref<null | string>(null);

      const { createMessage } = useMessage();

      const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
        labelWidth: 100,
        schemas: WareHouseInfoFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        isUpdate.value ? WareHouseId.value = data.record.WareHouseId : null;
        if (unref(isUpdate)) {
          setFieldsValue({
            Area: [data.record.ProvinceId, data.record.CityId],
            ...data.record
          });
          updateSchema([
            {
              field: 'Area',
              componentProps: {
                disabled: true
              },
            },
            {
              field: 'PId',
              componentProps: {
                disabled: true
              },
            },
          ])
        }else {
          updateSchema([
            {
              field: 'Area',
              componentProps: {
                disabled: false
              },
            },
            {
              field: 'PId',
              componentProps: {
                disabled: false
              },
            },
          ])
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '创建仓库' : '编辑仓库'));

      async function handleSubmit() {
        try {
          let values = await validate();
          const { Area, ...reset } = values;
          setModalProps({ confirmLoading: true });
          let requestMethod: any = createWareHouse;
          let msg = '创建成功';
          let params = {
            ...reset,
            ProvinceId: Area[0],
            CityId:  Area[1],
          };
          if(unref(isUpdate)) {
            requestMethod = updateWareHouse;
            params = {
              WareHouseId: WareHouseId.value,
              WareHouseName: values.WareHouseName
            }
            msg = '修改成功';
          }
          params.BusinessType = 2;
          await requestMethod(params);
          createMessage.success(msg);
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
