import { ValidationError } from 'express-validator'
import { SupportNeedCache } from '../../data/model/supportNeeds'

export default class SupportNeedForm {
  constructor(
    private readonly existingSupportNeed: SupportNeedCache,
    private readonly formValues: object,
    private readonly errors: ValidationError[] = [],
  ) {
    // no op
  }

  get renderArgs(): {
    status?: string
    responsibleStaff?: string[]
    updateText?: string
    errors: ValidationError[]
  } {
    const formSubmitted = Object.keys(this.formValues).length > 0

    const form = formSubmitted
      ? { ...this.formValues }
      : {
          status: this.existingSupportNeed.status,
          responsibleStaff: [
            this.existingSupportNeed.isPrisonResponsible ? 'PRISON' : null,
            this.existingSupportNeed.isProbationResponsible ? 'PROBATION' : null,
          ].filter(x => x !== null),
          updateText: this.existingSupportNeed.updateText,
        }

    return { ...form, errors: this.errors }
  }
}
