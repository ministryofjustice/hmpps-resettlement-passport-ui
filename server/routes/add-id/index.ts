import express from 'express'

const addIdRouter = express.Router().get('/', (req, res, next) => {
  const { prisonerData } = req
  res.render('pages/add-id', { prisonerData })
})

export default addIdRouter
