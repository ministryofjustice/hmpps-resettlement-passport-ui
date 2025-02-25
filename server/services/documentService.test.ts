import { RPClient } from '../data'
import DocumentService from './documentService'
import * as UserContext from '../middleware/userContextMiddleware'

describe('Document Service', () => {
  const service = new DocumentService()

  describe('createClient', () => {
    it('Should return an RPClient', async () => {
      jest.spyOn(UserContext, 'currentUser').mockReturnValue({
        token: 'token',
        sessionId: 'sessionId',
        userId: 'userId',
      })

      const result = service.createClient()

      expect(result).toBeInstanceOf(RPClient)
    })
  })
})
