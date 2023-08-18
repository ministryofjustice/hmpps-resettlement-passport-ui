import { NextFunction, Request, Response } from 'express'

export default function prisonerDetailsMiddleware(req: Request, res: Response, next: NextFunction) {
  /* *******************************
    FETCH PRISONER PROFILE DATA HERE
  ********************************* */
  const { prisonerId } = req.query
  if (prisonerId) {
    req.prisonerData = {
      prisonerId,
      firstName: 'James',
      lastName: 'South',
      cellLocation: 'D3-011',
      DoB: '1976-07-17',
      releaseDate: '2023-10-20',
      releaseType: 'CRD',
      pathways: [
        {
          pathway: 'ACCOMMODATION',
          status: 'DONE',
        },
        {
          pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
          status: 'NOT_STARTED',
        },
        {
          pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
          status: 'SUPPORT_NOT_REQUIRED',
        },
        {
          pathway: 'DRUGS_AND_ALCOHOL',
          status: 'SUPPORT_DECLINED',
        },
        {
          pathway: 'EDUCATION_SKILLS_AND_WORK',
          status: 'IN_PROGRESS',
        },
        {
          pathway: 'FINANCE_AND_ID',
          status: 'IN_PROGRESS',
        },
        {
          pathway: 'HEALTH',
          status: 'IN_PROGRESS',
        },
      ],
    }
  }
  next()
}
