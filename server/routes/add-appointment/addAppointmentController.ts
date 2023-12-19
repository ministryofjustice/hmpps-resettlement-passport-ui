import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AddAppointmentView from './addAppointmentView'
import { AppointmentErrorMessage } from '../../data/model/appointmentErrorMessage'
// import { RPClient } from '../../data'
import logger from '../../../logger'

export default class AddAppointmentController {
  constructor(private readonly rpService: RpService) {}

  getAddAppointmentView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const params = req.query
    const view = new AddAppointmentView(prisonerData)
    res.render('pages/add-appointment', { ...view.renderArgs, params })
  }

  getConfirmAppointmentView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const params = req.query
    let errorMsg: AppointmentErrorMessage = {
      appointmentType: null,
      appointmentTitle: null,
      appointmentOrganisation: null,
      appointmentContact: null,
      dateAndTime: null,
      appointmentDuration: null,
    }

    const {
      appointmentType,
      appointmentTitle,
      appointmentOrganisation,
      appointmentContact,
      dateAndTime,
      appointmentDuration,
    } = params

    if (
      !appointmentType ||
      !appointmentTitle ||
      !appointmentOrganisation ||
      !appointmentContact ||
      !dateAndTime ||
      !appointmentDuration
    ) {
      errorMsg = {
        appointmentType: appointmentType ? null : true,
        appointmentTitle: appointmentTitle ? null : true,
        appointmentOrganisation: appointmentOrganisation ? null : true,
        appointmentContact: appointmentContact ? null : true,
        dateAndTime: dateAndTime ? null : true,
        appointmentDuration: appointmentDuration ? null : true,
      }
      res.render('pages/add-appointment', { prisonerData, params, req, errorMsg })
      return
    }

    res.render('pages/add-appointment-confirm', { prisonerData, params, req })
  }

  postAppointmentView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const params = req.body
    const {
      prisonerNumber,
      // appointmentType,
      // appointmentTitle,
      // appointmentOrganisation,
      // appointmentContact,
      // dateAndTime,
      // appointmentDuration,
    } = req.body
    // const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
    try {
      // await rpClient.post(`/resettlement-passport/prisoner/${prisonerNumber}/appointments`, {
      //   appointmentType,
      //   appointmentTitle,
      //   appointmentOrganisation,
      //   appointmentContact,
      //   dateAndTime,
      //   appointmentDuration,
      // })
      res.redirect(`/prisoner-overview/?prisonerNumber=${prisonerNumber}#appointments`)
    } catch (error) {
      const errorMessage = error.message
      logger.error('Error fetching id data:', error)
      res.render('pages/add-appointment-confirm', {
        errorMessage,
        prisonerData,
        params,
      })
    }
  }
}
