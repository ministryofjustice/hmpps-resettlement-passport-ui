import express from 'express'

const healthRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  res.render('pages/health', { prisonerData })
})

export default healthRouter
