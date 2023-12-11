import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AddAppointmentView from './addAppointmentView'

export default class AddAppointmentController {
  constructor(private readonly rpService: RpService) {}

  getAddAppointmentView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const view = new AddAppointmentView(prisonerData)
    res.render('pages/add-appointment', { ...view.renderArgs })
  }
}
