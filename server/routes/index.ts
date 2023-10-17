import { type RequestHandler, Router, Request, Response } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import staffDashboard from './staffDashboard'
import attitudesThinkingBehaviourRouter from './attitudes-thinking-behaviour'
import childrenFamiliesCommunitiesRouter from './children-families-and-communities'
import drugsAlcoholRouter from './drugs-alcohol'
import educationSkillsWorkRouter from './education-skills-work'
import financeIdRouter from './finance-id'
import addBankAccountRouter from './finance-id/add-bank-account'
import healthRouter from './health-status'
import licenceImageRouter from './licence-image'
import assessmentRouter from './finance-id/assessment'
import addIdRouter from './finance-id/add-id'
import confirmBankAccountRouter from './finance-id/confirm-bank-account'
import confirmIdRouter from './finance-id/confirm-id'
import prisonerDetailsMiddleware from './prisonerDetailsMiddleware'
import { RPClient } from '../data'
import { getEnumByURL, getEnumValue } from '../utils/utils'
import logger from '../../logger'
import updateBankAccountStatusRouter from './finance-id/update-status-bank-account'
import confirmAssessmentRouter from './finance-id/confirm-assessment'
import addIdFurtherRouter from './finance-id/add-id-further'
import updateIdStatusRouter from './finance-id/update-status-id'
import confirmIdStatusRouter from './finance-id/confirm-id-status'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const use = (path: string | string[], handler: RequestHandler) => router.use(path, asyncMiddleware(handler))
  router.use(prisonerDetailsMiddleware)
  staffDashboard(router, services)
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
  use('/accommodation', async (req, res, next) => {
    const { prisonerData } = req
    const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
    let accommodation: { error?: boolean } = {}

    try {
      accommodation = await rpClient.get(
        `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/accommodation`,
      )
    } catch (err) {
      logger.warn(
        `Session: ${req.sessionID} Cannot retrieve accommodation info for ${prisonerData.personalDetails.prisonerNumber} ${err.status} ${err}`,
      )
      accommodation.error = true
    }

    res.render('pages/accommodation', {
      accommodation,
      prisonerData,
    })
  })
  use('/attitudes-thinking-and-behaviour', attitudesThinkingBehaviourRouter)
  use('/children-families-and-communities', childrenFamiliesCommunitiesRouter)
  use('/drugs-and-alcohol', drugsAlcoholRouter)
  use('/education-skills-and-work', educationSkillsWorkRouter)
  use('/finance-and-id', financeIdRouter)
  use('/finance-and-id/add-an-id', addIdRouter)
  use('/finance-and-id/add-a-bank-account', addBankAccountRouter)
  use('/health-status', healthRouter)
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
  use('/finance-and-id/assessment-submit/', async (req: Request, res: Response, next) => {
    const { prisonerData } = req
    const params = req.body
    const { prisonerNumber, assessmentDate, isBankAccountRequired, isIdRequired } = req.body
    let idDocuments: object | null | undefined = null
    idDocuments = req.body.idDocuments
    if (idDocuments === null) {
      idDocuments = []
    }
    if (typeof idDocuments === 'string') {
      idDocuments = [idDocuments]
    }

    const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
    try {
      await rpClient.post(`/resettlement-passport/prisoner/${prisonerNumber}/assessment`, {
        assessmentDate,
        isBankAccountRequired,
        isIdRequired,
        idDocuments,
        nomsId: prisonerNumber,
      })
      res.redirect(`/finance-and-id?prisonerNumber=${prisonerNumber}`)
    } catch (error) {
      const errorMessage = error.message
      logger.error('Error fetching assessment:', error)
      res.render('pages/assessment-confirmation', {
        errorMessage,
        prisonerData,
        params,
      })
    }
  })

  use('/finance-and-id/bank-account-submit/', async (req: Request, res: Response, next) => {
    const { prisonerData } = req
    const params = req.body
    const { prisonerNumber, applicationDate, bankName } = req.body

    const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
    try {
      await rpClient.post(`/resettlement-passport/prisoner/${prisonerNumber}/bankapplication`, {
        applicationSubmittedDate: applicationDate,
        bankName,
      })
      res.redirect(`/finance-and-id/?prisonerNumber=${prisonerNumber}`)
    } catch (error) {
      const errorMessage = error.message
      logger.error('Error fetching finance data:', error)
      res.render('pages/add-bank-account-confirm', {
        errorMessage,
        prisonerData,
        params,
      })
    }
  })
  use('/finance-and-id/id-submit/', async (req: Request, res: Response, next) => {
    const { prisonerData } = req
    const params = req.body
    const {
      prisonerNumber,
      idType,
      applicationSubmittedDate,
      haveGro,
      isUkNationalBornOverseas,
      countryBornIn,
      isPriorityApplication,
      caseNumber,
      courtDetails,
      driversLicenceType,
      driversLicenceApplicationMadeAt,
    } = req.body
    const costOfApplication = Number(req.body.costOfApplication)
    const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
    try {
      await rpClient.post(`/resettlement-passport/prisoner/${prisonerNumber}/idapplication`, {
        idType,
        applicationSubmittedDate,
        isPriorityApplication,
        costOfApplication,
        haveGro,
        isUkNationalBornOverseas,
        countryBornIn,
        caseNumber,
        courtDetails,
        driversLicenceType,
        driversLicenceApplicationMadeAt,
      })
      res.redirect(`/finance-and-id/?prisonerNumber=${prisonerNumber}`)
    } catch (error) {
      const errorMessage = error.message
      logger.error('Error fetching id data:', error)
      res.render('pages/add-id-confirm', {
        errorMessage,
        prisonerData,
        params,
      })
    }
  })

  use('/finance-and-id/bank-account-update/', async (req: Request, res: Response, next) => {
    const { prisonerData } = req
    const params = req.body
    const {
      prisonerNumber,
      applicationId,
      updatedStatus,
      bankResponseDate,
      isAddedToPersonalItems,
      addedToPersonalItemsDate,
      resubmissionDate,
    } = req.body

    const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
    try {
      await rpClient.patch(`/resettlement-passport/prisoner/${prisonerNumber}/bankapplication/${applicationId}`, {
        status: updatedStatus,
        bankResponseDate,
        isAddedToPersonalItems: isAddedToPersonalItems === 'Yes',
        addedToPersonalItemsDate,
        resubmissionDate,
      })
      res.redirect(`/finance-and-id/?prisonerNumber=${prisonerNumber}`)
    } catch (error) {
      const errorMessage = error.message
      logger.error('Error updating banking application:', error)
      res.render('pages/add-bank-account-confirm', {
        errorMessage,
        prisonerData,
        params,
      })
    }
  })

  use('/finance-and-id/id-update/', async (req: Request, res: Response, next) => {
    const { prisonerData } = req
    const params = req.body
    const {
      prisonerNumber,
      applicationId,
      isAddedToPersonalItems,
      addedToPersonalItemsDate,
      updatedStatus,
      statusUpdateDate,
      dateIdReceived,
    } = req.body

    const refundAmount = Number(req.body.refundAmount)
    const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
    try {
      await rpClient.patch(`/resettlement-passport/prisoner/${prisonerNumber}/idapplication/${applicationId}`, {
        status: updatedStatus,
        isAddedToPersonalItems,
        addedToPersonalItemsDate,
        statusUpdateDate,
        dateIdReceived,
        refundAmount,
      })
      res.redirect(`/finance-and-id/?prisonerNumber=${prisonerNumber}`)
    } catch (error) {
      const errorMessage = error.message
      logger.error('Error updating id application:', error)
      res.render('pages/add-id-update-status-confirm', {
        errorMessage,
        prisonerData,
        params,
      })
    }
  })

  use('/finance-and-id', financeIdRouter)
  use('/finance-and-id/add-an-id', addIdRouter)
  use('/finance-and-id/add-a-bank-account', addBankAccountRouter)
  use('/finance-and-id/update-bank-account-status', updateBankAccountStatusRouter)
  use('/finance-and-id/confirm-assessment', confirmAssessmentRouter)
  use('/finance-and-id/confirm-add-a-bank-account', confirmBankAccountRouter)
  use('/finance-and-id/confirm-add-an-id', confirmIdRouter)
  use('/finance-and-id/assessment', assessmentRouter)
  use('/finance-and-id/add-an-id-further', addIdFurtherRouter)
  use('/finance-and-id/update-id-status', updateIdStatusRouter)
  use('/finance-and-id/confirm-add-an-id-status', confirmIdStatusRouter)

  return router
}
