import express from 'express'

const statusUpdateRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  res.render('pages/status-update', { prisonerData })
})

export default statusUpdateRouter
