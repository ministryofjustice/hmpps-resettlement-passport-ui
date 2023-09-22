import express from 'express'

const confirmBankAccountRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query
  res.render('pages/add-bank-account-confirm', { prisonerData, params, req })
})

export default confirmBankAccountRouter
