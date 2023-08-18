import { NextFunction, Request, Response } from 'express'
import { RPClient } from '../data'
import { PrisonerData } from '../@types/express'
import logger from '../../logger'

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
    } catch (error) {
      const errorMessage = error.message
      logger.error(errorMessage, 'failed to fetch prisoner details')
    }
  }
  next()
}

// req.prisonerData = {
//   prisonerNumber,
//   firstName: 'James',
//   lastName: 'South',
//   cellLocation: 'D3-011',
//   DoB: '1976-07-17',
//   releaseDate: '2023-10-20',
//   releaseType: 'CRD',
//   pathways: [
//     {
//       pathway: 'ACCOMMODATION',
//       status: 'DONE',
//     },
//     {
//       pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
//       status: 'NOT_STARTED',
//     },
//     {
//       pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
//       status: 'SUPPORT_NOT_REQUIRED',
//     },
//     {
//       pathway: 'DRUGS_AND_ALCOHOL',
//       status: 'SUPPORT_DECLINED',
//     },
//     {
//       pathway: 'EDUCATION_SKILLS_AND_WORK',
//       status: 'IN_PROGRESS',
//     },
//     {
//       pathway: 'FINANCE_AND_ID',
//       status: 'IN_PROGRESS',
//     },
//     {
//       pathway: 'HEALTH',
//       status: 'IN_PROGRESS',
//     },
//   ],
// }
