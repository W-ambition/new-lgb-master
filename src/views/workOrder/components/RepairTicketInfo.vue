<template>
  <div>
    <a-card :title="title">
      <BasicForm
        @register="register"
        @submit="handleSubmit"
        :showResetButton="isEdit || WorkOrderId.length === 0 ? true : false"
        :showSubmitButton="(!isEdit) || machineDetail.CurrentStatus >= 5 ? false : true"
      >
        <template #Executor="{ model, field }">
          <SelectExecutor
            v-model:value="model[field]"
            :disabled="(!isEdit) || (machineDetail.CurrentStatus >= 5) ? true : false"
            @listernSetFieldsValue="setFields"
            @select="handleSelect"
          />
        </template>
        <template #remarkList v-if="remarkList.length > 0">
          <div class="remark-list-item" v-for="(remarkItem, index) in remarkList" :key="index">
            <span class="remark-list-item-label">{{remarkItem.ExecutorName}}：</span>
            <span>{{remarkItem.Remark}}</span>
          </div>
        </template>
      </BasicForm>
      <Loading :loading="loading" :absolute="false" />
    </a-card>
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs, onMounted, ref, reactive } from 'vue';
  import { Card, message } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { FormSchema } from '/@/components/Table';
  import { Loading } from '/@/components/Loading';
  import SelectExecutor from './SelectExecutor.vue';
  import { getMachineShortInfo, getMachineDetail } from '/@/api/machine/machine';
  import { getWorkOrderDetailByRepair, addWorkOrderByRepair, getWorkOrderLog, updateWorkOrderByRepair } from '/@/api/workOrder/workOrder';
  import { repairSchemas } from './data';
  import { RemarkListItem } from './type';

  const defaultMachineDetail: {CurrentStatus: number} = {
    CurrentStatus: 0,
  }
  export default defineComponent({
    components: {
      BasicForm,
      SelectExecutor,
      Loading,
      [Card.name]: Card
    },
    props: {
      title: {
        type: String,
        default: '维修工单'
      },
      WorkOrderId: {
        type: String,
        default: ''
      },
      isEdit: {
        type: Boolean,
        default: true
      }
    },
    setup(props) {
      const loading = ref<boolean>(false);
      const { WorkOrderId, isEdit } = toRefs(props);
      const remarkList = reactive<RemarkListItem[]>([]);
      const machineDetail = reactive({ ...defaultMachineDetail });
      const [register, { updateSchema, setFieldsValue, resetFields }] = useForm({
        labelWidth: 120,
        schemas: repairSchemas,
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
        if(props.WorkOrderId.length > 0) {
          await getWorkOrderDetail();
          await getRemarkList();
        }else {
          updateSchema([
            {
              field: 'MachineId',
              component: 'ApiSelect',
              componentProps: () => {
                return {
                  placeholder: '请选择终端编号',
                  params: {PageSize: 10000, CurrentPage: 1},
                  api: getMachineShortInfo,
                  allowClear: true,
                  labelField: 'MachineId',
                  valueField: 'MachineId',
                  resultField: 'Records',
                  disabled: false,
                  showSearch: true,
                  filterOption: (input: string, option: any) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                  getPopupContainer: triggerNode => triggerNode.parentNode,
                  onSelect: async (id: string) => {
                    loading.value = true;
                    const response = await getMachineDetail({ MachineId: id });
                    loading.value = false;
                    setFieldsValue({
                      Destination: response.Address,
                    })
                  }
                }
              }
            },
            {
              field: 'CurrentStatus',
              ifShow: false,
            },
          ])
        }
      });
      //获取工单详情
      async function getWorkOrderDetail() {
        try {
          loading.value = true;
          const response = await getWorkOrderDetailByRepair({WorkOrderId: props.WorkOrderId});
          loading.value = false;
          machineDetail.CurrentStatus = response.CurrentStatus;
          let defaultSchema: FormSchema[] = [
            {
              field: 'MachineId',
              label: '终端编号',
              component: 'Input',
              componentProps: {
                disabled: true
              },
            },
          ];
          if(response.CurrentStatus === 5) {
            const resetList: FormSchema[] = [
              {
                field: 'ExecutorPhone',
                component: 'Input',
                label: '联系电话',
                componentProps: {
                  disabled: true
                },
              },
              {
                field: 'Remark',
                component: 'InputTextArea',
                label: '备注',
                ifShow: false
              },
              {
                field: 'CurrentStatus',
                label: '工单状态',
                component: 'Select',
                componentProps: () => {
                  return {
                    disabled: true,
                    options: [
                      { label: '已创建', value: 1 },
                      { label: '执行中', value: 4 },
                      { label: '已完成', value: 5 }
                    ]
                  }
                },
              }
            ];
            defaultSchema = defaultSchema.concat(resetList);
          }
          updateSchema(defaultSchema);
          setFieldsValue({
            MachineId: response.MachineId,
            Destination: response.Destination,
            Executor: response.Executor,
            ExecutorPhone: response.ExecutorPhone,
            CurrentStatus: response.CurrentStatus,
          })
        } catch {}
      }

      //获取备注列表信息
      async function getRemarkList() {
        const params = {
          WorkOrderId: WorkOrderId.value,
          PageIndex: 1,
          PageSize: 10000
        }
        try {
          const response = await getWorkOrderLog(params);
          remarkList.length = 0;
          response.Records.map(item => {
            remarkList.push({
              Remark: item.Remark,
              ExecutorName: item.ExecutorName
            })
          })
        } catch {}
      }

      function setFields(data) {
        setFieldsValue(data)
      }

      function handleSelect(_, option) {
        setFieldsValue({
          ExecutorPhone: option.UserName
        })
      }
      //创建维修工单
      async function create(values) {
        const params = {
          Executor: values.Executor,
          Destination: values.Destination,
          ExecutorPhone: values.ExecutorPhone,
          MachineId: values.MachineId,
          Remark: values.Remark,
        }
        try {
          await addWorkOrderByRepair(params);
          message.success('创建成功');
          return true
        } catch { return false }
      }

      //修改维修工单
      async function update(values) {
        const params = {
          WorkOrderId: WorkOrderId.value,
          Executor: values.Executor,
          ExecutorPhone: values.ExecutorPhone,
          Remark: values.Remark,
          CurrentStatus: values.CurrentStatus
        }
        try {
          await updateWorkOrderByRepair(params);
          message.success('修改成功');
          return true
        } catch { return false }
      }

      async function handleSubmit(values) {
        if(props.WorkOrderId.length === 0) {
          await create(values);
          resetFields();
          handleReset();
        }else{
          if(machineDetail.CurrentStatus === 4) {
            //修改维修工单
            await update(values);
            resetFields();
            handleReset();
            await getWorkOrderDetail();
            await getRemarkList();
          }
        }
      }

      //重置
      async function handleReset() {
        for(let key in machineDetail) {
          machineDetail[key] = defaultMachineDetail[key]
        }
      }

      return {
        register,
        setFields,
        loading,
        isEdit,
        WorkOrderId,
        remarkList,
        handleSelect,
        handleSubmit,
        machineDetail
      }
    }
  })
</script>

<style lang="less" scoped>
  @import './index.less';
</style>
