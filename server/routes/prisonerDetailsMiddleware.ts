import { NextFunction, Request, Response } from 'express'
import { RPClient } from '../data'
import { PrisonerData } from '../@types/express'

export default async function prisonerDetailsMiddleware(req: Request, res: Response, next: NextFunction) {
  /* *******************************
    FETCH PRISONER PROFILE DATA HERE
  ********************************* */
  const { prisonerNumber } = req.query
  if (prisonerNumber) {
    try {
      const apiResponse = new RPClient()
      const prisonerData = (await apiResponse.get(
        req.user.token,
        `/resettlement-passport/prisoner/${prisonerNumber}`,
      )) as PrisonerData

      const prisonerImage = (await apiResponse.getImageAsBase64String(
        req.user.token,
        `/resettlement-passport/prisoner/${prisonerNumber}/image/${prisonerData.personalDetails.facialImageId}`,
      )) as string
      prisonerData.prisonerImage = prisonerImage
      req.prisonerData = prisonerData
    } catch (err) {
      next(err)
    }
  }
  next()
}
