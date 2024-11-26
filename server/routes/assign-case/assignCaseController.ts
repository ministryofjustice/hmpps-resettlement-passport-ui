import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AssignCaseView from './assignCaseView'
import { ErrorMessage } from '../view'
import { getFeatureFlagBoolean } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'

export default class AssignCaseController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { userActiveCaseLoad } = res.locals
    const errors: ErrorMessage[] = []
    let prisonersList = null

    try {
      const includePastReleaseDates = await getFeatureFlagBoolean(FEATURE_FLAGS.INCLUDE_PAST_RELEASE_DATES)
      prisonersList = await this.rpService.getListOfPrisonerCases(
        userActiveCaseLoad.caseLoadId,
        includePastReleaseDates,
      )
      const view = new AssignCaseView(prisonersList, errors)
      return res.render('pages/assign-a-case', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}
