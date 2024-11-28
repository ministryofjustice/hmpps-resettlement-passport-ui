import { RequestHandler } from 'express'
import * as querystring from 'node:querystring'
import { ParsedUrlQueryInput } from 'node:querystring'
import RpService from '../../services/rpService'
import { ErrorMessage } from '../view'
import { getFeatureFlagBoolean, toTitleCase } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'

export default class AssignCaseController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res): Promise<void> => {
    const { userActiveCaseLoad } = res.locals
    const errors: ErrorMessage[] = []
    const { allocationSuccess, allocatedCases, allocatedOtherCount, allocatedTo, isUnassign } = req.query

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
      isUnassign,
    })
  }

  assignCases: RequestHandler = async (req, res): Promise<void> => {
    const chosenPrisoners: string[] | string = req.body.prisonerNumbers
    const prisonersToAllocate = Array.isArray(chosenPrisoners) ? chosenPrisoners : [chosenPrisoners]

    let params: ParsedUrlQueryInput = null
    if (req.body.worker === '_unassign') {
      await this.rpService.unassignCaseAllocations({
        nomsIds: prisonersToAllocate,
      })
      params = {
        ...(await this.buildAllocatedCasesParams(prisonersToAllocate)),
        isUnassign: true,
      }
    } else {
      const worker = JSON.parse(req.body.worker)
      const { staffId, firstName, lastName } = worker

      await this.rpService.postCaseAllocations({
        nomsIds: prisonersToAllocate,
        staffId,
        staffFirstName: firstName,
        staffLastName: lastName,
      })
      params = {
        ...(await this.buildAllocatedCasesParams(prisonersToAllocate)),
        allocatedTo: `${firstName} ${lastName}`,
      }
    }

    res.redirect(`/assign-a-case?${querystring.stringify(params)}`)
  }

  private async buildAllocatedCasesParams(allocatedPrisoners: string[]) {
    const first5 = allocatedPrisoners.slice(0, 5)
    const prisonerDetails = await Promise.all(first5.map(nomsId => this.rpService.getPrisonerDetails(nomsId)))
    const namesAndIds = prisonerDetails.map(({ personalDetails }) => {
      const first = toTitleCase(personalDetails.firstName)
      const last = toTitleCase(personalDetails.lastName)
      return `${first} ${last}, ${personalDetails.prisonerNumber}`
    })
    return {
      allocationSuccess: true,
      allocatedCases: namesAndIds,
      allocatedOtherCount: allocatedPrisoners.length - Math.min(5, allocatedPrisoners.length),
    }
  }
}
