import express from 'express'

const confirmIdRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query
  res.render('pages/add-id-confirm', { prisonerData, params, req })
})

export default confirmIdRouter
