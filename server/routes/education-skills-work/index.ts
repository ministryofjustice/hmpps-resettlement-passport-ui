import { Router } from 'express'
import { Services } from '../../services'
import EducationSkillsWorkController from './educationSkillsWorkController'

export default (router: Router, services: Services) => {
  const educationSkillsWorkController = new EducationSkillsWorkController(services.rpService)
  router.get('/education-skills-and-work', [educationSkillsWorkController.getView])
}
