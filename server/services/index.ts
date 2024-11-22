import { dataAccess } from '../data'
import UserService from './userService'
import ComponentService from './componentService'
import RpService from './rpService'
import { createAssessmentStateService } from '../data/assessmentStateService'
import DocumentService from './documentService'
import PrisonerDetailsService from './prisonerDetailsService'
import { AppInsightsService } from '../utils/analytics'

export const services = () => {
  const { applicationInfo, componentClient, appInsightsClient } = dataAccess()

  const userService = new UserService()
  const rpService = new RpService()
  const componentService = new ComponentService(componentClient)
  const assessmentStateService = createAssessmentStateService()
  const documentService = new DocumentService()
  const prisonerDetailsService = new PrisonerDetailsService(rpService)
  const appInsightsService = new AppInsightsService(appInsightsClient)

  return {
    applicationInfo,
    userService,
    rpService,
    componentService,
    assessmentStateService,
    appInsightsService,
    documentService,
    prisonerDetailsService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
