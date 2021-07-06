const Receiver = {
  queryTaskReceiveDetail: {
    url: '/taskReceiveService/queryTaskReceiveDetail',
    method: 'post'
  },
  auditTaskReceive: {
    url: '/taskReceiveService/auditTaskReceive',
    method: 'post'
  },
  updateTaskReceive: {
    url: '/taskReceiveService/updateTaskReceive',
    method: 'post'
  },
  addTaskReceiveFeedback: {
    url: '/taskReceiveFeedbackService/addTaskReceiveFeedback',
    method: 'post'
  }
}
export default Receiver
