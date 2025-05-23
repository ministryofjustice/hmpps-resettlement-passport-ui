import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const getUserActiveCaseLoad = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: '/nomisUserRolesApi/me/caseloads',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        activeCaseload: {
          id: 1,
          name: 'Moorland (HMP & YOI)',
        },
      },
    },
  })

const getStaffDetails = (staffId = 485588) =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/nomisUserRolesApi/users/staff/${staffId}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        staffId: 486233,
        firstName: 'John',
        lastName: 'Smith',
        status: 'ACTIVE',
        primaryEmail: 'john.smith@test.gov.uk',
        generalAccount: {
          username: 'JOHNSMITH_GEN',
          active: true,
          accountType: 'GENERAL',
          activeCaseload: {
            id: 'LEI',
            name: 'Leeds (HMP)',
          },
          caseloads: [
            {
              id: 'LEI',
              name: 'Leeds (HMP)',
            },
            {
              id: 'NWEB',
              name: 'Nomis-web Application',
            },
            {
              id: 'PBI',
              name: 'Peterborough (HMP)',
            },
            {
              id: 'PFI',
              name: 'Peterborough Female HMP',
            },
            {
              id: 'OWI',
              name: 'Oakwood (HMP)',
            },
            {
              id: 'WEI',
              name: 'Wealstun (HMP)',
            },
            {
              id: 'PVI',
              name: 'Pentonville (HMP)',
            },
          ],
        },
      },
    },
  })

const stubUser = (name: string, nomis: boolean = true) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/manageUsersApi/users/me',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        staffId: 231232,
        username: 'USER1',
        active: true,
        name,
        authSource: nomis ? 'nomis' : 'delius',
      },
    },
  })

export const stubNomisUserRolesClientPing = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/nomisUserRolesApi/health/ping',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: 'UP' },
    },
  })

export default {
  getUserActiveCaseLoad,
  getStaffDetails,
  stubAuthUser: ({ name = 'john smith', nomis = false } = {}) => stubUser(name, nomis),
  stubNomisUserRolesClientPing,
}
