import express from 'express'

const financeIdRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  res.render('pages/finance-id', { prisonerData })
})

export default financeIdRouter
