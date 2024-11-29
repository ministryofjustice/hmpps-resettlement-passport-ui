import View, { ErrorMessage } from '../view'
import { WorkerList } from '../../data/model/resettlementWorker'

export default class StaffCapacityView implements View {
  constructor(private readonly workerList: WorkerList) {
    // no op
  }

  get renderArgs(): {
    workerList: WorkerList
    errors: ErrorMessage[]
  } {
    return {
      workerList: this.workerList,
      errors: null,
    }
  }
}
