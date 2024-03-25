import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AssessmentTaskListView from './assessmentTaskListView'
import { AssessmentStatus } from '../../data/model/assessmentStatus'
import { AssessmentType } from '../../data/model/assessmentInformation'

export default class AssessmentTaskListController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { type } = req.params
      const assessmentType: AssessmentType = type === 'RESETTLEMENT_PLAN' ? 'RESETTLEMENT_PLAN' : 'BCST2'

      const assessmentsSummary = await this.rpService.getAssessmentSummary(
        req.user.token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        assessmentType,
      )

      const BCST2Completed: boolean = assessmentsSummary.results
        ? assessmentsSummary.results.every((status: AssessmentStatus) => status.assessmentStatus === 'COMPLETE')
        : null

      const view = new AssessmentTaskListView(prisonerData, assessmentsSummary, BCST2Completed, assessmentType)
      res.render('pages/assessment-task-list', { ...view.renderArgs })
    } catch (err) {
      next(err)
    }
  }
}
