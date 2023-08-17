import express from 'express'

const addBankAccountRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  res.render('pages/add-bank-account', { prisonerData })
})

export default addBankAccountRouter
