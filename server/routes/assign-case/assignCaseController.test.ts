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
import { appWithAllRoutes, flashProvider, mockedServices } from '../testutils/appSetup'
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
    rpService.getListOfPrisoners.mockRejectedValue(new Error('Something went wrong'))

    await request(app)
      .get('/assign-a-case')
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
    expect(rpService.getListOfPrisoners).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseDate',
      'ASC',
      '',
      '0',
      '',
      '',
      '',
      true,
      '',
    )
  })

  it('Error case - rpService throws error getting resettlement workers', async () => {
    stubPrisonersCasesList(rpService)
    rpService.getAvailableResettlementWorkers.mockRejectedValue(new Error('Something went wrong'))

    await request(app)
      .get('/assign-a-case')
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
    expect(rpService.getListOfPrisoners).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseDate',
      'ASC',
      '',
      '0',
      '',
      '',
      '',
      true,
      '',
    )

    expect(rpService.getAvailableResettlementWorkers).toHaveBeenCalledWith('MDI')
  })

  it('Happy path with default query params', async () => {
    const getPrisonerListSpy = stubPrisonersCasesList(rpService)
    stubAvailableResettlementWorkers()

    await request(app)
      .get('/assign-a-case')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith('MDI', 0, 20, 'releaseDate', 'ASC', '', '0', '', '', '', true, '')
  })

  it('Happy path with specified query params currentPage, workerId, sortField = name, sortDirection = ASC', async () => {
    const getPrisonerListSpy = stubPrisonersCasesList(rpService)
    stubAvailableResettlementWorkers()

    await request(app)
      .get('/assign-a-case?currentPage=2&sortField=name&sortDirection=ASC&workerId=100')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith('MDI', 2, 20, 'name', 'ASC', '', '0', '', '', '', true, '100')
  })

  it('Happy path with specified query params currentPage = empty, workerId = none, sortField = releaseDate, sortDirection = DESC', async () => {
    const getPrisonerListSpy = stubPrisonersCasesList(rpService)
    stubAvailableResettlementWorkers()

    await request(app)
      .get('/assign-a-case?currentPage=&sortField=releaseDate&sortDirection=DESC&workerId=none')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'releaseDate',
      'DESC',
      '',
      '0',
      '',
      '',
      '',
      true,
      'none',
    )
  })

  it('Happy path with specified query params workerId = empty, sortField = assignedWorkerLastname, sortDirection = DESC', async () => {
    const getPrisonerListSpy = stubPrisonersCasesList(rpService)
    stubAvailableResettlementWorkers()

    await request(app)
      .get('/assign-a-case?currentPage=&sortField=assignedWorkerLastname&sortDirection=DESC&workerId=')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerListSpy).toHaveBeenCalledWith(
      'MDI',
      0,
      20,
      'assignedWorkerLastname',
      'DESC',
      '',
      '0',
      '',
      '',
      '',
      true,
      '',
    )
  })

  test('Should show message that assignments cannot be made with no resettlement workers available', async () => {
    stubPrisonersCasesList(rpService)
    rpService.getAvailableResettlementWorkers.mockResolvedValue([])

    await request(app)
      .get('/assign-a-case')
      .expect(200)
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(document.getElementById('assign-case-control').outerHTML).toMatchSnapshot()
      })
  })

  test('shows success dialog for assign', async () => {
    const getPrisonerListSpy = stubPrisonersCasesList(rpService)
    stubAvailableResettlementWorkers()

    // Set allocated values in flash - note these need to be set in the same order here as they are accessed in assignCaseController.
    flashProvider
      .mockReturnValueOnce([true]) // allocationSuccess
      .mockReturnValueOnce(['Smith, John, A1234DY', 'Guy, Some, G4161UF', 'Other, A.n, G5384GE']) // allocatedCases
      .mockReturnValueOnce([7]) // allocatedOtherCount
      .mockReturnValueOnce(['Joe Blogs']) // allocatedTo

    await request(app)
      .get('/assign-a-case')
      .expect(200)
      .expect(res => {
        const doc = parseHtmlDocument(res.text)
        expect(doc.getElementById('success-alert').outerHTML).toMatchSnapshot()
      })
    expect(getPrisonerListSpy).toHaveBeenCalledWith('MDI', 0, 20, 'releaseDate', 'ASC', '', '0', '', '', '', true, '')
  })

  test('shows success dialog for unassign', async () => {
    const getPrisonerListSpy = stubPrisonersCasesList(rpService)
    stubAvailableResettlementWorkers()

    // Set allocated values in flash - note these need to be set in the same order here as they are accessed in assignCaseController.
    flashProvider
      .mockReturnValueOnce([true]) // allocationSuccess
      .mockReturnValueOnce(['Smith, John, A1234DY', 'Some Guy, G4161UF', 'A.n Other, G5384GE']) // allocatedCases
      .mockReturnValueOnce([7]) // allocatedOtherCount
      .mockReturnValueOnce(['Joe Blogs']) // allocatedTo
      .mockReturnValueOnce([true]) // isUnassign

    await request(app)
      .get('/assign-a-case')
      .expect(200)
      .expect(res => {
        const doc = parseHtmlDocument(res.text)
        expect(doc.getElementById('success-alert').outerHTML).toMatchSnapshot()
      })
    expect(getPrisonerListSpy).toHaveBeenCalledWith('MDI', 0, 20, 'releaseDate', 'ASC', '', '0', '', '', '', true, '')
  })

  test('shows error dialog for unassign', async () => {
    stubPrisonersCasesList(rpService)
    stubAvailableResettlementWorkers()

    // Set allocated values in flash - note these need to be set in the same order here as they are accessed in assignCaseController.
    flashProvider
      .mockReturnValueOnce([false]) // allocationSuccess
      .mockReturnValueOnce([]) // allocatedCases
      .mockReturnValueOnce([]) // allocatedOtherCount
      .mockReturnValueOnce([]) // allocatedTo
      .mockReturnValueOnce([]) // isUnassign
      .mockReturnValueOnce(['noPrisonersSelected', 'noStaffSelected']) // allocationErrors

    await request(app)
      .get('/assign-a-case')
      .expect(200)
      .expect(res => {
        const doc = parseHtmlDocument(res.text)
        expect(doc.querySelector('.govuk-error-summary').outerHTML).toMatchSnapshot()
      })
  })

  it('Error case - invalid currentPage parameter', async () => {
    await request(app)
      .get('/assign-a-case?currentPage=InvalidValue')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - invalid releaseTime parameter', async () => {
    await request(app)
      .get('/assign-a-case?releaseTime=%2C9')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - invalid sortField parameter', async () => {
    await request(app)
      .get('/assign-a-case?sortField=invalidValue')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - invalid sortDirection parameter', async () => {
    await request(app)
      .get('/assign-a-case?sortDirection=4')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('Error case - invalid workerId parameter', async () => {
    await request(app)
      .get('/assign-a-case?workerId=-100')
      .expect(400)
      .expect(res => expectSomethingWentWrongPage(res))
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

    const { pathname } = new URL(redirectedToPath(res), 'https://host.com')
    expect(pathname).toEqual('/assign-a-case')

    expect(flashProvider).toHaveBeenCalledWith('allocatedCases', ['Smith, John, A1234DY'])
    expect(flashProvider).toHaveBeenCalledWith('allocationSuccess', true)
    expect(flashProvider).toHaveBeenCalledWith('allocatedTo', 'First Last')

    expect(rpService.postCaseAllocations).toHaveBeenCalledWith({
      prisonId: 'MDI',
      nomsIds: ['A8731DY'],
      staffId: 123,
    })
  })

  test('successfully assign multiple cases', async () => {
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

    const { pathname } = new URL(redirectedToPath(res), 'https://host.com')
    expect(pathname).toEqual('/assign-a-case')

    expect(flashProvider).toHaveBeenCalledWith('allocatedCases', [
      'Smith, John, A1234DY',
      'Guy, Some, G4161UF',
      'Other, A.n, G5384GE',
    ])
    expect(flashProvider).toHaveBeenCalledWith('allocationSuccess', true)
    expect(flashProvider).toHaveBeenCalledWith('allocatedTo', 'First Last')

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
        staffId: '123',
      })
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  test('Shows error page when API returns empty response when assigning', async () => {
    rpService.postCaseAllocations.mockResolvedValue([])

    await request(app)
      .post('/assign-a-case')
      .send({
        prisonerNumbers: ['A8731DY', 'G4161UF', 'G5384GE'],
        staffId: '123',
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

    const { pathname } = new URL(redirectedToPath(res), 'https://host.com')
    expect(pathname).toEqual('/assign-a-case')

    expect(flashProvider).toHaveBeenCalledWith('allocatedCases', ['Smith, John, A1234DY'])
    expect(flashProvider).toHaveBeenCalledWith('allocationSuccess', true)
    expect(flashProvider).toHaveBeenCalledWith('isUnassign', true)

    expect(rpService.unassignCaseAllocations).toHaveBeenCalledWith({
      nomsIds: ['A8731DY'],
    })
  })

  test('successfully unassign multiple cases', async () => {
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

    const { pathname } = new URL(redirectedToPath(res), 'https://host.com')
    expect(pathname).toEqual('/assign-a-case')

    expect(flashProvider).toHaveBeenCalledWith('allocatedCases', [
      'Smith, John, A1234DY',
      'Guy, Some, G4161UF',
      'Other, A.n, G5384GE',
    ])
    expect(flashProvider).toHaveBeenCalledWith('allocationSuccess', true)
    expect(flashProvider).toHaveBeenCalledWith('isUnassign', true)

    expect(rpService.unassignCaseAllocations).toHaveBeenCalledWith({
      nomsIds: ['A8731DY', 'G4161UF', 'G5384GE'],
    })
  })

  test('validation failure, missing prisoner number and staff id', async () => {
    const res = await request(app).post('/assign-a-case').send({}).expect(302)
    const { pathname } = new URL(redirectedToPath(res), 'https://host.com')
    expect(pathname).toEqual('/assign-a-case')
    expect(flashProvider).not.toHaveBeenCalledWith('allocationSuccess', true)
    expect(flashProvider).toHaveBeenCalledWith('allocationErrors', ['noPrisonersSelected', 'noStaffSelected'])

    expect(rpService.unassignCaseAllocations).toHaveBeenCalledTimes(0)
    expect(rpService.postCaseAllocations).toHaveBeenCalledTimes(0)
  })

  test('validation failure, missing prisoner number', async () => {
    const res = await request(app).post('/assign-a-case').send({ staffId: '_unassign' }).expect(302)
    const { pathname } = new URL(redirectedToPath(res), 'https://host.com')
    expect(pathname).toEqual('/assign-a-case')
    expect(flashProvider).not.toHaveBeenCalledWith('allocationSuccess', true)
    expect(flashProvider).toHaveBeenCalledWith('allocationErrors', ['noPrisonersSelected'])

    expect(rpService.unassignCaseAllocations).toHaveBeenCalledTimes(0)
    expect(rpService.postCaseAllocations).toHaveBeenCalledTimes(0)
  })

  test('validation failure, missing worker', async () => {
    const res = await request(app).post('/assign-a-case').send({ prisonerNumbers: '123' }).expect(302)
    const { pathname } = new URL(redirectedToPath(res), 'https://host.com')
    expect(pathname).toEqual('/assign-a-case')
    expect(flashProvider).not.toHaveBeenCalledWith('allocationSuccess', true)
    expect(flashProvider).toHaveBeenCalledWith('allocationErrors', ['noStaffSelected'])

    expect(rpService.unassignCaseAllocations).toHaveBeenCalledTimes(0)
    expect(rpService.postCaseAllocations).toHaveBeenCalledTimes(0)
  })
})

it('Happy path with filter parameters', async () => {
  const getPrisonerListSpy = stubPrisonersCasesList(rpService)
  stubAvailableResettlementWorkers()

  await request(app)
    .get('/assign-a-case')
    .query({
      searchInput: 'smith',
      releaseTime: '84',
      workerId: '1',
    })
    .expect(200)
    .expect(res => expect(res.text).toMatchSnapshot())
  expect(getPrisonerListSpy).toHaveBeenCalledWith(
    'MDI',
    0,
    20,
    'releaseDate',
    'ASC',
    'smith',
    '84',
    '',
    '',
    '',
    true,
    '1',
  )
})

function prisonerData(prisonerNumber: string, firstName: string, lastName: string): PrisonerData {
  return { personalDetails: { prisonerNumber, firstName, lastName } as PersonalDetails } as PrisonerData
}
