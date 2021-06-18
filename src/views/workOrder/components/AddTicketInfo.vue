<template>
  <div>
    <a-card :title="title">
      <BasicForm
        @register="register"
        @submit="handleSubmit"
        :showResetButton="WorkOrderId.length === 0 ? true : false"
        :showSubmitButton="(machineDetail.CurrentStatus === 4 && machineDetail.IsOpened === 1) || machineDetail.CurrentStatus >= 5 ? false : true"
        :showActionButtonGroup="showActionButtonGroup"
      >
        <template #Executor="{ model, field }">
          <SelectExecutor
            v-model:value="model[field]"
            :disabled="(!isEdit) || (machineDetail.CurrentStatus >= 5 || machineDetail.IsOpened === 1) ? true : false"
            @listernSetFieldsValue="setFields"
            @select="handleSelect"
          />
        </template>
        <template #header>
          <a-row type="flex" :gutter="[16, 16]">
            <a-col
              v-for="headItem in machineHeaderList"
              :key="headItem.MachineHeadId"
              :xl="12"
              :sm="24"
              :xs="24"
            >
              <a-card
                :title="'票仓名称：'+headItem.MachineHeadName"
                :style="{backgroundColor: 'rgb(245, 245, 245)'}"
              >
                <template #extra>
                  <div class="card-extra" v-if="machineDetail.BusinessType === 2 && machineDetail.IsAutoCheckTicket === 1">
                    <div class="card-extra-lottery-type">{{machineDetail.LotteryType === 1 ? '体彩 - ' : machineDetail.LotteryType === 2 ? '福彩 - ' : '未设置-'}}</div>
                    <div>{{WorkOrderId.length === 0 ? headItem.LotteryName : headItem.WorkLotteryLotteryName}}</div>
                    <div :style="{marginLeft: '10px'}">
                      <a-popover trigger="click">
                        <template #content>
                          <div class="tip-color">所有票种销售完，才可更换其他票种</div>
                        </template>
                        <InfoCircleOutlined class="tip-color" />
                      </a-popover>
                    </div>
                  </div>
                  <div class="card-extra" v-else>
                    <div class="card-extra-lottery-type">{{machineDetail.LotteryType === 1 ? '体彩 - ' : machineDetail.LotteryType === 2 ? '福彩 - ' : '未设置-'}}</div>
                    <ApiSelect
                      :api="getLotteryList"
                      :isLoadOnce="true"
                      :params="{LotteryType: machineDetail.LotteryType}"
                      placeholder="请选择彩种"
                      :disabled="isEdit || (machineDetail.CurrentStatus === 1) ? false : true"
                      :style="{width: '120px'}"
                      labelField='LotteryName'
                      valueField='LotteryId'
                      v-model:value="headItem.NewLotteryId"
                      @change="handleChangeLottery($event, headItem.MachineHeadId)"
                      showSearch
                      :filterOption= "filterOption"
                    />
                  </div>
                </template>
                <a-card-grid style="width: 100%;" :hoverable="false">
                  <div class="card-line">
                    <div class="card-line-label">票仓容量：</div>
                    <div class="card-line-value">
                      {{headItem.MaxQuantity}}张
                    </div>
                  </div>
                </a-card-grid>
                <a-card-grid style="width: 100%;" :hoverable="false" v-if="WorkOrderId.length === 0">
                  <div class="card-line">
                    <div class="card-line-label">申请数量：</div>
                    <div class="card-line-value">
                      <span>
                        <a-input-number :style="{width: '40px'}" :min="0" :max="parseInt((headItem.MaxQuantity-headItem.TicketQuantity) / headItem.LotteryPackageNum)" v-model:value="headItem.PackageCount" />
                        <span>包</span>
                      </span>
                      <div>
                        每包 <a-select :style="{width: '80px'}" v-model:value="headItem.LotteryPackageNum" :options="headItem.LotteryPackageNumsList" /> 张
                      </div>
                      <div>共<span class="tip-color">{{headItem.LotteryPackageNum * headItem.PackageCount}}</span>张</div>
                    </div>
                  </div>
                </a-card-grid>
                <template v-else>
                  <a-card-grid style="width: 100%;" :hoverable="false">
                    <div class="card-line">
                      <div class="card-line-label">申请数量：</div>
                      <div class="card-line-value card-line-value-horizontal">
                        {{headItem.WorkLotteryPackageCount}}包，共<span class="tip-color">{{headItem.WorkLotteryLotteryCount}}</span>张
                      </div>
                    </div>
                  </a-card-grid>
                  <a-card-grid style="width: 100%;" :hoverable="false" v-if="machineDetail.CurrentStatus === 1">
                    <div class="card-line">
                      <div class="card-line-label">库存数量：</div>
                      <div class="card-line-value card-line-value-horizontal">
                        <span class="tip-color">{{headItem.InventoryNum}}</span>张
                      </div>
                    </div>
                  </a-card-grid>
                  <a-card-grid style="width: 100%;" :hoverable="false">
                    <div class="card-line">
                      <div class="card-line-label">出库数量：</div>
                      <div class="card-line-value card-line-value-horizontal">
                        <span class="tip-color">{{headItem.ApplicationCount}}</span>张
                      </div>
                    </div>
                  </a-card-grid>
                  <a-card-grid style="width: 100%;" :hoverable="false">
                    <div class="card-line">
                      <div class="card-line-label">扫描包号：</div>
                      <div class="card-line-value card-line-value-vertical" v-if="machineDetail.CurrentStatus === 1">
                        <a-input class="scan-input" v-model:value="headItem.ScanValue" @pressEnter="handleScan($event, headItem.MachineHeadId, headItem.NewLotteryId)" placeholder="请扫描包号" allowClear />
                        <span class="tip-color">手动输入时按Enter键结束输入</span>
                        <div v-for="scanItem in headItem.WorkAcceptLotteryDetails" :key="scanItem.StockDetailName">
                          <div class="scan-result-item" v-if="!scanItem.IsEdit">
                            <span>{{scanItem.StockDetailName}}({{scanItem.LotteryCount}})</span>
                            <EditOutlined @click="handleActionNum(headItem.MachineHeadId, scanItem.StockDetailName, 'edit')" class="scan-result-item-icon" />
                            <CloseOutlined @click="handleDeleteNum(headItem.MachineHeadId, scanItem.StockDetailName)" class="scan-result-item-icon" />
                          </div>
                          <div class="scan-result-item" v-else>
                            <span>{{scanItem.StockDetailName}}</span>
                            <a-input v-model:value="scanItem.EditLotteryCount" :style="{width: '60px', height: '80%', margin: '0 10px'}" />
                            <span>张</span>
                            <span class="action-btn action-btn-cancel" @click="handleActionNum(headItem.MachineHeadId, scanItem.StockDetailName, 'cancel')">取消</span>
                            <span class="action-btn action-btn-ok" @click="handleActionNum(headItem.MachineHeadId, scanItem.StockDetailName, 'ok')">确定</span>
                          </div>
                        </div>
                      </div>
                      <div class="card-line-value card-line-value-grid" v-else>
                        <div class="card-line-value-grid-item" v-for="scanItem in headItem.WorkOrderGetLotteryDetailMachineHeadLotterys" :key="scanItem.StockDetailName">
                          <div class="scan-result-item">
                            <span>{{scanItem.StockDetailName}}({{scanItem.DetailQuantity}})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a-card-grid>
                </template>
                <a-card-grid style="width: 100%;" :hoverable="false" v-if="machineDetail.CurrentStatus === 5 && machineDetail.IsAutoCheckTicket === 1">
                  <div class="card-line">
                    <div class="card-line-label">验票成功：</div>
                    <div class="card-line-value card-line-value-horizontal curson-pointer" @click="handleSeeInspectTicketSuccessLog(headItem.MachineHeadId, headItem.LotteryName)">
                      <span>共<span class="tip-color">{{headItem.CheckSuccessTicketsQty}}</span>张</span>
                      <RightOutlined class="card-line-icon" />
                    </div>
                  </div>
                </a-card-grid>
                <a-card-grid style="width: 100%;" :hoverable="false">
                  <a-row type="flex" justify="space-between">
                    <a-col :span="12">票仓余票：{{headItem.TicketQuantity}}张</a-col>
                    <a-col :span="12" :style="{textAlign: 'right'}">{{headItem.LotteryName}}（{{headItem.LotteryPrice}}元）</a-col>
                  </a-row>
                </a-card-grid>
              </a-card>
            </a-col>
          </a-row>
        </template>
        <template #errorTicket v-if="machineDetail.CurrentStatus === 5 && machineDetail.IsAutoCheckTicket === 1">
          <div class="card-line card-line-outside">
            <div class="card-line-label">验票失败：</div>
            <div class="card-line-value card-line-value-horizontal curson-pointer" @click="handleSeeInspectTicketErrorLog">
              <span>共<span class="tip-color">{{machineDetail.CheckFailureTicketsQty}}</span>张</span>
              <RightOutlined class="card-line-icon" />
            </div>
          </div>
        </template>
        <template #remarkList v-if="remarkList.length > 0">
          <div class="remark-list-item" v-for="(remarkItem, index) in remarkList" :key="index">
            <span class="remark-list-item-label">{{remarkItem.ExecutorName}}：</span>
            <span>{{remarkItem.Remark}}</span>
          </div>
        </template>
        <template #submitBefore v-if="machineDetail.CurrentStatus === 1 && machineDetail.BusinessType === 1">
          <a-button color="error" :style="{marginRight: '8px'}" @click="handleDelete">删除</a-button>
        </template>
        <template #submitBefore v-else-if="machineDetail.CurrentStatus === 4 && machineDetail.BusinessType === 1 && machineDetail.IsOpened === 0">
          <a-button color="error" :style="{marginRight: '8px'}" @click="handleStop">终止</a-button>
        </template>
        <template #submitBefore v-else-if="machineDetail.CurrentStatus === 4 && machineDetail.IsOpened === 1">
          <a-button :style="{marginRight: '8px'}" @click="handleFinish">完成工单</a-button>
        </template>
        <template #submitBefore v-else-if="machineDetail.CurrentStatus === 5 && machineDetail.IsAutoCheckTicket === 1 && machineDetail.CheckTicketStatus !== 1">
          <a-button v-if="machineDetail.CheckTicketStatus === 0" color="error" :style="{marginRight: '8px'}" @click="handleUpdateInspectTicket(2)">停止验票</a-button>
          <a-button v-else-if="machineDetail.CheckTicketStatus === 2" color="error" :style="{marginRight: '8px'}" @click="handleUpdateInspectTicket(0)">继续验票</a-button>
          <a-button :style="{marginRight: '8px'}" @click="handleUpdateInspectTicket(1)">完成验票</a-button>
        </template>
      </BasicForm>
      <Loading :loading="loading" :absolute="false" />
    </a-card>
    <InspectTicketModel  @register="registerModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, onMounted, ref, computed, toRefs } from 'vue';
  import { Card, Row, Col, Popover, InputNumber, Select, Input, message } from 'ant-design-vue';
  import { InfoCircleOutlined, EditOutlined, CloseOutlined, RightOutlined } from '@ant-design/icons-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useModal } from '/@/components/Modal';
  import { ApiSelect } from '/@/components/Form/index';
  import SelectExecutor from './SelectExecutor.vue';
  import { Loading } from '/@/components/Loading';
  import InspectTicketModel from './InspectTicketModel.vue';
  import { transitionStateByWoreOrder, transitionStateByLogistics, transitionStateByCheckTicket } from '/@/utils/status';
  import { FormSchema } from '/@/components/Table';
  import { getMachineShortInfo, getMachineDetail } from '/@/api/machine/machine';
  import { MachineHeader } from '/@/api/machine/model/machineModel';
  import { workAddLotteries, AddWorkOrderByLotteryParams, WorkOrderGetLotteryDetailMachineHeadsItem, ExecuteWorkOrderByLotteryParams, WorkAcceptLotterysItem, UpdateWorkOrderByLotteryParams } from '/@/api/workOrder/model/workOrderModel';
  import { addWorkOrderByLottery, getWorkOrderDetailByLottery, executeWorkOrderByLottery, deleteWorkOrder, updateWorkOrderByLottery, getWorkOrderLog, completeWorkOrderByLottery, updateCheckTickets } from '/@/api/workOrder/workOrder';
  import { getUserDic } from '/@/api/staff/staff';
  import { getLotteryList, getLotteryDetailByWareHouseId, checkLotteryInWoreHouse } from '/@/api/lottery/lottery';
  import { schemas } from './data';
  import { RemarkListItem } from './type';

  interface selectOptionItem {
    label: string | number;
    value: number | string;
    disabled?: boolean;
    title?: string;
    key?: number | string;
  }

  interface MachineHeaderItem extends MachineHeader {
    LotteryPackageNumsList: selectOptionItem[];
    NewLotteryId: number;
    PackageCount: number;
    LotteryPackageNum: number;
    InventoryNum: number;
    ApplicationCount: number;
  }

  interface WorkAcceptLotteryDetailsItem {
    StockDetailName: string;
    LotteryCount: number;
    IsEdit: boolean;
    EditLotteryCount: number;
  }

  interface WorkOrderGetLotteryDetailMachineHeadLotterys {
    WorkLotteryDetailId: number;
    MachineHeadId: string;
    StockDetailId: string;
    StockDetailName: string;
    DetailQuantity: number;
  }

  interface MachineHeaderItemByWorkOrder extends WorkOrderGetLotteryDetailMachineHeadsItem {
    NewLotteryId: number;
    InventoryNum: number;
    ApplicationCount: number;
    ScanValue: any;
    WorkAcceptLotteryDetails: WorkAcceptLotteryDetailsItem[];
    WorkOrderGetLotteryDetailMachineHeadLotterys: WorkOrderGetLotteryDetailMachineHeadLotterys[];
  }

  interface MachineDetailParams {
    BusinessType: number;
    LotteryType: number;
    IsAutoCheckTicket: number;
    CheckTicketStatus: number;
    WareHouseId: string;
    CurrentStatus: number;
    IsOpened: number;
    CheckFailureTicketsQty: number;
    getMachineDetailMachineHeads: MachineHeaderItem[];
    WorkOrderGetLotteryDetailMachineHeads: MachineHeaderItemByWorkOrder[];
  }

  const defaultMachineDetail: MachineDetailParams = {
    LotteryType: 0,
    BusinessType: 0,
    IsAutoCheckTicket: 0,
    CheckTicketStatus: 0,
    WareHouseId: '',
    CurrentStatus: 0,
    IsOpened: 0,
    CheckFailureTicketsQty: 0,
    getMachineDetailMachineHeads: [],
    WorkOrderGetLotteryDetailMachineHeads: []
  }

  export default defineComponent({
    components: {
      BasicForm ,
      [Card.name]: Card,
      [Card.Grid.name]: Card.Grid,
      [Row.name]: Row,
      [Col.name]: Col,
      [InputNumber.name]: InputNumber,
      [Input.name]: Input,
      [Select.name]: Select,
      [Popover.name]: Popover,
      ApiSelect,
      SelectExecutor,
      InfoCircleOutlined,
      Loading,
      EditOutlined,
      CloseOutlined,
      RightOutlined,
      InspectTicketModel
    },
    props: {
      title: {
        type: String,
        default: '加票工单'
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
      const machineDetail = reactive<MachineDetailParams>({
        ...defaultMachineDetail
      });
      const remarkList = reactive<RemarkListItem[]>([]);
      const { WorkOrderId, isEdit } = toRefs(props);
      const [registerModal, { openModal }] = useModal();
      const [register, { setProps, updateSchema, setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 120,
        schemas,
        actionColOptions: {
          offset: 8,
          span: 6,
        },
        submitButtonOptions: {
          text: '提交',
        },
        resetFunc: handleReset
      });

      const machineHeaderList = computed(() => props.WorkOrderId ? machineDetail.WorkOrderGetLotteryDetailMachineHeads : machineDetail.getMachineDetailMachineHeads);
      const showActionButtonGroup = computed(() => {
        return (!isEdit.value) || (machineDetail.CurrentStatus >= 5 && machineDetail.IsAutoCheckTicket === 0) ? false : true;
      })

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
                    machineDetail.LotteryType = response.LotteryType;
                    machineDetail.BusinessType = response.BusinessType;
                    machineDetail.IsAutoCheckTicket = response.IsAutoCheckTicket;
                    machineDetail.WareHouseId = response.TicketWareHouseId;
                    let getMachineDetailMachineHeads: MachineHeaderItem[] = [];
                    for(let i = 0; i < response.getMachineDetailMachineHeads.length; i++) {
                      let item = response.getMachineDetailMachineHeads[i];
                      let LotteryPackageNumsList: selectOptionItem[] = [];
                      let StockQuantity: number = 0;
                      try {
                        const LotteryInfo = await getLotteryPackageNums(item.LotteryId);
                        LotteryPackageNumsList = LotteryInfo.LotteryPackageNumsList;
                        StockQuantity = LotteryInfo.StockQuantity;
                      } catch {}
                      getMachineDetailMachineHeads.push({
                        ...item,
                        NewLotteryId: item.LotteryId,
                        PackageCount: 0,
                        InventoryNum: StockQuantity,
                        ApplicationCount: 0,
                        LotteryPackageNum: LotteryPackageNumsList[0] ? Number(LotteryPackageNumsList[0].value) : 0,
                        LotteryPackageNumsList
                      })
                    }

                    machineDetail.getMachineDetailMachineHeads = getMachineDetailMachineHeads;
                    const wareHouseType = response.BusinessType === 1 ? '自建仓库' : response.BusinessType === 2 ? '物流仓库' : '-';
                    setFieldsValue({
                      Destination: response.Address,
                      WareHouseName: `${response.TicketWareHouseName}(${wareHouseType})`
                    })
                    isCheckTicket(response.IsAutoCheckTicket, response.UncheckedBoxQty, false);
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

      //获取当前彩种所有规则下的每包张数
      async function getLotteryPackageNums(LotteryId: number) {
        let list: selectOptionItem[] = [];
        const response = await getLotteryDetailByWareHouseId({ LotteryId, WareHouseId: machineDetail.WareHouseId});
        if(response && response.LotteryDetails && response.LotteryDetails.LotteryPackageRuleList) {
          response.LotteryDetails.LotteryPackageRuleList.map(item => {
            list.findIndex(d => d.value === item.PackageQuantity) === -1 ?
            list.push({
              label: item.PackageQuantity,
              value: item.PackageQuantity
            }) : null;
          })
          list.sort((a, b) => Number(a.value) - Number(b.value));
        }
        return {
          LotteryPackageNumsList: list,
          StockQuantity: response.StockQuantity || 0
        };
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

      // 获取加票工单详情
      async function getWorkOrderDetail() {
        try {
          loading.value = true;
          const response = await getWorkOrderDetailByLottery({WorkOrderId: props.WorkOrderId});
          loading.value = false;
          machineDetail.LotteryType = response.LotteryType;
          machineDetail.BusinessType = response.SubType;
          machineDetail.IsAutoCheckTicket = response.IsAutoCheckTicket;
          machineDetail.CheckTicketStatus = response.CheckTicketStatus;
          machineDetail.WareHouseId = response.WareHouseId;
          machineDetail.CurrentStatus = response.CurrentStatus;
          machineDetail.IsOpened = response.IsOpened;
          machineDetail.CheckFailureTicketsQty = response.CheckFailureTicketsQty;
          let WorkOrderGetLotteryDetailMachineHeads: MachineHeaderItemByWorkOrder[] = [];
          for(let i = 0; i < response.WorkOrderGetLotteryDetailMachineHeads.length; i++) {
            let item = response.WorkOrderGetLotteryDetailMachineHeads[i];
            WorkOrderGetLotteryDetailMachineHeads.push({
              ...item,
              NewLotteryId: item.WorkLotteryLotteryId,
              InventoryNum: item.WorkLotteryPackageQuantity * item.StockPackageCount,
              ApplicationCount: 0,
              ScanValue: undefined,
              WorkAcceptLotteryDetails: [],
              WorkOrderGetLotteryDetailMachineHeadLotterys: item.WorkOrderGetLotteryDetailMachineHeadLotterys
            })
          }
          machineDetail.WorkOrderGetLotteryDetailMachineHeads = WorkOrderGetLotteryDetailMachineHeads;
          const wareHouseType = response.SubType === 1 ? '自建仓库' : response.SubType === 2 ? '物流仓库' : '-';
          let defaultSchema: FormSchema[] = [
            {
              field: 'MachineId',
              label: '终端编号',
              component: 'Input',
              componentProps: {
                disabled: true
              },
            },
            {
              field: 'CurrentStatus',
              label: '工单状态',
              component: 'Input',
              ifShow: true,
            },
          ];
          if(response.SubType === 2) {
            defaultSchema.push({
              field: 'SubStatus',
              ifShow: true,
              component: 'Input',
              label: '物流状态',
            })
          }
          if(response.IsAutoCheckTicket === 1) {
            defaultSchema.push({
              field: 'CheckTicketStatus',
              ifShow: true,
              component: 'Input',
              label: '验票状态',
            })
          }
          if(response.CurrentStatus === 4 && response.IsOpened === 1) {
            defaultSchema.push({
              field: 'ExecutorPhone',
              componentProps: {
                disabled: true
              },
              component: 'Input',
              label: '联系电话',
            })
          }
          if(response.CurrentStatus >= 5) {
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
              }
            ];
            if(response.IsAutoCheckTicket === 1 && response.CheckTicketStatus !== 1) {
              resetList[1].ifShow = true;
            }
            defaultSchema = defaultSchema.concat(resetList);
          }
          updateSchema(defaultSchema);
          setFieldsValue({
            MachineId: response.MachineId,
            Destination: response.Destination,
            WareHouseName: `${response.WareHouseName}(${wareHouseType})`,
            Executor: response.Executor,
            ExecutorPhone: response.ExecutorPhone,
            CurrentStatus: transitionStateByWoreOrder(response.CurrentStatus),
            SubStatus: transitionStateByLogistics(response.SubStatus),
            CheckTicketStatus: transitionStateByCheckTicket(response.CheckTicketStatus),
            IsAutoCheckTicket: response.IsAutoCheckTicket,
            IsTakeBackUnCheckedTicket: response.IsTakeBackUnCheckedTicket === 1 ? true : false,
          })
          isCheckTicket(response.IsAutoCheckTicket, response.UncheckedBoxQty, true);
        }catch {}
      }

      function isCheckTicket(IsAutoCheckTicket: number, UncheckedBoxQty: number, disabled: boolean) {
        if(IsAutoCheckTicket === 1) {
          updateSchema([
            {
              field: 'IsTakeBackUnCheckedTicket',
              ifShow: true,
              componentProps: {
                disabled
              },
              renderComponentContent: `本次回收验票失败票 ${UncheckedBoxQty}张`
            }
          ])
        }else {
          updateSchema([
            {
              field: 'IsTakeBackUnCheckedTicket',
              componentProps: {
                disabled
              },
              ifShow: false,
            }
          ])
        }
      }

      function filterOption(input: string, option: any) {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }

      function handleSelect(_, option) {
        setFieldsValue({
          ExecutorPhone: option.UserName
        })
      }

      function setFields(data) {
        setFieldsValue(data)
      }

      //扫描包号
      async function handleScan(e, machineHeaderId, lotteryId) {
        const params = {
          WareHouseId: machineDetail.WareHouseId,
          LotteryId: lotteryId,
          StockDetailName: e.target.value,
          WorkOrderId: WorkOrderId.value
        }
        try {
          const response = await checkLotteryInWoreHouse(params);
          saveScanLotteryPackageInfo(response, machineHeaderId);
        } catch {

        }
      }

      //保存扫描包号相关信息
      function saveScanLotteryPackageInfo(stockInfo: {StockDetailName: string; DetailQuantity: number}, machineHeaderId: string) {
        machineDetail.WorkOrderGetLotteryDetailMachineHeads.map(item => {
          if(item.MachineHeadId === machineHeaderId) {
            let index = item.WorkAcceptLotteryDetails.findIndex(i => i.StockDetailName === stockInfo.StockDetailName);
            if(index === -1) {
              item.WorkAcceptLotteryDetails.push({
                StockDetailName: stockInfo.StockDetailName,
                LotteryCount: stockInfo.DetailQuantity,
                IsEdit: false,
                EditLotteryCount: stockInfo.DetailQuantity
              })
              item.ApplicationCount = item.ApplicationCount + stockInfo.DetailQuantity;
            } else {
              message.warning('请不要重复扫描');
            }
            console.log(item.ScanValue)
            item.ScanValue = undefined;
          }
        })
      }

      //机头更换彩种
      async function handleChangeLottery(LotteryId: number, MachineHeadId: string) {
        loading.value = true;
        let { LotteryPackageNumsList, StockQuantity } = await getLotteryPackageNums(LotteryId);
        const index = machineHeaderList.value.findIndex(item => item.MachineHeadId === MachineHeadId);
        if(index > -1) {
          if(WorkOrderId.value.length > 0) {
            if(LotteryId === machineDetail.WorkOrderGetLotteryDetailMachineHeads[index].LotteryId) {
              machineDetail.WorkOrderGetLotteryDetailMachineHeads[index].WorkLotteryType = 1;
            }else {
              machineDetail.WorkOrderGetLotteryDetailMachineHeads[index].WorkLotteryType = 2;
            }
            machineDetail.WorkOrderGetLotteryDetailMachineHeads[index].InventoryNum = StockQuantity;
          }else {
            machineDetail.getMachineDetailMachineHeads[index].LotteryPackageNumsList = LotteryPackageNumsList;
            machineDetail.getMachineDetailMachineHeads[index].LotteryPackageNum = LotteryPackageNumsList[0] ? Number(LotteryPackageNumsList[0].value) : 0;
            machineDetail.getMachineDetailMachineHeads[index].InventoryNum = StockQuantity;
          }
        }
        loading.value = false;
      }

      //发起加票工单
      async function create(values) {
        const workAddLotteries: workAddLotteries[] = [];
        let totalNum: number = 0;
        const { MachineId, Executor, ExecutorPhone, Remark, IsTakeBackUnCheckedTicket } = values;
        machineDetail.getMachineDetailMachineHeads.map(item => {
          let WorkLotteryType = 1;
          let LotteryId = item.LotteryId;
          if(item.LotteryId !== item.NewLotteryId) {
            WorkLotteryType = 2;
            LotteryId = item.NewLotteryId;
          }
          workAddLotteries.push({
            MachineHeadId: item.MachineHeadId,
            WorkLotteryType,
            LotteryId,
            PackageCount: item.PackageCount,
            LotteryCount: item.LotteryPackageNum * item.PackageCount
          })
          totalNum = totalNum + item.PackageCount;
        })
        if(totalNum === 0) {
          message.error('请至少输入一个票仓的申请数量！')
          return
        }
        const params: AddWorkOrderByLotteryParams = {
          MachineId,
          Executor,
          ExecutorPhone,
          Remark,
          IsTakeBackUnCheckedTicket: IsTakeBackUnCheckedTicket ? 1 : 0,
          workAddLotteries
        }
        try {
          const response = await addWorkOrderByLottery(params);
          message.success(response);
          return true
        }catch {
          return false
        }
      }

      //执行加票工单（扫描包号提交）
      async function implement(values) {
        let scanFlag = false;
        let WorkAcceptLotterys: WorkAcceptLotterysItem[] = [];
        for(let i = 0; i < machineDetail.WorkOrderGetLotteryDetailMachineHeads.length; i++) {
          let item = machineDetail.WorkOrderGetLotteryDetailMachineHeads[i];
          let WorkAcceptLotteryDetails: {StockDetailName: string; LotteryCount: number;}[] = [];
          item.WorkAcceptLotteryDetails.map(l => {
            WorkAcceptLotteryDetails.push({
              StockDetailName: l.StockDetailName,
              LotteryCount: l.LotteryCount
            })
          })
          WorkAcceptLotterys.push({
            MachineHeadId: item.MachineHeadId,
            WorkLotteryType: item.WorkLotteryType,
            LotteryId: item.NewLotteryId,
            LotteryCount: item.ApplicationCount,
            WorkAcceptLotteryDetails: WorkAcceptLotteryDetails,
          })
          if(item.WorkAcceptLotteryDetails.length > 0) {
            scanFlag = true;
            break;
          }
        }
        if(scanFlag) {
          const params: ExecuteWorkOrderByLotteryParams = {
            WorkOrderId: WorkOrderId.value,
            Executor: values.Executor,
            ExecutorPhone: values.ExecutorPhone,
            Remark: values.Remark,
            WorkAcceptLotterys: WorkAcceptLotterys
          }
          const response = await executeWorkOrderByLottery(params);
          message.success(response);
        }else {
          message.warning('请扫描包号')
        }
      }

      //修改加票工单
      async function update(values, type?: string) {
        const params: UpdateWorkOrderByLotteryParams = {
          WorkOrderId: WorkOrderId.value,
          Executor: values.Executor,
          ExecutorPhone: values.ExecutorPhone,
          Remark: values.Remark,
        }
        if(type === 'stop') {
          params.CurrentStatus = 7;
        }
        try {
          const response = await updateWorkOrderByLottery(params);
          message.success(response);
        }catch {}
      }

      //已扫描包号操作按钮（编辑、取消、确定）
      function handleActionNum(MachineHeadId, StockDetailName, type) {
        const headerIndex = machineDetail.WorkOrderGetLotteryDetailMachineHeads.findIndex(item => item.MachineHeadId === MachineHeadId);
        machineDetail.WorkOrderGetLotteryDetailMachineHeads[headerIndex].WorkAcceptLotteryDetails.map(item => {
          if(item.StockDetailName === StockDetailName) {
            if(type === 'edit') {
              item.IsEdit = true;
            }else if(type === 'cancel') {
              item.EditLotteryCount = item.LotteryCount;
              item.IsEdit = false;
            }else if(type === 'ok') {
              item.LotteryCount = item.EditLotteryCount;
              item.IsEdit = false;
            }
          }
        });
      }

      //已扫描包号点击删除图标
      function handleDeleteNum(MachineHeadId, StockDetailName) {
        const headerIndex = machineDetail.WorkOrderGetLotteryDetailMachineHeads.findIndex(item => item.MachineHeadId === MachineHeadId);
        const stockIndex = machineDetail.WorkOrderGetLotteryDetailMachineHeads[headerIndex].WorkAcceptLotteryDetails.findIndex(item => item.StockDetailName === StockDetailName);
        machineDetail.WorkOrderGetLotteryDetailMachineHeads[headerIndex].WorkAcceptLotteryDetails.splice(stockIndex, 1);
      }

      // 表单提交
      async function handleSubmit(values: any) {
        let result;
        if(props.WorkOrderId.length === 0) {
          result = await create(values);
        }else {
          if(machineDetail.CurrentStatus === 1) {
            //执行加票工单
            result = await implement(values);
          }else if(machineDetail.CurrentStatus === 4) {
            //修改加票工单
            result = await update(values);
          }
        }

        if(result) {
          resetFields();
          handleReset();
        }
      }

      //重置
      async function handleReset() {
        for(let key in machineDetail) {
          machineDetail[key] = defaultMachineDetail[key]
        }
      }

      //中止
      async function handleStop() {
        const values = await validate();
        await update(values, 'stop');
        await getWorkOrderDetail();
        await getRemarkList();
      }

      //完成工单
      async function handleFinish() {
        console.log('finish')
        const values = await validate();
        const params = {
          WorkOrderId: WorkOrderId.value,
          ReturnRemark: values.Remark
        }
        try {
          const response = await completeWorkOrderByLottery(params);
          message.success(response);
        } catch {}

      }

      //删除
      async function handleDelete() {
        try {
          await deleteWorkOrder({ WorkOrderId: WorkOrderId.value });
          message.success('删除成功');
        } catch{}
      }

      //点击机头验票成功
      function handleSeeInspectTicketSuccessLog(MachineHeadId, LotteryName) {
        openModal(true, {
          type: 'success',
          LotteryName,
          MachineHeadId,
          WorkOrderId: WorkOrderId.value
        });
      }

      //点击验票失败
      function handleSeeInspectTicketErrorLog() {
        openModal(true, {
          type: 'error',
          WorkOrderId: WorkOrderId.value
        });
      }

      //点击停止/继续/完成验票
      async function handleUpdateInspectTicket(type) {
        const values = await validate();
        const params = {
          CompleteStatus: type,
          WorkOrderId: WorkOrderId.value,
          Remark: values.Remark
        }
        try {
          const response = await updateCheckTickets(params);
          message.success(response);
          await getWorkOrderDetail();
          await getRemarkList();
        } catch {}
      }

      return {
        loading,
        register,
        registerModal,
        setProps,
        isEdit,
        showActionButtonGroup,
        handleSubmit,
        handleReset,
        handleDelete,
        filterOption,
        getUserDic,
        getLotteryList,
        handleSelect,
        setFields,
        machineDetail,
        remarkList,
        handleChangeLottery,
        machineHeaderList,
        WorkOrderId,
        handleScan,
        handleActionNum,
        handleDeleteNum,
        handleStop,
        handleFinish,
        handleSeeInspectTicketSuccessLog,
        handleSeeInspectTicketErrorLog,
        handleUpdateInspectTicket
      }
    }
  })
