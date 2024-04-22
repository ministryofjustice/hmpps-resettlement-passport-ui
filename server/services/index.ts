import { dataAccess } from '../data'
import UserService from './userService'
import ComponentService from './componentService'
import RpService from './rpService'

export const services = () => {
  const { applicationInfo, rpClient, componentClient } = dataAccess()

  const userService = new UserService()
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
