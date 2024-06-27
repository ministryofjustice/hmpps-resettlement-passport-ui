import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { Appointment } from '../../data/model/appointment'
import { OtpDetails } from '../../data/model/otp'

export default class PrintView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly fullName: string,
    private readonly appointments: Appointment[],
    private readonly otpData: OtpDetails,
    private readonly appointmentsEnabled: boolean,
  ) {
    // no op
  }

  get renderArgs(): {
    prisonerData: PrisonerData
    fullName: string
    documentDate: Date
    appointments: Appointment[]
    otpData: OtpDetails
    errors: ErrorMessage[]
    appointmentsEnabled: boolean
  } {
    return {
      prisonerData: this.prisonerData,
      fullName: this.fullName,
      documentDate: new Date(),
      appointments: this.appointments,
      otpData: this.otpData,
      errors: null,
      appointmentsEnabled: this.appointmentsEnabled,
    }
  }
}
