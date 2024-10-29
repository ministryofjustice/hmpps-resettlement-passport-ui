import { RequestHandler } from 'express'

export default class AddBankAccountController {
  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    res.render('pages/add-bank-account', { prisonerData })
  }
}
