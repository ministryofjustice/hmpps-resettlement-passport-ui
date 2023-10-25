import express from 'express'
import { RPClient } from '../../data'
import logger from '../../../logger'

const educationSkillsWorkRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
  let educationSkillsWork: { error?: boolean } = {}

  try {
    educationSkillsWork = await rpClient.get(
      `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/work-readiness`,
    )
  } catch (err) {
    logger.warn(
      `Session: ${req.sessionID} Cannot retrieve education, skills, and work info for ${prisonerData.personalDetails.prisonerNumber} ${err.status} ${err}`,
    )
    educationSkillsWork.error = true
  }

  res.render('pages/education-skills-work', {
    educationSkillsWork,
    prisonerData,
  })
})

export default educationSkillsWorkRouter
