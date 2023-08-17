import { type RequestHandler, Router, NextFunction, Request, Response } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import staffDashboard from './staffDashboard'
import prisonerOverviewRouter from './prisoner-overview'
import statusUpdateRouter from './status-update'
import accommodationRouter from './accommodation'
import attitudesThinkingBehaviourRouter from './attitudes-thinking-behaviour'
import childrenFamiliesCommunitiesRouter from './children-families-and-communities'
import drugsAlcoholRouter from './drugs-alcohol'
import educationSkillsWorkRouter from './education-skills-work'
import financeIdRouter from './finance-id'
import addIdRouter from './add-id'
import addBankAccountRouter from './add-bank-account'
import healthRouter from './health-status'
import licenceImageRouter from './licence-image'

function prisonerDetailsMiddleware(req: Request, res: Response, next: NextFunction) {
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

export default function routes(services: Services): Router {
  const router = Router()
  // const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const use = (path: string | string[], handler: RequestHandler) => router.use(path, asyncMiddleware(handler))
  router.use(prisonerDetailsMiddleware)
  staffDashboard(router, services)
  use('/prisoner-overview', prisonerOverviewRouter)
  use('/status-update', statusUpdateRouter)
  use('/accommodation', accommodationRouter)
  use('/attitudes-thinking-and-behaviour', attitudesThinkingBehaviourRouter)
  use('/children-families-and-communities', childrenFamiliesCommunitiesRouter)
  use('/drugs-and-alcohol', drugsAlcoholRouter)
  use('/education-skills-and-work', educationSkillsWorkRouter)
  use('/finance-and-id', financeIdRouter)
  use('/add-an-id', addIdRouter)
  use('/add-a-bank-account', addBankAccountRouter)
  use('/health-status', healthRouter)
  use('/licence-image', licenceImageRouter)

  return router
}
