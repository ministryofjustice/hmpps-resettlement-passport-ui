import express from 'express'

const attitudesThinkingBehaviourRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  res.render('pages/attitudes-thinking-behaviour', { prisonerData })
})

export default attitudesThinkingBehaviourRouter
