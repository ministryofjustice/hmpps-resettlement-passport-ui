import express from 'express'

const updateIdStatusRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query
  res.render('pages/add-id-update-status', { prisonerData, params, req })
})

export default updateIdStatusRouter
