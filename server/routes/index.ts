import { type RequestHandler, Router, Request, Response } from 'express'

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
import { getEnumByURL, getEnumValue } from '../utils/utils'
import logger from '../../logger'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const use = (path: string | string[], handler: RequestHandler) => router.use(path, asyncMiddleware(handler))
  router.use(prisonerDetailsMiddleware)
  staffDashboard(router, services)
  drugsAlcoholRouter(router, services)
  attitudesThinkingBehaviourRouter(router, services)
  accommodationRouter(router, services)
  financeIdRouter(router, services)
  healthStatusRouter(router, services)
  /* ************************************
    REFACTOR USING prisonerOverviewRouter 
  ************************************** */
  // RP2-622 Temporary redirect for access from Delius
  get('/resettlement', async (req, res, next) => {
    const { noms } = req.query
    if (noms) {
      res.redirect(`/prisoner-overview/?prisonerNumber=${noms}`)
    } else {
      next()
    }
  })
  use('/prisoner-overview', async (req, res, next) => {
    const { prisonerData } = req
    const { page = 0, size = 10, sort = 'occurenceDateTime%2CDESC', days = 0, selectedPathway = 'All' } = req.query
    const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)

    let licenceConditions: { error?: boolean } = {}
    let riskScores: { error?: boolean } = {}
    let rosh: { error?: boolean } = {}
    let mappa: { error?: boolean } = {}
    let caseNotes: { error?: boolean } = {}
    let staffContacts: { error?: boolean } = {}
    let appointments: { error?: boolean } = {}
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
      appointments = await rpClient.get(
        `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/appointments?page=0&size=1000`,
      )
    } catch (err) {
      logger.warn(
        `Session: ${req.sessionID} Cannot retrieve appointments for ${prisonerData.personalDetails.prisonerNumber} ${err.status} ${err}`,
      )
      appointments.error = true
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
  })

  use('/children-families-and-communities', childrenFamiliesCommunitiesRouter)
  use('/education-skills-and-work', educationSkillsWorkRouter)
  use('/licence-image', licenceImageRouter)
  use('/add-case-note', async (req: Request, res: Response) => {
    const { prisonerData } = req
    res.render('pages/add-case-note', {
      prisonerData,
    })
  })
  use('/status-update/', async (req: Request, res: Response, next) => {
    const { prisonerData } = req
    let { state, selectedPathway, _csrf }: { state?: string; selectedPathway?: string; _csrf?: string } = req.query
    // If query parameters are not provided, try to get values from the request body
    if (!state || !selectedPathway || !_csrf) {
      const { state: bodyState, selectedPathway: bodyPathway, _csrf: bodyCsrf } = req.body
      // Use the values from the request body if they exist
      state = state || bodyState
      selectedPathway = selectedPathway || bodyPathway
      _csrf = _csrf || bodyCsrf
    }
    const caseNoteInput = req.body[`caseNoteInput_${state}`] || null

    const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)

    let updateSuccessful = false
    if (state) {
      try {
        await rpClient.patch(`/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/pathway`, {
          pathway: getEnumByURL(selectedPathway),
          status: state,
        })
        await rpClient.post(`/resettlement-passport/case-notes/${prisonerData.personalDetails.prisonerNumber}`, {
          pathway: getEnumByURL(selectedPathway),
          text: `Resettlement status set to: ${getEnumValue(state).name}. ${caseNoteInput || ''}`,
        })
        updateSuccessful = true
      } catch (error) {
        logger.error(error)
      }
    }
    let caseNotes: { error?: boolean } = {}
    const { page = 0, size = 10, sort = 'occurenceDateTime%2CDESC', days = 0, createdByUserId = 0 } = req.query
    try {
      caseNotes = await rpClient.get(
        `/resettlement-passport/case-notes/${
          prisonerData.personalDetails.prisonerNumber
        }?page=${page}&size=${size}&sort=${sort}&days=${days}&pathwayType=${getEnumByURL(
          selectedPathway,
        )}&createdByUserId=${createdByUserId}`,
      )
    } catch (err) {
      logger.warn(
        `Session: ${req.sessionID} Cannot retrieve Case Notes for ${prisonerData.personalDetails.prisonerNumber} ${err.status} ${err}`,
      )
      caseNotes.error = true
    }

    let caseNoteCreators: { error?: boolean } = {}
    try {
      caseNoteCreators = await rpClient.get(
        `/resettlement-passport/case-notes/${prisonerData.personalDetails.prisonerNumber}/creators/${getEnumByURL(
          selectedPathway,
        )}`,
      )
    } catch (err) {
      logger.warn(
        `Session: ${req.sessionID} Cannot retrieve Case Notes creators for ${prisonerData.personalDetails.prisonerNumber} ${err.status} ${err}`,
      )
      caseNoteCreators.error = true
    }
    res.render('pages/status-update', {
      prisonerData,
      selectedPathway,
      updateSuccessful,
      state,
      caseNotes,
      caseNoteCreators,
      createdByUserId,
      size,
      page,
      sort,
      days,
    })
  })

  return router
}
