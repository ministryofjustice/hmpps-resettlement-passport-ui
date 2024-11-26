import { Request, Response } from 'express'
import { isAlphanumeric } from 'validator'
import { PrisonerData } from '../@types/express'
import logger from '../../logger'
import RpService from './rpService'

const notFoundMessage = 'No data found for prisoner'

export async function getPrisonerImage(
  rpService: RpService,
  prisonerData: PrisonerData,
  prisonerNumber: string,
): Promise<string> {
  try {
    if (prisonerData.personalDetails.facialImageId) {
      return await rpService.getPrisonerImage(prisonerNumber, prisonerData.personalDetails.facialImageId)
    }
    logger.info(`No image available for ${prisonerNumber}`)
  } catch (err) {
    logger.warn(`Unable to load image for ${prisonerNumber} received ${err.status}`)
  }
  return null
}

export default class PrisonerDetailsService {
  constructor(private readonly rpService: RpService) {
    // no-op
  }

  async loadPrisonerDetailsFromParam(req: Request, res: Response, fetchImage: boolean = true): Promise<PrisonerData> {
    const { prisonerNumber }: { prisonerNumber?: string } = req.query
    if (!prisonerNumber || !isAlphanumeric(prisonerNumber)) {
      throw notFoundError()
    }
    return this.getPrisonerData(prisonerNumber, res, fetchImage)
  }

  async loadPrisonerDetailsFromBody(req: Request, res: Response, fetchImage: boolean = true): Promise<PrisonerData> {
    const { prisonerNumber }: { prisonerNumber?: string } = req.body
    if (!prisonerNumber || !isAlphanumeric(prisonerNumber)) {
      throw notFoundError()
    }
    return this.getPrisonerData(prisonerNumber, res, fetchImage)
  }

  private async getPrisonerData(prisonerNumber: string, res: Response, fetchImage: boolean) {
    let prisonerData: PrisonerData
    try {
      prisonerData = await this.rpService.getPrisonerDetails(prisonerNumber)
    } catch (err) {
      if (err.status === 404) {
        err.customMessage = notFoundMessage
      }
      throw err
    }

    // If the prisoner's prison does not match the user's caseload then we need to treat this as not found
    if (
      res.locals.user.authSource === 'nomis' &&
      res.locals.userActiveCaseLoad.caseLoadId !== prisonerData?.personalDetails.prisonId
    ) {
      logger.warn(
        `User ${res.locals.user.username} trying to access prisoner ${prisonerNumber} in ${prisonerData?.personalDetails.prisonId} from outside caseload ${res.locals.userActiveCaseLoad.caseLoadId}.`,
      )
      throw new Error(notFoundMessage)
    }

    if (fetchImage) {
      prisonerData.prisonerImage = await getPrisonerImage(this.rpService, prisonerData, prisonerNumber)
    }

    return prisonerData
  }
}

interface ErrorWithStatus extends Error {
  status?: number
  customMessage?: string
  message: string
}

function notFoundError(): ErrorWithStatus {
  const error = new Error(notFoundMessage) as ErrorWithStatus
  error.status = 404
  error.customMessage = notFoundMessage
  return error
}
