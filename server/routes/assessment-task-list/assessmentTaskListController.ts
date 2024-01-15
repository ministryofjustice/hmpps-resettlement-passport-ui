import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AssessmentTaskListView from './assessmentTaskListView'
import { AssessmentStatus } from '../../data/model/assessmentStatus'

export default class AssessmentTaskListController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req

    // FETCH PATHWAY ASSESSMENT STATUSES
    const assessmentStatuses: AssessmentStatus[] = [
      {
        pathway: 'ACCOMMODATION',
        assessmentStatus: 'NOT_STARTED',
      },
      {
        pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
        assessmentStatus: 'COMPLETE',
      },
      {
        pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
        assessmentStatus: 'COMPLETE',
      },
      {
        pathway: 'DRUGS_AND_ALCOHOL',
        assessmentStatus: 'COMPLETE',
      },
      {
        pathway: 'EDUCATION_SKILLS_AND_WORK',
        assessmentStatus: 'COMPLETE',
      },
      {
        pathway: 'FINANCE_AND_ID',
        assessmentStatus: 'COMPLETE',
      },
      {
        pathway: 'HEALTH',
        assessmentStatus: 'COMPLETE',
      },
    ]

    const BCST2Completed = assessmentStatuses.every(
      (status: AssessmentStatus) => status.assessmentStatus === 'COMPLETE',
    )

    const view = new AssessmentTaskListView(prisonerData, assessmentStatuses, BCST2Completed)
    res.render('pages/assessment-task-list', { ...view.renderArgs })
  }
}
