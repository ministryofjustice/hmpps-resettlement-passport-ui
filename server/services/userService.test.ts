import UserService from './userService'
import NomisUserRolesApiClient, { User, UserActiveCaseLoad } from '../data/nomisUserRolesApiClient'

jest.mock('../data/nomisUserRolesApiClient')

const token = 'some token'

describe('User service', () => {
  let nomisUserRolesApiClient: jest.Mocked<NomisUserRolesApiClient>
  let userService: UserService

  beforeEach(() => {
    nomisUserRolesApiClient = new NomisUserRolesApiClient(null) as jest.Mocked<NomisUserRolesApiClient>
    ;(NomisUserRolesApiClient as jest.Mock<NomisUserRolesApiClient>).mockImplementation(() => nomisUserRolesApiClient)
    userService = new UserService()
  })

  describe('getUser', () => {
    it('Retrieves and formats user name', async () => {
      nomisUserRolesApiClient.getUser.mockResolvedValue({ name: 'john smith' } as User)

      const result = await userService.getUser(token)

      expect(result).toEqual({ name: 'john smith', displayName: 'John Smith', username: 'john smith' })
    })
    it('Propagates error', async () => {
      nomisUserRolesApiClient.getUser.mockRejectedValue(new Error('some error'))

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
