import { Router } from 'express'
import { Services } from '../../services'
import PrintController from './printController'

export default (router: Router, services: Services) => {
  const printController = new PrintController(services.rpService, services.prisonerDetailsService)
  router.get('/print/otp', [printController.printOtp])
  router.get('/print/packPdf', [printController.printPackPdf])
}
