import express from 'express'

const accommodationRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  res.render('pages/accommodation', { prisonerData })
})

export default accommodationRouter
