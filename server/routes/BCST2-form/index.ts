import { Router } from 'express'
import { Services } from '../../services'
import BCST2FormController from './BCST2FormController'

export default (router: Router, services: Services) => {
  const bcst2FormController = new BCST2FormController(services.rpService)

  router.get('/BCST2-next-page', [bcst2FormController.getNextPage])
  router.post('/BCST2-next-page', [bcst2FormController.saveAnswerAndGetNextPage])
  router.get('/BCST2-assessment/pathway/:pathway/page/:pageId', [bcst2FormController.getView])
}
