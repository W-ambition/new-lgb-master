export interface GetWorkOrderListParams {
  OrderId?: string;
  MachineId?: string;
  WorkOrderId?: string;
  WorkOrderType?: string;
  CurrentStatus?: number;
  SubStatus?: number;
  Applicant?: string;
  ApplicantName?: string;
  Executor?: string;
  ExecutorName?: string;
  KeyWords?: string;
  CreateBeginTime?: string;
  CreateEndTime?: string;
  FinishBeginTime?: string;
  FinishEndTime?: string;
  PId?: number;
  TreeQueryType?: number;
  IsMonitoring?: number;
  CheckTicketsCompleteStatus?: number;
  PageIndex?: number;
  PageSize?: number;
}

export interface GetWorkOrderLogParams {
  WorkOrderId: string;
  PageIndex?: number;
  PageSize?: number;
}

export interface workAddLotteries {
  MachineHeadId: string;
  WorkLotteryType: number;
  LotteryId: number;
  PackageCount: number;
  LotteryCount: number;
}

export interface AddWorkOrderByLotteryParams {
  Executor: string;
  MachineId: string;
  Remark?: string;
  IsTakeBackUnCheckedTicket?: number;
  ExecutorPhone: string;
  workAddLotteries: workAddLotteries[]
}

export interface GetWorkOrderDetailByLotteryParams {
  WorkOrderId: string;
}

export interface WorkOrderGetLotteryDetailMachineHeadLotterysItem {
  WorkLotteryDetailId: number;
  MachineHeadId: string;
  StockDetailId: string;
  StockDetailName: string;
  DetailQuantity: number;
}

export interface WorkOrderGetLotteryDetailMachineHeadsItem {
  MachineHeadId: string;
  MachineHeadName: string;
  LotteryId: number;
  LotteryName: string;
  LotteryPrice: number;
  AlertQuantity: number;
  MaxQuantity: number;
  MaxPrice: number;
  TicketQuantity: number;
  ActualTicketQuantity: number;
  WorkLotteryId: number;
  WorkLotteryPackageQuantity: number;
  WorkLotteryType: number;
  WorkLotteryLotteryId: number;
  PackageQuantity: number;
  WorkLotteryLotteryName: number;
  WorkLotteryPrice: number;
  WorkLotteryPackageCount: number;
  WorkLotteryLotteryCount: number;
  WorkLotteryActualLotteryCount: number;
  TicketQuantityBeforeWorkLotteryComplete: number;
  WorkLotteryIsFull: number;
  StockPackageCount: number;
  CodeLength: number;
  WorkLotteryCodeLength: number;
  CheckSuccessTicketsQty: number;
  WorkOrderGetLotteryDetailMachineHeadLotterys: WorkOrderGetLotteryDetailMachineHeadLotterysItem[];
}

export interface GetWorkOrderDetailByLotteryModal {
  WorkOrderId: string;
  PId: number;
  MachineId: string;
  MachineName: string;
  LotteryType: number;
  Applicant: string;
  ApplicantName: string;
  Executor: string;
  ExecutorName: string;
  ExecutorPhone: string;
  MerchantName: string;
  WareHouseId: string;
  WareHouseName: string;
  WareHouseAddress: string;
  CurrentStatus: number;
  Destination: string;
  Remark: string;
  Longitude: string;
  Latitude: string;
  ReturnRemark: string;
  Address: string;
  CreateTime: string;
  FinishTime: string;
  IsStockControl: number;
  IsAutoCheckTicket: number;
  CheckTicketStatus: number;
  CheckTicketRemark: string;
  CheckFailureTicketsQty: number;
  UncheckedBoxQty: number;
  IsTakeBackUnCheckedTicket: number;
  UnCheckedTicketQty: number;
  SubType: number;
  SubStatus: number;
  IsOpened: number;
  WorkOrderGetLotteryDetailMachineHeads: WorkOrderGetLotteryDetailMachineHeadsItem[]
}

export interface WorkAcceptLotteryDetailsItem {
  StockDetailName: string;
  LotteryCount: number;
}

export interface WorkAcceptLotterysItem {
  MachineHeadId: string;
  WorkLotteryType: number;
  LotteryId: number;
  LotteryCount: number;
  WorkAcceptLotteryDetails: WorkAcceptLotteryDetailsItem[]
}

export interface ExecuteWorkOrderByLotteryParams {
  WorkOrderId: string;
  Executor: string;
  ExecutorPhone: string;
  Remark: string;
  WorkAcceptLotterys: WorkAcceptLotterysItem[]
}

export interface DeleteWorkOrderParams {
  WorkOrderId: string;
}

export interface UpdateWorkOrderByLotteryParams {
  WorkOrderId: string;
  Executor: string;
  ExecutorPhone: string;
  Remark?: string;
  CurrentStatus?: number;
}

export interface CompleteWorkOrderByLotteryParams {
  WorkOrderId: string;
  ReturnRemark?: string;
}

export interface GetFailureTicketsParams {
  WorkOrderId?: string;
  MachineId?: string;
  PageIndex?: number;
  PageSize?: number;
}

export interface GetSuccessPackagesParams {
  WorkOrderId: string;
  MachineHeadId: string;
}

export interface GetSuccessTicketsParams extends GetSuccessPackagesParams {
  PackageNo: string;
}

export interface UpdateCheckTicketsParams {
  WorkOrderId: string;
  CompleteStatus: number;
  Remark?: string;
}

export interface GetWorkOrderDetailByRepairParams {
  WorkOrderId: string;
}

export interface AddWorkOrderByRepairParams {
  Executor: string;
  Destination: string;
  MachineId: string;
  ExecutorPhone: string;
  Remark?: string;
}

export interface UpdateWorkOrderByRepairParams {
  WorkOrderId: string;
  Executor: string;
  ExecutorPhone: string;
  Remark?: string;
  CurrentStatus: number;
}

export interface AddWorkOrderByMachineReturnParams {
  Executor: string;
  ExecutorPhone: string;
  WareHouseId: string;
  MachineId: string;
  Remark?: string;
  Destination: string;
}

export interface UpdateWorkOrderByMachineReturnParams {
  WorkOrderId: string;
  Executor: string;
  ExecutorPhone: string;
  Remark?: string;
  CurrentStatus: number;
}

export interface GetWorkOrderDetailByMachineReturnParams {
  WorkOrderId: string;
}

export interface AddWorkOrderByMachineOutParams {
  WareHouseId: string;
  Executor: string;
  ExecutorPhone: string;
  MachineId: string;
  Destination: string;
  Remark?: string;
  MerchantId: string;
  Longitude: string;
  Latitude: string;
}

export interface GetWorkOrderDetailByMachineOutParams {
  WorkOrderId: string;
}

export interface UpdateWorkOrderByMachineOutParams {
  WorkOrderId: string;
  Executor: string;
  ExecutorPhone: string;
  Remark?: string;
  CurrentStatus: number;
}

export interface WorkOrderAddRefundLotterysItem {
  MachineHeadId: string;
  LotteryId: number;
  LotteryCount: number;
}

export interface AddRefundParams {
  Executor: string;
  ExecutorPhone: string;
  OrderId?: string;
  RefundType: number;
  RefundAmout?: number;
  Remark?: string;
  WorkOrderAddRefundLotterys?: WorkOrderAddRefundLotterysItem[]
}
