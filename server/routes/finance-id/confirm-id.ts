import express from 'express'

const confirmIdRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  res.render('pages/add-id-confirm', { prisonerData })
})

export default confirmIdRouter
