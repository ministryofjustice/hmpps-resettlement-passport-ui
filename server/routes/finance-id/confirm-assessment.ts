import express from 'express'

const confirmIdAssessmentRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query
  res.render('pages/id-assessment-confirm', { prisonerData, params, req })
})

export default confirmIdAssessmentRouter
