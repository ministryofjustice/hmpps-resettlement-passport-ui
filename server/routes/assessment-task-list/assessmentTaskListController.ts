import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AssessmentTaskListView from './assessmentTaskListView'
import { AssessmentsSummary, AssessmentStatus } from '../../data/model/assessmentStatus'
import { AssessmentType } from '../../data/model/assessmentInformation'
import { parseAssessmentType } from '../../utils/utils'
import { isInPreReleaseWindow } from '../../utils/preReleaseWindow'
import PrisonerDetailsService from '../../services/prisonerDetailsService'

export default class AssessmentTaskListController {
  constructor(private readonly rpService: RpService, private readonly prisonerDetailsService: PrisonerDetailsService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)

      const { type, force } = req.query
      const assessmentType: AssessmentType = parseAssessmentType(type)

      const { prisonerNumber } = prisonerData.personalDetails
      const assessmentsSummary = await this.rpService.getAssessmentSummary(prisonerNumber, assessmentType)

      const immediateNeedsReportNotStarted = assessmentType === 'BCST2' && notStarted(assessmentsSummary)
      if (
        force !== 'true' &&
        immediateNeedsReportNotStarted &&
        isInPreReleaseWindow(prisonerData.personalDetails.releaseDate)
      ) {
        const preReleaseSummary = await this.rpService.getAssessmentSummary(prisonerNumber, 'RESETTLEMENT_PLAN')
        if (notStarted(preReleaseSummary)) {
          // Optionally skip initial needs assessment if it's not started and we're in the pre-release window
          return res.redirect(`/assessment-skip?prisonerNumber=${prisonerNumber}`)
        }
        // Go to in progress pre-release report
        return res.redirect(`/assessment-task-list?prisonerNumber=${prisonerNumber}&type=RESETTLEMENT_PLAN`)
      }

      const immediateNeedsReportCompleted: boolean = assessmentsSummary.results
        ? assessmentsSummary.results.every((status: AssessmentStatus) => status.assessmentStatus === 'COMPLETE')
        : null

      const view = new AssessmentTaskListView(
        prisonerData,
        assessmentsSummary,
        immediateNeedsReportCompleted,
        assessmentType,
      )
      return res.render('pages/assessment-task-list', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}

function notStarted(summary: AssessmentsSummary): boolean {
  return !summary.error && summary.results.every(({ assessmentStatus }) => assessmentStatus === 'NOT_STARTED')
}
