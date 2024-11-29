import { RequestHandler, Request } from 'express'
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
      currentPage,
      allocationSuccess,
      allocatedCases,
      allocatedOtherCount,
      allocatedTo,
      isUnassign,
      allocationErrors,
    } = req.query as AssignPageQuery

    const includePastReleaseDates = await getFeatureFlagBoolean(FEATURE_FLAGS.INCLUDE_PAST_RELEASE_DATES)
    const listOfPrisonerCasesPromise = this.rpService.getListOfPrisonerCases(
      userActiveCaseLoad.caseLoadId,
      includePastReleaseDates,
      parseInt(currentPage || '0', 10),
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
      allocatedCases: queryParamToArray(allocatedCases),
      allocatedOtherCount,
      allocatedTo,
      isUnassign,
      pagination,
      allocationErrors: queryParamToArray(allocationErrors),
    })
  }

  assignCases: RequestHandler = async (req, res): Promise<void> => {
    const errorParams = validateAssignSubmission(req)
    if (errorParams) {
      return res.redirect(`/assign-a-case?${errorParams}`)
    }
    const { currentPage, prisonerNumbers, worker } = req.body as AllocationRequestBody
    const prisonersToAllocate = queryParamToArray(prisonerNumbers)

    let params: ParsedUrlQueryInput
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

    return res.redirect(`/assign-a-case?${querystring.stringify(params)}`)
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

function validateAssignSubmission(req: Request): string | null {
  const { currentPage, prisonerNumbers, worker } = req.body as AllocationRequestBody
  const errors: string[] = []
  if (!prisonerNumbers) {
    errors.push('noPrisonersSelected')
  }
  if (!worker) {
    errors.push('noStaffSelected')
  }
  if (errors.length > 0) {
    return querystring.stringify({ allocationErrors: errors, currentPage })
  }
  return null
}

type AssignPageQuery = {
  currentPage: string

  allocationSuccess?: string
  allocatedCases?: string[] | string
  allocatedOtherCount?: string
  allocatedTo?: string
  isUnassign?: string

  allocationErrors?: string[]
}

type AllocationRequestBody = {
  worker: string
  prisonerNumbers: string[] | string
  currentPage?: string
}

function queryParamToArray(paramValue: string | string[]): string[] {
  if (Array.isArray(paramValue)) {
    return paramValue
  }
  return paramValue ? [paramValue] : []
}
