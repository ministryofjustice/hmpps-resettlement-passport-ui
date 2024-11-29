import View, { ErrorMessage } from '../view'
import { WorkerList } from '../../data/model/resettlementWorker'

export default class StaffCapacityView implements View {
  constructor(private readonly workerList: WorkerList, private readonly errors: ErrorMessage[]) {
    // no op
  }

  get renderArgs(): {
    workerList: WorkerList
    errors: ErrorMessage[]
  } {
    return {
      workerList: this.workerList,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}
