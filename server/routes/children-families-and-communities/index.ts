import express from 'express'

const childrenFamiliesCommunitiesRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  res.render('pages/children-families-communities', { prisonerData })
})

export default childrenFamiliesCommunitiesRouter
