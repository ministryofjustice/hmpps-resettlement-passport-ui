import express from 'express'

const drugsAlcoholRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  res.render('pages/drugs-alcohol', { prisonerData })
})

export default drugsAlcoholRouter
