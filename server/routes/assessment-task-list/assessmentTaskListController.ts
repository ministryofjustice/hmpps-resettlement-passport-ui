import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AssessmentTaskListView from './assessmentTaskListView'

export default class AssessmentTaskListController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData, assessmentsSummary, BCST2Completed } = req

    const view = new AssessmentTaskListView(prisonerData, assessmentsSummary, BCST2Completed)
    res.render('pages/assessment-task-list', { ...view.renderArgs })
  }
}
