import View, { ErrorMessage } from '../view'

export default class SupportNeedsView implements View {
  constructor(private readonly errors: ErrorMessage[]) {
    // no op
  }

  get renderArgs(): {
    errors: ErrorMessage[]
  } {
    return {
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}
