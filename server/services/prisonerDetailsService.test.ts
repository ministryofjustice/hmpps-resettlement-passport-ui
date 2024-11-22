import { getPrisonerImage } from './prisonerDetailsService'
import { PrisonerData } from '../@types/express'
import RpService from './rpService'

describe('Prisoner Details Middleware', () => {
  let rpService: jest.Mocked<RpService>

  beforeEach(() => {
    rpService = new RpService() as jest.Mocked<RpService>
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should get image happy path', async () => {
    const spy = jest
      .spyOn(rpService, 'getPrisonerImage')
      .mockImplementation(() => Promise.resolve('aBase64ImageHonest'))
    const prisonerData = {
      personalDetails: {
        facialImageId: '1234',
      },
    }
    const prisonerImage = await getPrisonerImage(rpService, prisonerData as PrisonerData, 'abc')
    expect(prisonerImage).toBe('aBase64ImageHonest')

    expect(spy).toHaveBeenCalledWith('abc', '1234')
  })

  it('Should return null if there is an error loading the image', async () => {
    const spy = jest.spyOn(rpService, 'getPrisonerImage').mockImplementation(() => Promise.reject(Error('It broke')))

    const prisonerData = {
      personalDetails: {
        facialImageId: '1234',
      },
    }
    const prisonerImage = await getPrisonerImage(rpService, prisonerData as PrisonerData, 'abc')
    expect(prisonerImage).toBe(null)

    expect(spy).toHaveBeenCalledWith('abc', '1234')
  })

  it('Should not call the api if there is no prisoner image', async () => {
    const spy = jest.spyOn(rpService, 'getPrisonerImage')

    const prisonerData = {
      personalDetails: {
        facialImageId: null as string,
      },
    }
    const prisonerImage = await getPrisonerImage(rpService, prisonerData as PrisonerData, 'abc')
    expect(prisonerImage).toBe(null)

    expect(spy).toHaveBeenCalledTimes(0)
  })

  it('Should not call the api if there is prisoner number not valid', async () => {
    const spy = jest.spyOn(rpService, 'getPrisonerImage')

    const prisonerData = {
      personalDetails: {
        facialImageId: null as string,
      },
    }
    const prisonerImage = await getPrisonerImage(rpService, prisonerData as PrisonerData, 'abc')
    expect(prisonerImage).toBe(null)

    expect(spy).toHaveBeenCalledTimes(0)
  })
})
