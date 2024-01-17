import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AssessmentTaskListView from './assessmentTaskListView'
import { AssessmentStatus } from '../../data/model/assessmentStatus'

export default class AssessmentTaskListController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { token } = req.user

    const assessmentsSummary = await this.rpService.getAssessmentsSummary(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
    )

    const BCST2Completed = assessmentsSummary.every(
      (status: AssessmentStatus) => status.assessmentStatus === 'COMPLETE',
    )

    const view = new AssessmentTaskListView(prisonerData, assessmentsSummary, BCST2Completed)
    res.render('pages/assessment-task-list', { ...view.renderArgs })
  }
}
