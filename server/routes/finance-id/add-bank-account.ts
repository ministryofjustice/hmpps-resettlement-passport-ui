import express from 'express'

const addBankAccountRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query
  res.render('pages/add-bank-account', { prisonerData, params })
})

export default addBankAccountRouter
