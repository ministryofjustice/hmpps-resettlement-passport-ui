import { NextFunction, Request, Response } from 'express'
import { RPClient } from '../data'
import { PrisonerData } from '../@types/express'
import logger from '../../logger'

export async function getPrisonerImage(
  client: RPClient,
  prisonerData: PrisonerData,
  prisonerNumber: string,
): Promise<string> {
  try {
    if (prisonerData.personalDetails.facialImageId) {
      return await client.getImageAsBase64String(
        `/resettlement-passport/prisoner/${prisonerNumber}/image/${prisonerData.personalDetails.facialImageId}`,
      )
    }
    logger.info(`No image available for ${prisonerNumber}`)
  } catch (err) {
    logger.warn(`Unable to load image for ${prisonerNumber} received ${err.status}`)
  }
  return null
}

export default async function prisonerDetailsMiddleware(req: Request, res: Response, next: NextFunction) {
  /* *******************************
    FETCH PRISONER PROFILE DATA HERE
  ********************************* */
  let { prisonerNumber } = req.query
  let prisonerData = null

  if (!prisonerNumber) {
    const { prisonerNumber: bodyPrisonerNumber } = req.body
    prisonerNumber = prisonerNumber || bodyPrisonerNumber
  }
  const client = new RPClient(req.user.token, req.sessionID, req.user.username)
  if (prisonerNumber) {
    try {
      prisonerData = (await client.get(`/resettlement-passport/prisoner/${prisonerNumber}`)) as PrisonerData
    } catch (err) {
      if (err.status === 404) {
        err.customMessage = 'No data found for prisoner'
      }
      next(err)
      return
    }

    prisonerData.prisonerImage = await getPrisonerImage(client, prisonerData, prisonerNumber as string)

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
}
