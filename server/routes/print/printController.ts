import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import PrintView from './printView'

const pdfOptions = {
  marginTop: '0.0',
  marginBottom: '0.1',
  marginLeft: '0.0',
  marginRight: '0.0',
}

export default class HealthStatusController {
  constructor(private readonly rpService: RpService) {}

  printPackPdf: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData, sessionID } = req
      const { token } = req.user
      const appointmentData = await this.rpService.getAppointments(
        token,
        sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
      )

      const otpData = await this.rpService.getOtp(
        token,
        sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
      )
      const filename = 'plan-your-future-pack.pdf'
      const fullName = `${prisonerData.personalDetails.firstName} ${prisonerData.personalDetails.lastName}`
      const view = new PrintView(prisonerData, fullName, appointmentData.results.slice(0, 8), otpData)
      res.renderPDF('pages/printPack', { ...view.renderArgs }, { filename, pdfOptions: { ...pdfOptions } })
    } catch (err) {
      next(err)
    }
  }

  printOtp: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData, sessionID } = req
      const { token } = req.user

      const otpData = await this.rpService.recreateOtp(
        token,
        sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
      )
      let error
      if (!otpData?.otp) {
        error = 'Error recreating OTP, please try again later'
      }
      res.render('pages/printOtpSuccess', { prisonerData, otpData, error })
    } catch (err) {
      next(err)
    }
  }
}
