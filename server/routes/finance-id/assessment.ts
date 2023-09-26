import express from 'express'

const assessmentRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query
  res.render('pages/assessment', { prisonerData, params })
})

export default assessmentRouter
