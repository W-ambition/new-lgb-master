<template>
  <div>
    <a-card :title="title">
      <BasicForm
        @register="register"
        @submit="handleSubmit"
        :showResetButton="isEdit || (WorkOrderId.length === 0) ? true : false"
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
        <template #address="{ model, field }">
          <a-row type="flex" :gutter="16">
            <a-col :span="14">
              <a-input v-model:value="model[field]" />
            </a-col>
            <a-col :span="8">
              <a-button type="primary" >获取经纬度</a-button>
            </a-col>
          </a-row>
        </template>
        <template #map>
          <div id="container"></div>
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
  import { Card, message, Input, Row, Col } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { FormSchema } from '/@/components/Table';
  import { Loading } from '/@/components/Loading';
  import SelectExecutor from './SelectExecutor.vue';
  // import { getMachineShortInfo, getMachineDetail } from '/@/api/machine/machine';
  import { getWareHouseList } from '/@/api/wareHouse/wareHouse';
  import { getWorkOrderDetailByMachineOut, addWorkOrderByMachineOut, getWorkOrderLog, updateWorkOrderByMachineOut } from '/@/api/workOrder/workOrder';
  import { machineOutSchemas } from './data';
  import { RemarkListItem } from './type';

  const defaultMachineDetail: {CurrentStatus: number} = {
    CurrentStatus: 0,
  }
  export default defineComponent({
    components: {
      BasicForm,
      SelectExecutor,
      Loading,
      [Card.name]: Card,
      [Input.name]: Input,
      [Row.name]: Row,
      [Col.name]: Col
    },
    props: {
      title: {
        type: String,
        default: '机器出库工单'
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
        schemas: machineOutSchemas,
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
          const response = await getWorkOrderDetailByMachineOut({WorkOrderId: props.WorkOrderId});
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
          if(response.CurrentStatus >= 4) {
            defaultSchema.push({
              field: 'WareHouseId',
              component: 'ApiSelect',
              label: '仓库',
              colProps: {
                span: 24
              },
              componentProps: () => {
                return {
                  placeholder: '请选择仓库',
                  params: {PageSize: 10000, PageIndex: 1, BusinessType: 1},
                  api: getWareHouseList,
                  allowClear: true,
                  labelField: 'WareHouseName',
                  valueField: 'WareHouseId',
                  resultField: 'Records',
                  disabled: true,
                  showSearch: true,
                  filterOption: (input: string, option: any) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                  getPopupContainer: triggerNode => triggerNode.parentNode,
                }
              },
              required: true
            })
          }
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
            MerchantName: response.MerchantName,
            Executor: response.Executor,
            ExecutorPhone: response.ExecutorPhone,
            WareHouseId: response.WareHouseId,
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
      //创建机器返库工单
      async function create(values) {
        const params = {
          Executor: values.Executor,
          Destination: values.Destination,
          ExecutorPhone: values.ExecutorPhone,
          MachineId: values.MachineId,
          WareHouseId: values.WareHouseId,
          Remark: values.Remark,
        }
        try {
          await addWorkOrderByMachineOut(params);
          message.success('创建成功');
          return true
        } catch { return false }
      }

      //修改机器返库工单
      async function update(values) {
        const params = {
          WorkOrderId: WorkOrderId.value,
          Executor: values.Executor,
          ExecutorPhone: values.ExecutorPhone,
          Remark: values.Remark,
          CurrentStatus: values.CurrentStatus
        }
        try {
          await updateWorkOrderByMachineOut(params);
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
            //修改机器返库工单
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

  #container {
    width: 80%;
    height: 300px;
    margin: 10px 0;
  }
</style>
