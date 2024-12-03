import { RequestHandler } from 'express'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import { handleWhatsNewBanner } from '../whatsNewBanner'

export default class CaseNoteController {
  constructor(private readonly prisonerDetailsService: PrisonerDetailsService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)
      handleWhatsNewBanner(req, res)
      return res.render('pages/add-case-note', {
        prisonerData,
      })
    } catch (err) {
      return next(err)
    }
  }
}
