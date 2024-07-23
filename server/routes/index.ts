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
import licenceImageRouter from './licence-image'
import prisonerDetailsMiddleware from './prisonerDetailsMiddleware'
import { RPClient } from '../data'
import statusUpdateRouter from './status-update/statusUpdateRouter'
import logger from '../../logger'
import addAppointmentRouter from './add-appointment'
import assessmentTaskListRouter from './assessment-task-list'
import assessmentSkipRouter from './assessment-skip'
import immediateNeedsReportRouter from './immediate-needs-report'
import assessmentCompleteRouter from './assessment-complete'
import printRouter from './print'
import { ERROR_DICTIONARY } from '../utils/constants'
import { Appointments } from '../data/model/appointment'
import watchlistRouter from './watchlist'
import analyticsRouter from './analytics'
import configMiddleware from './configMiddleware'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const use = (path: string | string[], handler: RequestHandler) => router.use(path, asyncMiddleware(handler))
  router.use(prisonerDetailsMiddleware(services))
  router.use(configMiddleware(services))
  staffDashboard(router, services)
  drugsAlcoholRouter(router, services)
  attitudesThinkingBehaviourRouter(router, services)
  accommodationRouter(router, services)
  financeIdRouter(router, services)
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
  use('/prisoner-overview', async (req, res, next) => {
    try {
      const { prisonerData } = req
      const { page = 0, size = 10, sort = 'occurenceDateTime%2CDESC', days = 0, selectedPathway = 'All' } = req.query
      const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)

      let licenceConditions: { error?: boolean } = {}
      let riskScores: { error?: boolean } = {}
      let rosh: { error?: boolean } = {}
      let mappa: { error?: boolean } = {}
      let caseNotes: { error?: boolean } = {}
      let staffContacts: { error?: boolean } = {}
      let appointments: Appointments
      try {
        licenceConditions = await rpClient.get(
          `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/licence-condition`,
        )
      } catch (err) {
        logger.warn(
          `Session: ${req.sessionID} Cannot retrieve licence conditions for ${prisonerData.personalDetails.prisonerNumber} ${err.status} ${err}`,
        )
        licenceConditions.error = true
      }
      try {
        riskScores = await rpClient.get(
          `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/risk/scores`,
        )
      } catch (err) {
        logger.warn(
          `Session: ${req.sessionID} Cannot retrieve risk scores for ${prisonerData.personalDetails.prisonerNumber} ${err.status} ${err}`,
        )
        riskScores.error = true
      }

      try {
        rosh = await rpClient.get(
          `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/risk/rosh`,
        )
      } catch (err) {
        logger.warn(
          `Session: ${req.sessionID} Cannot retrieve RoSH for ${prisonerData.personalDetails.prisonerNumber} ${err.status} ${err}`,
        )
        rosh.error = true
      }

      try {
        mappa = await rpClient.get(
          `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/risk/mappa`,
        )
      } catch (err) {
        logger.warn(
          `Session: ${req.sessionID} Cannot retrieve MAPPA for ${prisonerData.personalDetails.prisonerNumber} ${err.status} ${err}`,
        )
        mappa.error = true
      }
      try {
        caseNotes = await rpClient.get(
          `/resettlement-passport/case-notes/${prisonerData.personalDetails.prisonerNumber}?page=${page}&size=${size}&sort=${sort}&days=${days}&pathwayType=${selectedPathway}`,
        )
      } catch (err) {
        logger.warn(
          `Session: ${req.sessionID} Cannot retrieve Case Notes for ${prisonerData.personalDetails.prisonerNumber} ${err.status} ${err}`,
        )
        caseNotes.error = true
      }
      try {
        staffContacts = await rpClient.get(
          `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/staff-contacts`,
        )
      } catch (err) {
        logger.warn(
          `Session: ${req.sessionID} Cannot retrieve Staff Contacts for ${prisonerData.personalDetails.prisonerNumber} ${err.status} ${err}`,
        )
        staffContacts.error = true
      }
      try {
        appointments = (await rpClient.get(
          `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/appointments`,
        )) as Appointments
      } catch (err) {
        logger.warn(
          `Session: ${req.sessionID} Cannot retrieve appointments for ${prisonerData.personalDetails.prisonerNumber} ${err.status} ${err}`,
        )
        appointments = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }

      res.render('pages/overview', {
        licenceConditions,
        prisonerData,
        caseNotes,
        riskScores,
        rosh,
        mappa,
        page,
        size,
        sort,
        days,
        selectedPathway,
        staffContacts,
        appointments,
      })
    } catch (err) {
      next(err)
    }
  })
  use('/licence-image', licenceImageRouter)
  use('/add-case-note', (req: Request, res: Response) => {
    const { prisonerData } = req
    res.render('pages/add-case-note', {
      prisonerData,
    })
  })

  return router
}
