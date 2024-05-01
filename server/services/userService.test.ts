import UserService from './userService'
import NomisUserRolesApiClient, { UserActiveCaseLoad } from '../data/nomisUserRolesApiClient'
import ManageUsersApiClient, { User } from '../data/manageUsersApiClient'

jest.mock('../data/nomisUserRolesApiClient')
jest.mock('../data/manageUsersApiClient')

const token = 'some token'

describe('User service', () => {
  let nomisUserRolesApiClient: jest.Mocked<NomisUserRolesApiClient>
  let manageUsersApiClient: jest.Mocked<ManageUsersApiClient>
  let userService: UserService

  beforeEach(() => {
    nomisUserRolesApiClient = new NomisUserRolesApiClient(null) as jest.Mocked<NomisUserRolesApiClient>
    ;(NomisUserRolesApiClient as jest.Mock<NomisUserRolesApiClient>).mockImplementation(() => nomisUserRolesApiClient)
    manageUsersApiClient = new ManageUsersApiClient(null) as jest.Mocked<ManageUsersApiClient>
    ;(ManageUsersApiClient as jest.Mock<ManageUsersApiClient>).mockImplementation(() => manageUsersApiClient)
    userService = new UserService()
  })

  describe('getUser', () => {
    it('Retrieves and formats user name', async () => {
      manageUsersApiClient.getUser.mockResolvedValue({ name: 'john smith' } as User)

      const result = await userService.getUser(token)

      expect(result).toEqual({ name: 'john smith', displayName: 'John Smith', username: 'john smith' })
    })
    it('Propagates error', async () => {
      manageUsersApiClient.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
  })

  describe('getUserActiveCaseLoad', () => {
    it('Retrieves use active case load', async () => {
      nomisUserRolesApiClient.getUserActiveCaseLoad.mockResolvedValue({
        activeCaseload: { id: 'BWI', name: 'Berwyn' },
      })

      const result = await userService.getUserActiveCaseLoad(token)

      expect(result).toEqual({
        caseLoadId: 'BWI',
        description: 'Berwyn',
      } as UserActiveCaseLoad)
    })
    it('Propagates error', async () => {
      nomisUserRolesApiClient.getUserActiveCaseLoad.mockRejectedValue(new Error('some error'))

      await expect(userService.getUserActiveCaseLoad(token)).rejects.toEqual(new Error('some error'))
    })
  })
})
