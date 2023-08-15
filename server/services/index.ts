import { dataAccess } from '../data'
import UserService from './userService'
import PrisonService from './prisonService'

export const services = () => {
  const { hmppsAuthClient, applicationInfo, rpClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonService = new PrisonService(rpClient)

  return {
    applicationInfo,
    userService,
    prisonService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
