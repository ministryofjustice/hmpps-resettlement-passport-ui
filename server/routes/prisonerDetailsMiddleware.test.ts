import { getPrisonerImage } from './prisonerDetailsMiddleware'
import { RPClient } from '../data'
import { PrisonerData } from '../@types/express'

describe('Prisoner Details Middleware', () => {
  let rpClient: jest.Mocked<RPClient>

  beforeEach(() => {
    rpClient = new RPClient() as jest.Mocked<RPClient>
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should get image happy path', async () => {
    const spy = jest
      .spyOn(rpClient, 'getImageAsBase64String')
      .mockImplementation(() => Promise.resolve('aBase64ImageHonest'))
    const prisonerData = {
      personalDetails: {
        facialImageId: '1234',
      },
    }
    const prisonerImage = await getPrisonerImage(rpClient, prisonerData as PrisonerData, 'abc')
    expect(prisonerImage).toBe('aBase64ImageHonest')

    expect(spy).toHaveBeenCalledWith(`/resettlement-passport/prisoner/abc/image/1234`)
  })

  it('Should return null if there is an error loading the image', async () => {
    const spy = jest
      .spyOn(rpClient, 'getImageAsBase64String')
      .mockImplementation(() => Promise.reject(Error('It broke')))

    const prisonerData = {
      personalDetails: {
        facialImageId: '1234',
      },
    }
    const prisonerImage = await getPrisonerImage(rpClient, prisonerData as PrisonerData, 'abc')
    expect(prisonerImage).toBe(null)

    expect(spy).toHaveBeenCalledWith(`/resettlement-passport/prisoner/abc/image/1234`)
  })

  it('Should not call the api if there is no prisoner image', async () => {
    const spy = jest.spyOn(rpClient, 'getImageAsBase64String')

    const prisonerData = {
      personalDetails: {
        facialImageId: null as string,
      },
    }
    const prisonerImage = await getPrisonerImage(rpClient, prisonerData as PrisonerData, 'abc')
    expect(prisonerImage).toBe(null)

    expect(spy).toHaveBeenCalledTimes(0)
  })
})
