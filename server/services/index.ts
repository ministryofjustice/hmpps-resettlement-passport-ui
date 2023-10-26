import { dataAccess } from '../data'
import UserService from './userService'
import RpService from './rpService'
import ComponentService from './componentService'

export const services = () => {
  const { hmppsAuthClient, applicationInfo, rpClient, componentClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const rpService = new RpService(rpClient)
  const componentService = new ComponentService(componentClient)

  return {
    applicationInfo,
    userService,
    rpService,
    componentService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
