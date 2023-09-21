import express from 'express'

const idAssessmentRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query
  res.render('pages/id-assessment', { prisonerData, params })
})

export default idAssessmentRouter
