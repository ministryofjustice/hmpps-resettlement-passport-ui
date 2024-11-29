import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import StaffCapacityView from './staffCapacityView'

export default class StaffCapacityController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { userActiveCaseLoad } = res.locals

    try {
      const workerList = await this.rpService.getAssignedWorkerList(userActiveCaseLoad.caseLoadId)
      const view = new StaffCapacityView(workerList)
      return res.render('pages/staff-capacity', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}
