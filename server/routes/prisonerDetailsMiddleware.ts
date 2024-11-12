import { NextFunction, Request, Response } from 'express'
import { PrisonerData } from '../@types/express'
import logger from '../../logger'
import { Services } from '../services'
import RpService from '../services/rpService'

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

export default function prisonerDetailsMiddleware({ rpService }: Services) {
  return async (req: Request, res: Response, next: NextFunction) => {
    /* *******************************
      FETCH PRISONER PROFILE DATA HERE
    ********************************* */
    let { prisonerNumber }: { prisonerNumber?: string } = req.query
    let prisonerData = null

    try {
      if (!prisonerNumber) {
        const { prisonerNumber: bodyPrisonerNumber } = req.body
        prisonerNumber = prisonerNumber || bodyPrisonerNumber
      }

      if (prisonerNumber) {
        try {
          prisonerData = await rpService.getPrisonerDetails(prisonerNumber)
        } catch (err) {
          if (err.status === 404) {
            err.customMessage = 'No data found for prisoner'
          }
          next(err)
          return
        }

        prisonerData.prisonerImage = await getPrisonerImage(rpService, prisonerData, prisonerNumber)

        // RP2-490 If the prisoner's prison does not match the user's caseload then we need to treat this as not found
        if (
          res.locals.user.authSource === 'nomis' &&
          res.locals.userActiveCaseLoad.caseLoadId !== prisonerData?.personalDetails.prisonId
        ) {
          logger.warn(
            `User ${res.locals.user.username} trying to access prisoner ${prisonerNumber} in ${prisonerData?.personalDetails.prisonId} from outside caseload ${res.locals.userActiveCaseLoad.caseLoadId}.`,
          )
          next({
            customMessage: 'No data found for prisoner',
          })
          return
        }
      }

      req.prisonerData = prisonerData
      next()
    } catch (err) {
      err.customMessage = 'No data found for prisoner'
      next(err)
    }
  }
}
