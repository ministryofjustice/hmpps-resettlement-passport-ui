import { Router } from 'express'
import { body } from 'express-validator'
import { Services } from '../../services'
import SupportNeedUpdateController from './supportNeedUpdateController'
import { SupportNeedStatus } from '../../data/model/supportNeedStatus'
import { readOnlyGuard } from '../readOnlyGuard'

export default (router: Router, services: Services) => {
  const supportNeedUpdateController = new SupportNeedUpdateController(
    services.prisonerDetailsService,
    services.rpService,
  )

  router.get('/support-needs/:pathway/update/:prisonerNeedId', [supportNeedUpdateController.getSupportNeedUpdateForm])

  router.post(
    '/support-needs/:pathway/update/:prisonerNeedId',
    [
      readOnlyGuard,
      body('updateStatus', 'Select a update status').isIn([
        SupportNeedStatus.NOT_STARTED,
        SupportNeedStatus.IN_PROGRESS,
        SupportNeedStatus.MET,
        SupportNeedStatus.DECLINED,
      ]),
      body('responsibleStaff', 'Select who is responsible for this support need')
        .toArray()
        .isArray({ min: 1 })
        .isIn(['PRISON', 'PROBATION']),
      body('additionalDetails', 'Additional details must be 3,000 characters or less').isLength({ max: 3000 }),
    ],
    supportNeedUpdateController.postSupportNeedUpdateForm,
  )
}
