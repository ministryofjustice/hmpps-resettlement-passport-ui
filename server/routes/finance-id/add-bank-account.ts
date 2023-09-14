import express from 'express'

const addBankAccountouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  res.render('pages/add-bank-account', { prisonerData })
})

export default addBankAccountouter
