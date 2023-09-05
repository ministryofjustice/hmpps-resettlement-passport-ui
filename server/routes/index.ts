import { type RequestHandler, Router, Request, Response } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import staffDashboard from './staffDashboard'
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
import { RPClient } from '../data'
import { getEnumByURL } from '../utils/utils'
import logger from '../../logger'

export default function routes(services: Services): Router {
  const router = Router()
  // const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const use = (path: string | string[], handler: RequestHandler) => router.use(path, asyncMiddleware(handler))
  router.use(prisonerDetailsMiddleware)
  staffDashboard(router, services)
  /* ************************************
    REFACTOR USING prisonerOverviewRouter 
  ************************************** */
  use('/prisoner-overview', async (req, res, next) => {
    const { prisonerData } = req
    const rpClient = new RPClient()

    let licenceConditions: { error?: boolean } = {}
    let riskScores: { error?: boolean } = {}
    let rosh: { error?: boolean } = {}
    let mappa: { error?: boolean } = {}
    let caseNotes: { error?: boolean } = {}

    const { page = 0, size = 10 } = req.query
    try {
      licenceConditions = await rpClient.get(
        req.user.token,
        `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/licence-condition`,
      )
    } catch (err) {
      logger.warn(`Cannot retrieve licence conditions for ${prisonerData.personalDetails.prisonerNumber}`, err)
      licenceConditions.error = true
    }

    try {
      riskScores = await rpClient.get(
        req.user.token,
        `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/risk/scores`,
      )
    } catch (err) {
      logger.warn(`Cannot retrieve risk scores for ${prisonerData.personalDetails.prisonerNumber}`, err)
      riskScores.error = true
    }

    try {
      rosh = await rpClient.get(
        req.user.token,
        `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/risk/rosh`,
      )
    } catch (err) {
      logger.warn(`Cannot retrieve RoSH for ${prisonerData.personalDetails.prisonerNumber}`, err)
      rosh.error = true
    }

    try {
      mappa = await rpClient.get(
        req.user.token,
        `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/risk/mappa`,
      )
    } catch (err) {
      logger.warn(`Cannot retrieve MAPPA for ${prisonerData.personalDetails.prisonerNumber}`, err)
      mappa.error = true
    }
    try {
      caseNotes = await rpClient.get(
        req.user.token,
        `/resettlement-passport/case-notes/${prisonerData.personalDetails.prisonerNumber}?page=${page}&size=${size}&sort=occurenceDateTime%2CDESC`,
      )
    } catch (err) {
      logger.warn(`Cannot retrieve Case Notes for ${prisonerData.personalDetails.prisonerNumber}`, err)
      caseNotes.error = true
    }
    res.render('pages/overview', { licenceConditions, prisonerData, riskScores, rosh, mappa, page, size })
  })
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
  use('/status-update/:selectedPathway', async (req: Request, res: Response, next) => {
    const { prisonerData } = req
    const { selectedPathway } = req.params
    const { state } = req.query
    const token = res.locals?.user?.token

    const rpClient = new RPClient()

    let updateSuccessful = false
    if (state) {
      try {
        await rpClient.patch(
          token,
          `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/pathway`,
          {
            pathway: getEnumByURL(selectedPathway),
            status: state,
          },
        )
        updateSuccessful = true
      } catch (error) {
        logger.error(error)
      }
    }
    res.render('pages/status-update', { prisonerData, selectedPathway, updateSuccessful, state })
  })

  return router
}
