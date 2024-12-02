import request from 'supertest'
import type { Express } from 'express'
import Config from '../../s3Config'
import {
  expectSomethingWentWrongPage,
  parseHtmlDocument,
  redirectedToPath,
  stubPrisonerDetails,
  stubPrisonersCasesList,
} from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import FeatureFlags from '../../featureFlag'
import { PersonalDetails, PrisonerData } from '../../@types/express'

let app: Express
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>
const { rpService } = mockedServices

beforeEach(() => {
  jest.mock('applicationinsights', () => jest.fn())
  configHelper(config)

  app = appWithAllRoutes({})

  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)

  stubPrisonerDetails(rpService)
})
afterEach(() => {
  jest.resetAllMocks()
})

function stubAvailableResettlementWorkers() {
  rpService.getAvailableResettlementWorkers.mockResolvedValue([
    {
      staffId: 1,
      firstName: 'Staff1First',
      lastName: 'Staff1Last',
    },
    {
      staffId: 2,
      firstName: 'Staff2First',
      lastName: 'Staff2Last',
    },
  ])
}

describe('getView', () => {
  it('Error case - rpService throws error getting prisoner list', async () => {
    rpService.getListOfPrisonerCases.mockRejectedValue(new Error('Something went wrong'))

    await request(app)
      .get('/assign-a-case')
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
    expect(rpService.getListOfPrisonerCases).toHaveBeenCalledWith('MDI', true, 0, 20)
  })

  it('Error case - rpService throws error getting resettlement workers', async () => {
    stubPrisonersCasesList(rpService)
    rpService.getAvailableResettlementWorkers.mockRejectedValue(new Error('Something went wrong'))

    await request(app)
      .get('/assign-a-case')
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
    expect(rpService.getListOfPrisonerCases).toHaveBeenCalledWith('MDI', true, 0, 20)

    expect(rpService.getAvailableResettlementWorkers).toHaveBeenCalledWith('MDI')
  })

  it('Happy path with default query params', async () => {
    const getPrisonerListSpy = stubPrisonersCasesList(rpService)
    stubAvailableResettlementWorkers()

    await request(app)
      .get('/assign-a-case')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith('MDI', true, 0, 20)
  })

  test('Should show message that assignments cannot be made with no resettlement workers available', async () => {
    stubPrisonersCasesList(rpService)
    rpService.getAvailableResettlementWorkers.mockResolvedValue([])

    await request(app)
      .get('/assign-a-case')
      .expect(200)
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(document.getElementById('assign-case-control')).toMatchSnapshot()
      })
  })

  test('shows success dialog for assign', async () => {
    const getPrisonerListSpy = stubPrisonersCasesList(rpService)
    stubAvailableResettlementWorkers()

    await request(app)
      .get('/assign-a-case')
      .expect(200)
      .query({
        allocationSuccess: true,
        allocatedCases: ['John Smith, A1234DY', 'Some Guy, G4161UF', 'A.n Other, G5384GE'],
        allocatedTo: 'Joe Blogs',
        allocatedOtherCount: 7,
      })
      .expect(res => {
        const doc = parseHtmlDocument(res.text)
        expect(doc.getElementById('success-alert').outerHTML).toMatchSnapshot()
      })
    expect(getPrisonerListSpy).toHaveBeenCalledWith('MDI', true, 0, 20)
  })

  test('shows success dialog for unassign', async () => {
    const getPrisonerListSpy = stubPrisonersCasesList(rpService)
    stubAvailableResettlementWorkers()

    await request(app)
      .get('/assign-a-case')
      .expect(200)
      .query({
        allocationSuccess: true,
        allocatedCases: ['John Smith, A1234DY', 'Some Guy, G4161UF', 'A.n Other, G5384GE'],
        allocatedTo: 'Joe Blogs',
        allocatedOtherCount: 7,
        isUnassign: true,
      })
      .expect(res => {
        const doc = parseHtmlDocument(res.text)
        expect(doc.getElementById('success-alert').outerHTML).toMatchSnapshot()
      })
    expect(getPrisonerListSpy).toHaveBeenCalledWith('MDI', true, 0, 20)
  })

  test('shows error dialog for unassign', async () => {
    stubPrisonersCasesList(rpService)
    stubAvailableResettlementWorkers()

    await request(app)
      .get('/assign-a-case')
      .expect(200)
      .query({
        allocationErrors: ['noPrisonersSelected', 'noStaffSelected'],
      })
      .expect(res => {
        const doc = parseHtmlDocument(res.text)
        expect(doc.querySelector('.govuk-error-summary').outerHTML).toMatchSnapshot()
      })
  })
})

