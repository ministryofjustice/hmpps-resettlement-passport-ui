import { dataAccess } from '../data'
import UserService from './userService'
import ComponentService from './componentService'
import RpService from './rpService'
import { createAssessmentStateService } from '../data/assessmentStateService'

export const services = () => {
  const { applicationInfo, componentClient, appInsightsClient } = dataAccess()

  const userService = new UserService()
  const rpService = new RpService()
  const componentService = new ComponentService(componentClient)
  const assessmentStateService = createAssessmentStateService()

  return {
    applicationInfo,
    userService,
    rpService,
    componentService,
    assessmentStateService,
    appInsightsClient,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
