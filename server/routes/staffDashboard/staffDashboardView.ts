import View, { ErrorMessage } from '../view'

interface PrisonSelect {
  text: string
  value: string
  selected: boolean
}

export default class StaffDashboardView implements View {
  constructor(
    private readonly prisonSelectList: PrisonSelect[],
    private readonly prisonSelected: string,
    private readonly errors: ErrorMessage[],
  ) {}

  get renderArgs(): {
    prisonSelectList: PrisonSelect[]
    prisonSelected: string
    errors: ErrorMessage[]
  } {
    return {
      prisonSelectList: this.prisonSelectList,
      prisonSelected: this.prisonSelected,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}
