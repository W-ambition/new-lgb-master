//工单状态
export function transitionStateByWoreOrder(state: number): string {
  let result: string = '';
  switch(state) {
    case 1:
      result = '已创建';
      break;
    case 4:
      result = '执行中';
      break;
    case 5:
      result = '已完成';
      break;
    case 7:
      result = '已终止';
      break;
    default:
      result = '未知';
      break;
  }
  return result;
}

//物流状态
export function transitionStateByLogistics(state: number): string {
  let result: string = '';
  switch(state) {
    case 0:
      result = '未同步';
      break;
    case 60:
      result = '拣货完成';
      break;
    case 70:
      result = '出库完成';
      break;
    default:
      result = '未知';
      break;
  }
  return result;
}

//验票状态
export function transitionStateByCheckTicket(state: number): string {
  let result: string = '';
  switch(state) {
    case 0:
      result = '验票中';
      break;
    case 1:
      result = '验票完成';
      break;
    case 2:
      result = '停止验票';
      break;
    default:
      result = '未知';
      break;
  }
  return result;
}
