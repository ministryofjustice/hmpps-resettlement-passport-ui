import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AssignCaseView from './assignCaseView'
import { ErrorMessage } from '../view'
import { getFeatureFlagBoolean, getPaginationPages } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'

export default class AssignCaseController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const pageSize = 20
    const { currentPage = '0' } = req.query as { currentPage: string }
    const { userActiveCaseLoad } = res.locals
    const errors: ErrorMessage[] = []
    let prisonersList = null

    try {
      const includePastReleaseDates = await getFeatureFlagBoolean(FEATURE_FLAGS.INCLUDE_PAST_RELEASE_DATES)
      prisonersList = await this.rpService.getListOfPrisonerCases(
        userActiveCaseLoad.caseLoadId,
        includePastReleaseDates,
        parseInt(currentPage, 10),
        pageSize,
      )
      const { page, totalElements } = prisonersList
      const totalPages = Math.ceil(totalElements / pageSize)

      const pagination = getPaginationPages(page, totalPages, pageSize, totalElements)

      const view = new AssignCaseView(prisonersList, pagination, currentPage, pageSize, totalElements, errors)
      return res.render('pages/assign-a-case', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}
