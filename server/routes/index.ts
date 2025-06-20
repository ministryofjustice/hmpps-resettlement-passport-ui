import { Router } from 'express'
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
import addAppointmentRouter from './add-appointment'
import assessmentTaskListRouter from './assessment-task-list'
import assessmentSkipRouter from './assessment-skip'
import immediateNeedsReportRouter from './immediate-needs-report'
import assessmentCompleteRouter from './assessment-complete'
import printRouter from './print'
import analyticsRouter from './analytics'
import configMiddleware from './configMiddleware'
import documentRouter from './documents/documentRouter'
import prisonerOverviewRouter from './prisoner-overview/prisonerOverviewRouter'
import resetProfileRouter from './reset-profile'
import statusUpdateRouter from './status-update'
import financeIdBankAccountRouter from './finance-id-bank-account'
import serviceUpdates from './service-updates'
import assignCaseRouter from './assign-case'
import staffCapacityRouter from './staff-capacity'
import caseNoteRouter from './case-note'
import featureFlagMiddleware from './featureFlagMiddleware'
import supportNeedsRouter from './support-needs'
import supportNeedUpdateRouter from './support-need-update'
import bannerMiddleware from './bannerMiddleware'

export default function routes(services: Services): Router {
  const router = Router()
  router.use(configMiddleware())
  router.use(featureFlagMiddleware())
  router.use(bannerMiddleware())
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
  statusUpdateRouter(router, services)
  analyticsRouter(router, services)
  documentRouter(router, services)
  prisonerOverviewRouter(router, services)
  resetProfileRouter(router, services)
  licenceImageRouter(router, services)
  financeIdBankAccountRouter(router, services)
  serviceUpdates(router)
  assignCaseRouter(router, services)
  staffCapacityRouter(router, services)
  caseNoteRouter(router, services)
  supportNeedsRouter(router, services)
  supportNeedUpdateRouter(router, services)
  return router
}
