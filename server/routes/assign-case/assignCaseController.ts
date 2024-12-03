import { Request, RequestHandler } from 'express'
import * as querystring from 'node:querystring'
import { ParsedUrlQueryInput } from 'node:querystring'
import { isNumeric } from 'validator'
import RpService from '../../services/rpService'
import { ErrorMessage } from '../view'
import { getFeatureFlagBoolean, getPaginationPages, toTitleCase } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'
import { CaseAllocationResponseItem } from '../../data/model/caseAllocation'

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
      sortField = 'releaseDate',
      sortDirection = 'ASC',
      allocationSuccess,
      allocatedCases,
      allocatedOtherCount,
      allocatedTo,
      isUnassign,
      allocationErrors,
      searchInput = '',
      releaseTime = '0',
      workerId = '',
    } = req.query as AssignPageQuery

    const includePastReleaseDates = await getFeatureFlagBoolean(FEATURE_FLAGS.INCLUDE_PAST_RELEASE_DATES)
    const listOfPrisonerCasesPromise = this.rpService.getListOfPrisoners(
      userActiveCaseLoad.caseLoadId,
      parseInt(currentPage || '0', 10),
      pageSize,
      sortField,
      sortDirection,
      searchInput,
      releaseTime,
      '',
      '',
      '',
      '',
      includePastReleaseDates,
      workerId,
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
      sortField,
      sortDirection,
      allocationErrors: queryParamToArray(allocationErrors),
      searchInput,
      releaseTime,
      workerId,
    })
  }

  assignCases: RequestHandler = async (req, res): Promise<void> => {
    const errorParams = validateAssignSubmission(req)
    if (errorParams) {
      return res.redirect(`/assign-a-case?${errorParams}`)
    }
    const { currentPage, prisonerNumbers, staffId } = req.body as AllocationRequestBody
    const prisonersToAllocate = queryParamToArray(prisonerNumbers)

    let params: ParsedUrlQueryInput
    if (staffId === '_unassign') {
      await this.rpService.unassignCaseAllocations({
        nomsIds: prisonersToAllocate,
      })
      params = {
        ...(await this.buildAllocatedCasesParams(prisonersToAllocate)),
        isUnassign: true,
        currentPage,
      }
    } else {
      const response: CaseAllocationResponseItem[] = await this.rpService.postCaseAllocations({
        nomsIds: prisonersToAllocate,
        staffId: Number(staffId),
        prisonId: res.locals.userActiveCaseLoad?.caseLoadId,
      })
      if (response.length === 0) {
        throw new Error('Unexpected response with 0 allocations')
      }
      const { staffFirstname, staffLastname } = response[0]

      params = {
        ...(await this.buildAllocatedCasesParams(prisonersToAllocate)),
        allocatedTo: `${staffFirstname} ${staffLastname}`,
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

function validStaffId(staffId: string) {
  return staffId === '_unassign' || isNumeric(staffId, { no_symbols: true })
}

function validateAssignSubmission(req: Request): string | null {
  const { currentPage, prisonerNumbers, staffId } = req.body as AllocationRequestBody
  const errors: string[] = []
  if (!prisonerNumbers) {
    errors.push('noPrisonersSelected')
  }
  if (!staffId || !validStaffId(staffId)) {
    errors.push('noStaffSelected')
  }
  if (errors.length > 0) {
    return querystring.stringify({ allocationErrors: errors, currentPage })
  }
  return null
}

type AssignPageQuery = {
  currentPage: string
  sortField: string
  sortDirection: string

  allocationSuccess?: string
  allocatedCases?: string[] | string
  allocatedOtherCount?: string
  allocatedTo?: string
  isUnassign?: string

  allocationErrors?: string[]

  searchInput: string
  releaseTime: string
  workerId: string
}

type AllocationRequestBody = {
  staffId: string
  prisonerNumbers: string[] | string
  currentPage?: string
}

function queryParamToArray(paramValue: string | string[]): string[] {
  if (Array.isArray(paramValue)) {
    return paramValue
  }
  return paramValue ? [paramValue] : []
}
