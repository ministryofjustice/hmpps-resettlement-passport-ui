import { Router } from 'express'
import { Services } from '../../services'
import EducationSkillsWorkController from './educationSkillsWorkController'
import { getValidationForPathwayQuery } from '../../utils/utils'

export default (router: Router, services: Services) => {
  const educationSkillsWorkController = new EducationSkillsWorkController(
    services.rpService,
    services.prisonerDetailsService,
  )
  router.get(
    '/education-skills-and-work',
    educationSkillsWorkController.validateQuery.concat(getValidationForPathwayQuery()),
    [educationSkillsWorkController.getView],
  )
}
