import { type RequestHandler, Router, NextFunction, Request, Response } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import staffDashboard from './staffDashboard'
import prisonerOverviewRouter from './prisoner-overview'
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
import prisonerDetailsMiddleware from './prisonerDetailsMiddleware'

export default function routes(services: Services): Router {
  const router = Router()
  // const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const use = (path: string | string[], handler: RequestHandler) => router.use(path, asyncMiddleware(handler))
  router.use(prisonerDetailsMiddleware)
  staffDashboard(router, services)
  use('/prisoner-overview', prisonerOverviewRouter)
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
  use('/status-update/:selectedPathway', (req: Request, res: Response, next) => {
    const { prisonerData } = req
    const { selectedPathway } = req.params
    res.render('pages/status-update', { prisonerData, selectedPathway })
  })

  return router
}
