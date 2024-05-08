import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AssessmentTaskListView from './assessmentTaskListView'
import { AssessmentStatus } from '../../data/model/assessmentStatus'
import { AssessmentType } from '../../data/model/assessmentInformation'
import { parseAssessmentType } from '../../utils/utils'
import { isInResettlementWindow } from '../../utils/resettlementWindow'

export default class AssessmentTaskListController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { type, force } = req.query
      const assessmentType: AssessmentType = parseAssessmentType(type)

      const prisonerNumber = prisonerData.personalDetails.prisonerNumber as string
      const assessmentsSummary = await this.rpService.getAssessmentSummary(
        req.user.token,
        req.sessionID,
        prisonerNumber,
        assessmentType,
      )

      const immediateNeedsReportNotStarted =
        assessmentType === 'BCST2' &&
        assessmentsSummary.results.every(({ assessmentStatus }) => assessmentStatus === 'NOT_STARTED')

      if (
        force !== 'true' &&
        immediateNeedsReportNotStarted &&
        isInResettlementWindow(prisonerData.personalDetails.releaseDate)
      ) {
        // Optionally skip initial needs assessment if it's not started and we're in the pre release window
        return res.redirect(`/assessment-skip?prisonerNumber=${prisonerNumber}`)
      }

      const BCST2Completed: boolean = assessmentsSummary.results
        ? assessmentsSummary.results.every((status: AssessmentStatus) => status.assessmentStatus === 'COMPLETE')
        : null

      const view = new AssessmentTaskListView(prisonerData, assessmentsSummary, BCST2Completed, assessmentType)
      return res.render('pages/assessment-task-list', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}
