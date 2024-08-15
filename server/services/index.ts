import { dataAccess } from '../data'
import UserService from './userService'
import ComponentService from './componentService'
import RpService from './rpService'
import { createAssessmentStateService } from '../data/assessmentStateService'
import DocumentService from './documentService'

export const services = () => {
  const { applicationInfo, componentClient, appInsightsClient } = dataAccess()

  const userService = new UserService()
  const rpService = new RpService()
  const componentService = new ComponentService(componentClient)
  const assessmentStateService = createAssessmentStateService()
  const documentService = new DocumentService()

  return {
    applicationInfo,
    userService,
    rpService,
    componentService,
    assessmentStateService,
    appInsightsClient,
    documentService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
