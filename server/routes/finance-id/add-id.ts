import express from 'express'

const addIdRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query
  res.render('pages/add-id', { prisonerData, params })
})

export default addIdRouter
