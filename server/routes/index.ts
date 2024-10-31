import { Request, type RequestHandler, Response, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import staffDashboard from './staffDashboard'
import attitudesThinkingBehaviourRouter from './attitudes-thinking-behaviour'
import childrenFamiliesCommunitiesRouter from './children-families-and-communities'
import drugsAlcoholRouter from './drugs-alcohol'
import accommodationRouter from './accommodation'
import healthStatusRouter from './health-status'
import educationSkillsWorkRouter from './education-skills-work'
import financeIdRouter from './finance-id'
import financeIdAddIdRouter from './finance-id-add-id'
import licenceImageRouter from './licence-image'
import prisonerDetailsMiddleware from './prisonerDetailsMiddleware'
import addAppointmentRouter from './add-appointment'
import assessmentTaskListRouter from './assessment-task-list'
import assessmentSkipRouter from './assessment-skip'
import immediateNeedsReportRouter from './immediate-needs-report'
import assessmentCompleteRouter from './assessment-complete'
import printRouter from './print'
import watchlistRouter from './watchlist'
import analyticsRouter from './analytics'
import configMiddleware from './configMiddleware'
import documentRouter from './documents/documentRouter'
import prisonerOverviewRouter from './prisoner-overview/prisonerOverviewRouter'
import resetProfileRouter from './reset-profile'
import statusUpdateRouter from './status-update'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const use = (path: string | string[], handler: RequestHandler) => router.use(path, asyncMiddleware(handler))
  router.use(prisonerDetailsMiddleware(services))
  router.use(configMiddleware())
  staffDashboard(router, services)
  drugsAlcoholRouter(router, services)
  attitudesThinkingBehaviourRouter(router, services)
  accommodationRouter(router, services)
  financeIdRouter(router, services)
  financeIdAddIdRouter(router, services)
  childrenFamiliesCommunitiesRouter(router, services)
  healthStatusRouter(router, services)
  educationSkillsWorkRouter(router, services)
  addAppointmentRouter(router, services)
  assessmentTaskListRouter(router, services)
  immediateNeedsReportRouter(router, services)
  assessmentCompleteRouter(router, services)
  assessmentSkipRouter(router, services)
  printRouter(router, services)
  watchlistRouter(router, services)
  statusUpdateRouter(router, services)
  analyticsRouter(router, services)
  documentRouter(router, services)
  prisonerOverviewRouter(router, services)
  resetProfileRouter(router, services)
  licenceImageRouter(router, services)

  /* ************************************
    REFACTOR USING prisonerOverviewRouter 
  ************************************** */
  // RP2-622 Temporary redirect for access from Delius
  get('/resettlement', (req, res, next) => {
    try {
      const { noms } = req.query
      if (noms) {
        res.redirect(`/prisoner-overview/?prisonerNumber=${noms}`)
      } else {
        next()
      }
    } catch (err) {
      next(err)
    }
  })
  use('/add-case-note', (req: Request, res: Response) => {
    const { prisonerData } = req
    res.render('pages/add-case-note', {
      prisonerData,
    })
  })

  return router
}
