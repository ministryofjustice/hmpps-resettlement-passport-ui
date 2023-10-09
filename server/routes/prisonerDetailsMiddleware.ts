import { NextFunction, Request, Response } from 'express'
import { RPClient } from '../data'
import { PrisonerData } from '../@types/express'
import logger from '../../logger'

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
  if (prisonerNumber) {
    try {
      const apiResponse = new RPClient(req.sessionID, req.user.username)
      prisonerData = (await apiResponse.get(
        req.user.token,
        `/resettlement-passport/prisoner/${prisonerNumber}`,
      )) as PrisonerData

      prisonerData.prisonerImage = (await apiResponse.getImageAsBase64String(
        req.user.token,
        `/resettlement-passport/prisoner/${prisonerNumber}/image/${prisonerData.personalDetails.facialImageId}`,
      )) as string
    } catch (err) {
      if (err.status === 404) {
        err.customMessage = 'No data found for prisoner'
      }
      next(err)
      return
    }

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
