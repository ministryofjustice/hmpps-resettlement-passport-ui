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

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const view = new PrintView(prisonerData)
    res.render('pages/print', { ...view.renderArgs })
  }

  printPackPdf: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData, sessionID } = req
    const { token } = req.user

    const appointmentData = await this.rpService.getAppointments(
      token,
      sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
    )

    const otpData = await this.rpService.getOtp(token, sessionID, prisonerData.personalDetails.prisonerNumber as string)

    const filename = 'plan-your-future-pack.pdf'
    const fullName = `${prisonerData.personalDetails.firstName} ${prisonerData.personalDetails.lastName}`
    res.renderPDF(
      'pages/printPack',
      { fullName, documentDate: new Date(), appointments: appointmentData.results.slice(0, 8), otpData },
      { filename, pdfOptions: { ...pdfOptions } },
    )
  }
}
