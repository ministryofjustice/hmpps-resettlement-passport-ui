import { dataAccess } from '../data'
import UserService from './userService'
import PrisonService from './prisonService'
import ComponentService from './componentService'

export const services = () => {
  const { hmppsAuthClient, applicationInfo, rpClient, componentClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonService = new PrisonService(rpClient)
  const componentService = new ComponentService(componentClient)

  return {
    applicationInfo,
    userService,
    prisonService,
    componentService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
