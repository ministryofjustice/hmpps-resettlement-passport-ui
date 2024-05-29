import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AssessmentTaskListView from './assessmentTaskListView'
import { AssessmentStatus } from '../../data/model/assessmentStatus'
import { AssessmentType } from '../../data/model/assessmentInformation'
import { getFeatureFlagBoolean, parseAssessmentType } from '../../utils/utils'
import { isInPreReleaseWindow } from '../../utils/preReleaseWindow'

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

      if (await getFeatureFlagBoolean('reportSkip')) {
        const immediateNeedsReportNotStarted = assessmentType === 'BCST2' && notStarted(assessmentsSummary.results)
        if (
          force !== 'true' &&
          immediateNeedsReportNotStarted &&
          isInPreReleaseWindow(prisonerData.personalDetails.releaseDate)
        ) {
          const preReleaseSummary = await this.rpService.getAssessmentSummary(
            req.user.token,
            req.sessionID,
            prisonerNumber,
            'RESETTLEMENT_PLAN',
          )
          if (notStarted(preReleaseSummary.results)) {
            // Optionally skip initial needs assessment if it's not started and we're in the pre-release window
            return res.redirect(`/assessment-skip?prisonerNumber=${prisonerNumber}`)
          }
          // Go to in progress pre-release report
          return res.redirect(`/assessment-task-list?prisonerNumber=${prisonerNumber}&type=RESETTLEMENT_PLAN`)
        }
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

function notStarted(summary: AssessmentStatus[]): boolean {
  return summary.every(({ assessmentStatus }) => assessmentStatus === 'NOT_STARTED')
}
