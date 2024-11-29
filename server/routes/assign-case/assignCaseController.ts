import { RequestHandler } from 'express'
import * as querystring from 'node:querystring'
import { ParsedUrlQueryInput } from 'node:querystring'
import RpService from '../../services/rpService'
import { ErrorMessage } from '../view'
import { getFeatureFlagBoolean, toTitleCase, getPaginationPages } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'

export default class AssignCaseController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res): Promise<void> => {
    const pageSize = 20
    const { userActiveCaseLoad } = res.locals
    const errors: ErrorMessage[] = []
    const {
      currentPage = '0',
      allocationSuccess,
      allocatedCases,
      allocatedOtherCount,
      allocatedTo,
      isUnassign,
    } = req.query as AssignPageQuery

    const includePastReleaseDates = await getFeatureFlagBoolean(FEATURE_FLAGS.INCLUDE_PAST_RELEASE_DATES)
    const listOfPrisonerCasesPromise = this.rpService.getListOfPrisonerCases(
      userActiveCaseLoad.caseLoadId,
      includePastReleaseDates,
      parseInt(currentPage, 10),
      pageSize,
    )
    const [prisonersList, resettlementWorkers] = await Promise.all([
      listOfPrisonerCasesPromise,
      this.rpService.getAvailableResettlementWorkers(userActiveCaseLoad.caseLoadId),
    ])

    const { page, totalElements } = prisonersList
    const totalPages = Math.ceil(totalElements / pageSize)
    const pagination = getPaginationPages(page, totalPages, pageSize, totalElements)
    return res.render('pages/assign-a-case', {
      prisonersList,
      resettlementWorkers,
      errors,
      allocationSuccess,
      allocatedCases: Array.isArray(allocatedCases) ? allocatedCases : [allocatedCases],
      allocatedOtherCount,
      allocatedTo,
      isUnassign,
      pagination,
    })
  }

  assignCases: RequestHandler = async (req, res): Promise<void> => {
    const { currentPage, prisonerNumbers, worker } = req.body as AllocationRequestBody
    const prisonersToAllocate = Array.isArray(prisonerNumbers) ? prisonerNumbers : [prisonerNumbers]

    let params: ParsedUrlQueryInput = null
    if (worker === '_unassign') {
      await this.rpService.unassignCaseAllocations({
        nomsIds: prisonersToAllocate,
      })
      params = {
        ...(await this.buildAllocatedCasesParams(prisonersToAllocate)),
        isUnassign: true,
        currentPage,
      }
    } else {
      const workerDetails = JSON.parse(worker)
      const { staffId, firstName, lastName } = workerDetails

      await this.rpService.postCaseAllocations({
        nomsIds: prisonersToAllocate,
        staffId,
        staffFirstName: firstName,
        staffLastName: lastName,
        prisonId: res.locals.userActiveCaseLoad?.caseLoadId,
      })
      params = {
        ...(await this.buildAllocatedCasesParams(prisonersToAllocate)),
        allocatedTo: `${firstName} ${lastName}`,
        currentPage,
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

type AssignPageQuery = {
  currentPage: string

  allocationSuccess: string
  allocatedCases: string[] | string
  allocatedOtherCount: string
  allocatedTo: string
  isUnassign: string
}

type AllocationRequestBody = {
  worker: string
  prisonerNumbers: string[] | string
  currentPage?: string
}
