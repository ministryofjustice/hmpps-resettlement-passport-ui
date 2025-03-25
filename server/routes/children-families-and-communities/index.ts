import { Router } from 'express'
import { Services } from '../../services'
import ChildrenFamiliesCommunitiesController from './childrenFamiliesCommunitiesController'

export default (router: Router, services: Services) => {
  const childrenFamiliesCommunitiesController = new ChildrenFamiliesCommunitiesController(
    services.rpService,
    services.prisonerDetailsService,
  )

  router.get('/children-families-and-communities', childrenFamiliesCommunitiesController.validateQuery, [
    childrenFamiliesCommunitiesController.getView,
  ])
}