</script>

<style lang="less" scoped>
@import './index.less';

  .tip-color {
    color: @error-color;
  }

  .curson-pointer {
    cursor: pointer;
  }

  .action-btn-cancel {
    color: @button-cancel-color;
  }

  .action-btn-ok {
    color: @button-primary-color;
  }

  .card-extra {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    .card-extra-lottery-type {
      min-width: 50px;
      text-align: right;
    }
  }

  .card-line {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    .card-line-label {
      flex: 0 0 100px;
      text-align: right;
    }

    .card-line-value {
      position: relative;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .card-line-icon {
        position: absolute;
        top: 50%;
        right: 10px;
        margin-top: -7px;
        font-size: 14px;
      }
    }

    .card-line-value-vertical {
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: flex-start;
    }

    .card-line-value-horizontal {
      flex-flow: row nowrap;
      justify-content: flex-start;
    }

    .card-line-value-grid {
      flex-flow: row wrap;
      justify-content: flex-start;

      .card-line-value-grid-item {
        margin-right: 10px;
      }
    }

    .scan-input {
      width: 100%;
    }

    .scan-result-item {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      width: 100%;
      height: 30px;
      padding: 0 20px;
      margin-bottom: 15px;
      border: 1px solid rgb(233, 225, 225);
      box-sizing: border-box;

      .scan-result-item-icon {
        padding-left: 10px;
        font-size: 14px;
      }

      .action-btn {
        margin: 0 10px;
        cursor: pointer;
      }
    }
  }

  .card-line-outside {
    padding: 12px 24px;

    .card-line-value {
      position: static;
      width: 200px;
      justify-content: flex-start;

      .card-line-icon {
        position: static;
        top: 0;
        right: 0;
        margin-top: 0;
        margin-left: 20px;
        font-size: 14px;
      }
    }
  }

  ::v-deep(.ant-card-grid) {
    padding: 12px 24px;
  }
</style>
