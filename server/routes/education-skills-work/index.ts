import express from 'express'

const educationSkillsWorkRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  res.render('pages/education-skills-work', { prisonerData })
})

export default educationSkillsWorkRouter
