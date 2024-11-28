import { RequestHandler } from 'express'
import * as querystring from 'node:querystring'
import RpService from '../../services/rpService'
import { ErrorMessage } from '../view'
import { getFeatureFlagBoolean, toTitleCase } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'
import { CaseAllocationResponseItem } from '../../data/model/caseAllocation'

export default class AssignCaseController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res): Promise<void> => {
    const { userActiveCaseLoad } = res.locals
    const errors: ErrorMessage[] = []
    const { allocationSuccess, allocatedCases, allocatedOtherCount, allocatedTo } = req.query

    const includePastReleaseDates = await getFeatureFlagBoolean(FEATURE_FLAGS.INCLUDE_PAST_RELEASE_DATES)
    const [prisonersList, resettlementWorkers] = await Promise.all([
      this.rpService.getListOfPrisonerCases(userActiveCaseLoad.caseLoadId, includePastReleaseDates),
      this.rpService.getAvailableResettlementWorkers(userActiveCaseLoad.caseLoadId),
    ])

    return res.render('pages/assign-a-case', {
      prisonersList,
      resettlementWorkers,
      errors,
      allocationSuccess,
      allocatedCases: Array.isArray(allocatedCases) ? allocatedCases : [allocatedCases],
      allocatedOtherCount,
      allocatedTo,
    })
  }

  assignCases: RequestHandler = async (req, res): Promise<void> => {
    const chosenPrisoners: string[] | string = req.body.prisonerNumbers
    const prisonersToAllocate = Array.isArray(chosenPrisoners) ? chosenPrisoners : [chosenPrisoners]
    const worker = JSON.parse(req.body.worker)
    const assignToId = worker.staffId
    const assignToFirstName = worker.firstName
    const assignToLastName = worker.lastName

    const allocatedCases: CaseAllocationResponseItem[] = await this.rpService.postCaseAllocations({
      nomsIds: prisonersToAllocate,
      staffId: assignToId,
      staffFirstName: assignToFirstName,
      staffLastName: assignToLastName,
    })
    const params = await this.buildSuccessParams(allocatedCases, assignToFirstName, assignToLastName)
    res.redirect(`/assign-a-case?${params}`)
  }

  private async buildSuccessParams(
    allocatedCases: CaseAllocationResponseItem[],
    staffFirstName: string,
    staffLastName: string,
  ) {
    const first5 = allocatedCases.slice(0, 5)
    const prisonerDetails = await Promise.all(
      first5.map(allocation => this.rpService.getPrisonerDetails(allocation.nomsId)),
    )
    const namesAndIds = prisonerDetails.map(({ personalDetails }) => {
      const first = toTitleCase(personalDetails.firstName)
      const last = toTitleCase(personalDetails.lastName)
      return `${first} ${last}, ${personalDetails.prisonerNumber}`
    })
    return querystring.stringify({
      allocationSuccess: true,
      allocatedCases: namesAndIds,
      allocatedOtherCount: allocatedCases.length - Math.min(5, allocatedCases.length),
      allocatedTo: `${staffFirstName} ${staffLastName}`,
    })
  }
}
