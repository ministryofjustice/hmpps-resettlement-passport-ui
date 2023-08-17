import express, { Request, Response } from 'express'

const statusUpdateRouter = express.Router()

statusUpdateRouter.get('/:pathwayName', async (req, res, next) => {
  const { prisonerData } = req
  const { pathwayName } = req.params
  console.log(pathwayName)
  res.render('pages/status-update', { prisonerData, pathwayName })
})

export default statusUpdateRouter
