import View, { ErrorMessage } from '../view'
import { Appointments } from '../../data/model/appointment'
import { PrisonerData } from '../../@types/express'

export default class PrisonerOverviewView implements View {
  constructor(
    private readonly licenceConditions: { error?: boolean },
    private readonly prisonerData: PrisonerData,
    private readonly caseNotes: { error?: boolean },
    private readonly page: number,
    private readonly size: number,
    private readonly sort: string,
    private readonly days: number,
    private readonly pathway: string,
    private readonly riskScores: { error?: boolean },
    private readonly rosh: { error?: boolean },
    private readonly mappa: { error?: boolean },
    private readonly staffContacts: { error?: boolean },
    private readonly appointments: Appointments,
    private readonly errors: ErrorMessage[] = [],
  ) {}

  get renderArgs(): {
    licenceConditions: { error?: boolean }
    prisonerData: PrisonerData
    caseNotes: { error?: boolean }
    page: number
    size: number
    sort: string
    days: number
    pathway: string
    riskScores: { error?: boolean }
    rosh: { error?: boolean }
    mappa: { error?: boolean }
    staffContacts: { error?: boolean }
    appointments: Appointments
    errors: ErrorMessage[]
  } {
    return {
      licenceConditions: this.licenceConditions,
      prisonerData: this.prisonerData,
      caseNotes: this.caseNotes,
      page: this.page,
      size: this.size,
      sort: this.sort,
      days: this.days,
      pathway: this.pathway,
      riskScores: this.riskScores,
      rosh: this.rosh,
      mappa: this.mappa,
      staffContacts: this.staffContacts,
      appointments: this.appointments,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}
