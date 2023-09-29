import express from 'express'

const addIdFurtherRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query
  res.render('pages/add-id-further', { prisonerData, params, req })
})

export default addIdFurtherRouter
