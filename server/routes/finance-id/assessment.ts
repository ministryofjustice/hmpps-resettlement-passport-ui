import express from 'express'

const idAssessmentRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  res.render('pages/id-assessment', { prisonerData })
})

export default idAssessmentRouter