describe('post', () => {
  test('successfully assign a single case', async () => {
    rpService.postCaseAllocations.mockResolvedValue([
      { nomsId: 'A8731DY', staffId: 123, staffFirstname: 'First', staffLastname: 'Last' },
    ])

    const res = await request(app)
      .post('/assign-a-case')
      .send({
        prisonerNumbers: 'A8731DY',
        staffId: '123',
      })
      .expect(302)

    const { searchParams, pathname } = new URL(redirectedToPath(res), 'https://host.com')
    expect(pathname).toEqual('/assign-a-case')
    expect(searchParams.getAll('allocatedCases')).toEqual(['John Smith, A1234DY'])
    expect(searchParams.get('allocationSuccess')).toEqual('true')
    expect(searchParams.get('allocatedTo')).toEqual('First Last')

    expect(rpService.postCaseAllocations).toHaveBeenCalledWith({
      prisonId: 'MDI',
      nomsIds: ['A8731DY'],
      staffId: 123,
    })
  })

  test('successfully assign a multiple cases', async () => {
    rpService.postCaseAllocations.mockResolvedValue([
      { nomsId: 'A8731DY', staffId: 123, staffFirstname: 'First', staffLastname: 'Last' },
      { nomsId: 'G4161UF', staffId: 123, staffFirstname: 'First', staffLastname: 'Last' },
      { nomsId: 'G4161UF', staffId: 123, staffFirstname: 'First', staffLastname: 'Last' },
    ])
    rpService.getPrisonerDetails
      .mockResolvedValueOnce(prisonerData('A1234DY', 'John', 'Smith'))
      .mockResolvedValueOnce(prisonerData('G4161UF', 'SOME', 'GUY'))
      .mockResolvedValueOnce(prisonerData('G5384GE', 'A.N', 'Other'))

    const res = await request(app)
      .post('/assign-a-case')
      .send({
        prisonerNumbers: ['A8731DY', 'G4161UF', 'G5384GE'],
        staffId: '123',
      })
      .expect(302)

    const { searchParams, pathname } = new URL(redirectedToPath(res), 'https://host.com')
    expect(pathname).toEqual('/assign-a-case')
    expect(searchParams.getAll('allocatedCases')).toEqual([
      'John Smith, A1234DY',
      'Some Guy, G4161UF',
      'A.n Other, G5384GE',
    ])
    expect(searchParams.get('allocationSuccess')).toEqual('true')
    expect(searchParams.get('allocatedTo')).toEqual('First Last')

    expect(rpService.postCaseAllocations).toHaveBeenCalledWith({
      prisonId: 'MDI',
      nomsIds: ['A8731DY', 'G4161UF', 'G5384GE'],
      staffId: 123,
    })
  })

  test('Shows error page when API throws error when assigning', async () => {
    rpService.postCaseAllocations.mockRejectedValue(new Error('Boom!'))

    await request(app)
      .post('/assign-a-case')
      .send({
        prisonerNumbers: ['A8731DY', 'G4161UF', 'G5384GE'],
        staffId: 123,
      })
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  test('successfully unassign a single case', async () => {
    const res = await request(app)
      .post('/assign-a-case')
      .send({
        prisonerNumbers: 'A8731DY',
        staffId: '_unassign',
      })
      .expect(302)

    const { searchParams, pathname } = new URL(redirectedToPath(res), 'https://host.com')
    expect(pathname).toEqual('/assign-a-case')
    expect(searchParams.getAll('allocatedCases')).toEqual(['John Smith, A1234DY'])
    expect(searchParams.get('allocationSuccess')).toEqual('true')
    expect(searchParams.get('isUnassign')).toEqual('true')

    expect(rpService.unassignCaseAllocations).toHaveBeenCalledWith({
      nomsIds: ['A8731DY'],
    })
  })

  test('successfully unassign a multiple cases', async () => {
    rpService.getPrisonerDetails
      .mockResolvedValueOnce(prisonerData('A1234DY', 'John', 'Smith'))
      .mockResolvedValueOnce(prisonerData('G4161UF', 'SOME', 'GUY'))
      .mockResolvedValueOnce(prisonerData('G5384GE', 'A.N', 'Other'))

    const res = await request(app)
      .post('/assign-a-case')
      .send({
        prisonerNumbers: ['A8731DY', 'G4161UF', 'G5384GE'],
        staffId: '_unassign',
      })
      .expect(302)

    const { searchParams, pathname } = new URL(redirectedToPath(res), 'https://host.com')
    expect(pathname).toEqual('/assign-a-case')
    expect(searchParams.getAll('allocatedCases')).toEqual([
      'John Smith, A1234DY',
      'Some Guy, G4161UF',
      'A.n Other, G5384GE',
    ])
    expect(searchParams.get('allocationSuccess')).toEqual('true')
    expect(searchParams.get('isUnassign')).toEqual('true')

    expect(rpService.unassignCaseAllocations).toHaveBeenCalledWith({
      nomsIds: ['A8731DY', 'G4161UF', 'G5384GE'],
    })
  })

  test('validation failure, missing prisoner number and staff id', async () => {
    const res = await request(app).post('/assign-a-case').send({}).expect(302)
    const { searchParams, pathname } = new URL(redirectedToPath(res), 'https://host.com')
    expect(pathname).toEqual('/assign-a-case')
    expect(searchParams.get('allocationSuccess')).toBeFalsy()
    expect(searchParams.getAll('allocationErrors')).toEqual(['noPrisonersSelected', 'noStaffSelected'])

    expect(rpService.unassignCaseAllocations).toHaveBeenCalledTimes(0)
    expect(rpService.postCaseAllocations).toHaveBeenCalledTimes(0)
  })

  test('validation failure, missing prisoner number', async () => {
    const res = await request(app).post('/assign-a-case').send({ staffId: '_unassign' }).expect(302)
    const { searchParams, pathname } = new URL(redirectedToPath(res), 'https://host.com')
    expect(pathname).toEqual('/assign-a-case')
    expect(searchParams.get('allocationSuccess')).toBeFalsy()
    expect(searchParams.getAll('allocationErrors')).toEqual(['noPrisonersSelected'])

    expect(rpService.unassignCaseAllocations).toHaveBeenCalledTimes(0)
    expect(rpService.postCaseAllocations).toHaveBeenCalledTimes(0)
  })

  test('validation failure, missing worker', async () => {
    const res = await request(app).post('/assign-a-case').send({ prisonerNumbers: '123' }).expect(302)
    const { searchParams, pathname } = new URL(redirectedToPath(res), 'https://host.com')
    expect(pathname).toEqual('/assign-a-case')
    expect(searchParams.get('allocationSuccess')).toBeFalsy()
    expect(searchParams.getAll('allocationErrors')).toEqual(['noStaffSelected'])

    expect(rpService.unassignCaseAllocations).toHaveBeenCalledTimes(0)
    expect(rpService.postCaseAllocations).toHaveBeenCalledTimes(0)
  })
})

function prisonerData(prisonerNumber: string, firstName: string, lastName: string): PrisonerData {
  return { personalDetails: { prisonerNumber, firstName, lastName } as PersonalDetails } as PrisonerData
}
