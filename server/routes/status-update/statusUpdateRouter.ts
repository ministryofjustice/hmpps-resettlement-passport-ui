import { Request, Response, Router } from 'express'
import { getEnumByURL, getEnumValue } from '../../utils/utils'
import { Services } from '../../services'
import logger from '../../../logger'

export default (router: Router, { rpService }: Services) => {
  router.get('/status-update', async (req: Request, res: Response, next) => {
    try {
      const { prisonerData } = req
      const { selectedPathway } = req.query

      return res.render('pages/status-update', {
        prisonerData,
        selectedPathway,
        serverUpdate: 'none',
      })
    } catch (err) {
      return next(err)
    }
  })

  router.post('/status-update', async (req: Request, res: Response, _) => {
    const { prisonerData } = req
    const { selectedStatus, selectedPathway } = req.body

    const { prisonerNumber } = prisonerData.personalDetails
    const caseNoteInput = req.body[`caseNoteInput_${selectedStatus}`] || null

    if (!selectedStatus) {
      return res.render('pages/status-update', {
        prisonerData,
        selectedPathway,
        serverUpdate: 'validation',
        caseNoteInput,
      })
    }

    try {
      const status = getEnumValue(selectedStatus).name
      await rpService.patchStatusWithCaseNote(prisonerNumber, {
        pathway: getEnumByURL(selectedPathway),
        status: selectedStatus,
        caseNoteText: `Resettlement status set to: ${status}. ${caseNoteInput || ''}`,
      })
      return res.redirect(`/${selectedPathway}?prisonerNumber=${prisonerNumber}#case-notes`)
    } catch (error) {
      logger.warn(error, 'Failed to set status')
      return res.render('pages/status-update', {
        prisonerData,
        selectedPathway,
        serverUpdate: 'error',
        selectedStatus,
        caseNoteInput,
      })
    }
  })
}
