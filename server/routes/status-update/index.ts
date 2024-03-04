import express from 'express'

const statusUpdateRouter = express.Router()

statusUpdateRouter.get('/:selectedPathway', (req, res, next) => {
  const { prisonerData } = req
  const { selectedPathway } = req.params
  res.render('pages/status-update', { prisonerData, selectedPathway })
})

export default statusUpdateRouter
