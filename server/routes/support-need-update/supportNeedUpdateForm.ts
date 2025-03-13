import { ValidationError } from 'express-validator'
import { PrisonerSupportNeedDetails } from '../../data/model/supportNeeds'

export default class SupportNeedUpdateForm {
  constructor(
    private readonly existingPrisonerNeed: PrisonerSupportNeedDetails,
    private readonly formValues: object,
    private readonly errors: ValidationError[] = [],
  ) {
    // no op
  }

  get renderArgs(): {
    updateStatus?: string
    responsibleStaff?: string[]
    additionalDetails?: string
    errors: ValidationError[]
  } {
    const formSubmitted = Object.keys(this.formValues).length > 0

    const form = formSubmitted
      ? { ...this.formValues }
      : {
          updateStatus: this.existingPrisonerNeed.status,
          responsibleStaff: [
            this.existingPrisonerNeed.isPrisonResponsible ? 'PRISON' : null,
            this.existingPrisonerNeed.isProbationResponsible ? 'PROBATION' : null,
          ].filter(x => x !== null),
          additionalDetails: '',
        }

    return { ...form, errors: this.errors }
  }
}
