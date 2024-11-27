import View, { ErrorMessage } from '../view'
import { PrisonersList } from '../../data/model/prisoners'
import { ResettlementWorker } from '../../data/model/resettlementWorkers'

export default class AssignCaseView implements View {
  constructor(
    private readonly prisonersList: PrisonersList,
    private readonly resettlementWorkers: ResettlementWorker[],
    private readonly errors: ErrorMessage[],
  ) {
    // no op
  }

  get renderArgs() {
    return {
      prisonersList: this.prisonersList,
      resettlementWorkers: this.resettlementWorkers,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}
