import View, { ErrorMessage } from '../view'

interface PrisonSelect {
  text: string
  value: string
  selected: boolean
}

type PrisonersList = {
  content: Prisoners[]
  page: number
  last: boolean
}

type Prisoners = {
  firstName: string
  lastName: string
}

export default class StaffDashboardView implements View {
  constructor(
    private readonly prisonSelectList: PrisonSelect[],
    private readonly prisonSelected: string,
    private readonly prisonersList: PrisonersList,
    private readonly errors: ErrorMessage[],
  ) {}

  get renderArgs(): {
    prisonSelectList: PrisonSelect[]
    prisonSelected: string
    prisonersList: PrisonersList
    errors: ErrorMessage[]
  } {
    return {
      prisonSelectList: this.prisonSelectList,
      prisonSelected: this.prisonSelected,
      prisonersList: this.prisonersList,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}
