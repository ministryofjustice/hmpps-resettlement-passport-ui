import { RequestHandler } from 'express'
import nunjucks from 'nunjucks'
import RpService from '../../services/rpService'
import PrintView from './printView'
import { pdfMetricsCounter } from '../../monitoring/customMetrics'
import { FEATURE_FLAGS } from '../../utils/constants'
import { getFeatureFlagBoolean } from '../../utils/utils'
import { Appointment } from '../../data/model/appointment'
import logger from '../../../logger'

const pdfOptions = {
  marginTop: '2.4',
  marginBottom: '1',
  marginLeft: '0.0',
  marginRight: '0.0',
}

export default class PrintController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  printPackPdf: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { prisonerNumber, prisonName } = prisonerData.personalDetails

      const appointmentsEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.VIEW_APPOINTMENTS_END_USER)
      logger.info('Feature flag viewAppointmentsEndUser: ', appointmentsEnabled)
      let appointments: Appointment[] = []
      if (appointmentsEnabled) {
        const appointmentData = await this.rpService.getAppointments(prisonerNumber as string)
        appointments = appointmentData.results.slice(0, 8)
      }
      const otpData = await this.rpService.getOtp(prisonerNumber as string)
      const filename = `plan-your-future-pack-${prisonerNumber}.pdf`
      const fullName = `${prisonerData.personalDetails.firstName} ${prisonerData.personalDetails.lastName}`

      const view = new PrintView(prisonerData, fullName, appointments, otpData, appointmentsEnabled)

      pdfMetricsCounter.inc({
        path: req.path.toLowerCase(),
        prison: prisonName,
      })

      const headerHtml = nunjucks.render('pages/printPackHeader.njk', { ...view.renderArgs })
      res.renderPDF('pages/printPack', headerHtml, { ...view.renderArgs }, { filename, pdfOptions: { ...pdfOptions } })
    } catch (err) {
      next(err)
    }
  }

  printOtp: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req

      const otpData = await this.rpService.recreateOtp(prisonerData.personalDetails.prisonerNumber as string)
      let error
      if (!otpData?.otp) {
        error = 'Error recreating First-time ID code, please try again later'
      }
      res.render('pages/printOtpSuccess', { prisonerData, otpData, error })
    } catch (err) {
      next(err)
    }
  }
}
