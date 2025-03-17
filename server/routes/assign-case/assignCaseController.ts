import { Request, RequestHandler } from 'express'
import { isNumeric } from 'validator'
import { validationResult } from 'express-validator'
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

    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      // Validation failed, throw 500 error
      throw new Error('Invalid query parameters')
    }

    const {
      currentPage,
      sortField = 'releaseDate',
      sortDirection = 'ASC',
      searchInput = '',
      releaseTime = '0',
      workerId = '',
    } = req.query as AssignPageQuery

    const allocationSuccess = req.flash('allocationSuccess')?.[0]
    const allocatedCases = req.flash('allocatedCases')
    const allocatedOtherCount = req.flash('allocatedOtherCount')?.[0]
    const allocatedTo = req.flash('allocatedTo')?.[0]
    const isUnassign = req.flash('isUnassign')?.[0]
    const allocationErrors = req.flash('allocationErrors')

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
      includePastReleaseDates,
      workerId,
    )
    const [prisonersList, resettlementWorkers] = await Promise.all([
      listOfPrisonerCasesPromise,
      this.rpService.getAvailableResettlementWorkers(userActiveCaseLoad.caseLoadId),
    ])

    const { page, totalElements } = prisonersList
    const pagination = getPaginationPages(page, pageSize, totalElements)

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
      allocationErrors,
      searchInput,
      releaseTime,
      workerId,
    })
  }

  assignCases: RequestHandler = async (req, res): Promise<void> => {
    const errors = validateAssignSubmission(req)
    if (errors) {
      req.flash('allocationErrors', errors)
      return res.redirect(`/assign-a-case?`)
    }
    const { prisonerNumbers, staffId } = req.body as AllocationRequestBody
    const prisonersToAllocate = queryParamToArray(prisonerNumbers)

    if (staffId === '_unassign') {
      await this.rpService.unassignCaseAllocations({
        nomsIds: prisonersToAllocate,
      })
      req.flash('isUnassign', true)
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
      req.flash('allocatedTo', `${staffFirstname} ${staffLastname}`)
    }

    const allocatedCasesParams = await this.buildAllocatedCasesParams(prisonersToAllocate)
    req.flash('allocationSuccess', allocatedCasesParams.allocationSuccess)
    req.flash('allocatedCases', allocatedCasesParams.allocatedCases)
    req.flash('allocatedOtherCount', allocatedCasesParams.allocatedOtherCount)

    return res.redirect(`/assign-a-case?`)
  }

  private async buildAllocatedCasesParams(allocatedPrisoners: string[]) {
    const first5 = allocatedPrisoners.slice(0, 5)
    const prisonerDetails = await Promise.all(first5.map(nomsId => this.rpService.getPrisonerDetails(nomsId)))
    const namesAndIds = prisonerDetails.map(({ personalDetails }) => {
      const first = toTitleCase(personalDetails.firstName)
      const last = toTitleCase(personalDetails.lastName)
      return `${last}, ${first}, ${personalDetails.prisonerNumber}`
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

function validateAssignSubmission(req: Request): string[] | null {
  const { prisonerNumbers, staffId } = req.body as AllocationRequestBody
  const errors: string[] = []
  if (!prisonerNumbers) {
    errors.push('noPrisonersSelected')
  }
  if (!staffId || !validStaffId(staffId)) {
    errors.push('noStaffSelected')
  }
  if (errors.length > 0) {
    return errors
  }
  return null
}

type AssignPageQuery = {
  currentPage: string
  sortField: string
  sortDirection: string
  searchInput: string
  releaseTime: string
  workerId: string
}

type AllocationRequestBody = {
  staffId: string
  prisonerNumbers: string[] | string
}

function queryParamToArray(paramValue: string | string[]): string[] {
  if (Array.isArray(paramValue)) {
    return paramValue
  }
  return paramValue ? [paramValue] : []
}
