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
      req.prisonerData = prisonerData
    } catch (err) {
      next(err)
    }
  }
  next()
}
