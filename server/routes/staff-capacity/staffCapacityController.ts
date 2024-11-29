import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import StaffCapacityView from './staffCapacityView'
import { ErrorMessage } from '../view'

export default class StaffCapacityController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { userActiveCaseLoad } = res.locals
    const errors: ErrorMessage[] = []

    try {
      const workerList = await this.rpService.getAssignedWorkerList(userActiveCaseLoad.caseLoadId)
      const view = new StaffCapacityView(workerList, errors)
      return res.render('pages/staff-capacity', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}
