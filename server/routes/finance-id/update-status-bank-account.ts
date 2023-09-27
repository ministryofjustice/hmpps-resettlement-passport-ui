import express from 'express'

const updateBankAccountStatusRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query
  res.render('pages/add-bank-account-update-status', { prisonerData, params, req })
})

export default updateBankAccountStatusRouter
