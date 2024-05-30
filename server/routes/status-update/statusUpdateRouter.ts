import { Request, Response, Router } from 'express'
import { getEnumByURL, getEnumValue, getFeatureFlagBoolean } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'
import { Services } from '../../services'
import logger from '../../../logger'

export default (router: Router, { rpService }: Services) => {
  router.get('/status-update/', async (req: Request, res: Response, next) => {
    try {
      const { prisonerData } = req
      const { state, selectedPathway, serverUpdate } = req.query

      return res.render('pages/status-update', {
        prisonerData,
        selectedPathway,
        serverUpdate: serverUpdate || 'none',
        state,
      })
    } catch (err) {
      return next(err)
    }
  })

  router.post('/status-update', async (req: Request, res: Response, next) => {
    const { prisonerData } = req
    const { state, selectedPathway } = req.body

    const isnDeliusCaseNotesEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.DELIUS_CASE_NOTES)
    if (res.locals.user.authSource === 'delius' && !isnDeliusCaseNotesEnabled) {
      return res.redirect(
        `/${selectedPathway}/?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}#case-notes?serverUpdate=deliusUserError`,
      )
    }

    const caseNoteInput = req.body[`caseNoteInput_${state}`] || null

    if (!state) {
      return res.redirect(
        `/${selectedPathway}/?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}#case-notes?serverUpdate=novalid`,
      )
    }

    try {
      const status = getEnumValue(state).name
      await rpService.patchStatusWithCaseNote(req.user.token, req.prisonerData?.personalDetails?.prisonerNumber, {
        pathway: getEnumByURL(selectedPathway),
        status: state,
        caseNoteText: `Resettlement status set to: ${status}. ${caseNoteInput || ''}`,
      })
      return res.redirect(
        `/${selectedPathway}/?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}#case-notes?serverUpdate=success`,
      )
    } catch (error) {
      logger.warn(error, 'Failed to set status')
      return res.redirect(
        `/${selectedPathway}/?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}#case-notes?serverUpdate=error`,
      )
    }
  })
}
