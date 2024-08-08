import { stubFor } from './wiremock'
import {
  johnSmithAccommodationNextPage1,
  johnSmithAssessmentSummary,
  johnSmithCheckAnswers,
  johnSmithConfirm,
  johnSmithNextPage2,
  johnSmithNextPage3,
  johnSmithNextPage4,
  johnSmithTaskList,
  johnSmithTaskListAfterComplete,
  johnSmithWhereDidTheyLive,
  johnSmithWhereWillTheyLive2,
  stubJohnSmithPrisonerDetailsPreRelease,
} from './scenarios/john-smith/john-smith-pre-release'
import { getResettlementAssessmentVersion, johnSmithDefaults } from './scenarios/john-smith/john-smith'
import {
  johnSmithImmediateNeedsReportHealth,
  johnSmithImmediateNeedsReportAccommodation,
} from './scenarios/john-smith/john-smith-immediate-needs-report'
import johnSmithImmediateNeedsReportEdit from './scenarios/john-smith/john-smith-immediate-needs-report-edit'
import { johnSmithPostFinanceAndID, johnSmithPostID } from './scenarios/john-smith/john-smith-post-finance-and-ID'
import { johnSmithGetFinance, johnSmithGetFinanceAndID } from './scenarios/john-smith/john-smith-get-finance-and-ID'
import johnSmithGetPrisonerDetails from './scenarios/john-smith/john-smith-prisoner-details'
import { johnSmithDeleteFinanceAndID, johnSmithDeleteID } from './scenarios/john-smith/john-smith-delete-finance-and-ID'
import johnSmithGetFinanceAndIDUpdated from './scenarios/john-smith/john-smith-get-finance-and-ID-updated'
import { johnSmithPatchFinanceAndID, johnSmithPatchID } from './scenarios/john-smith/john-smith-patch-finance-and-ID'
import {
  johnSmithDeleteWatchlist,
  johnSmithDeleteWatchlist404,
  johnSmithPostWatchlist,
  johnSmithPostWatchlist404,
} from './scenarios/john-smith/john-smith-watchlist'
import {
  stubJohnSmithSkipInsidePreReleaseWindow,
  stubJohnSmithSkipOutsidePreReleaseWindow,
} from './scenarios/john-smith/john-smith-assessment-skip'
import { PathwayAssessmentStatus } from '../../server/data/model/assessmentStatus'
import { responseHeaders } from './headers'
import { AssessmentType } from '../../server/data/model/assessmentInformation'
import {
  stubJohnSmithStatusUpdateFailure,
  stubJohnSmithStatusUpdateSuccess,
} from './scenarios/john-smith/john-smith-status-update'
import { defaultPrisonersSearch, prisonersSearchWithWatchlist } from './scenarios/prisonersSearch'
import { johnSmithCheckbox, johnSmithCheckboxReportVersion } from './scenarios/john-smith/john-smith-checkbox'

const getTomorrowsDate = () => {
  const tomorrow = new Date()
  tomorrow.setDate(new Date().getDate() + 1)
  return tomorrow
}
const mockedOtpResponse = {
  id: 68,
  prisoner: {
    id: 3,
    nomsId: 'G4161UF',
    creationDate: '2023-11-17T14:49:58.308566',
    crn: 'U328968',
    prisonId: 'MDI',
    releaseDate: '2024-03-29',
  },
  creationDate: '2024-03-15T09:35:35.068614',
  expiryDate: '2024-03-22T23:59:59.068614',
  otp: '123456',
  dob: '1982-10-24',
}

const mockedPrisonerData = {
  personalDetails: {
    prisonerNumber: 'G4161UF',
    prisonId: 'MDI',
    firstName: 'John',
    middleNames: null,
    lastName: 'Smith',
    releaseDate: '2024-08-01',
    releaseType: 'CRD',
    dateOfBirth: '1974-05-30',
    age: 49,
    location: '3-3-022',
    facialImageId: '1064585',
  },
  pathways: [
    {
      pathway: 'ACCOMMODATION',
      status: 'SUPPORT_DECLINED',
      lastDateChange: '2024-03-13',
    },
    {
      pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
      status: 'SUPPORT_DECLINED',
      lastDateChange: '2024-03-13',
    },
    {
      pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
      status: 'SUPPORT_DECLINED',
      lastDateChange: '2024-03-13',
    },
    {
      pathway: 'DRUGS_AND_ALCOHOL',
      status: 'SUPPORT_DECLINED',
      lastDateChange: '2024-03-13',
    },
    {
      pathway: 'EDUCATION_SKILLS_AND_WORK',
      status: 'SUPPORT_NOT_REQUIRED',
      lastDateChange: '2024-03-13',
    },
    {
      pathway: 'FINANCE_AND_ID',
      status: 'SUPPORT_DECLINED',
      lastDateChange: '2024-03-13',
    },
    {
      pathway: 'HEALTH',
      status: 'SUPPORT_DECLINED',
      lastDateChange: '2024-03-13',
    },
  ],
  assessmentRequired: true,
  resettlementReviewAvailable: false,
  immediateNeedsSubmitted: false,
  preReleaseSubmitted: false,
}

const mockedAppointmentsResponse = (apptDate: Date) => {
  return {
    results: [
      {
        title: 'This is another future appointment',
        contact: 'Unallocated Staff',
        date: apptDate,
        time: '16:00:00',
        dateTime: new Date(apptDate),
        location: {
          buildingName: null,
          buildingNumber: null,
          streetName: null,
          district: null,
          town: null,
          county: null,
          postcode: null,
          description: 'CRS Provider Location',
        },
        note: null,
      },
      {
        title: 'This is a future appointment',
        contact: 'Unallocated Staff',
        date: apptDate,
        time: '14:05:00',
        dateTime: new Date(apptDate),
        location: {
          buildingName: null,
          buildingNumber: null,
          streetName: null,
          district: null,
          town: null,
          county: null,
          postcode: null,
          description: 'CRS Provider Location',
        },
        note: null,
      },
      {
        title: 'This is a past appointment',
        contact: 'Unallocated Staff',
        date: '2020-09-18',
        time: '14:46:00',
        dateTime: new Date('2020-09-18'),
        location: {
          buildingName: null,
          buildingNumber: null,
          streetName: null,
          district: null,
          town: null,
          county: null,
          postcode: null,
          description: 'CRS Provider Location',
        },
        note: null,
      },
      {
        title: 'This is another past appointment',
        contact: 'Dr X',
        date: '2020-01-23',
        time: '10:45:00',
        dateTime: new Date('2020-01-23'),
        location: {
          buildingName: 'Dave Smith Wing',
          buildingNumber: null,
          streetName: 'Big Street',
          district: null,
          town: 'Sheffield',
          county: 'South Yorks',
          postcode: 'S2 44e',
          description: null,
        },
        note: '',
      },
    ],
  }
}

const stubGetPrisoners = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: '/rpApi/resettlement-passport/prison/1/prisoners',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })

const stubGetPrisonerData = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: '/rpApi/resettlement-passport/prisoner/G4161UF',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: mockedPrisonerData,
    },
  })
const stubGetPrisonerImage = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: '/rpApi/resettlement-passport/prisoner/G4161UF/image/1064585',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    },
  })

const stubGetAppointments = () =>
  stubFor({
    request: {
      method: 'GET',
      url: `/rpApi/resettlement-passport/prisoner/G4161UF/appointments?futureOnly=true`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: mockedAppointmentsResponse(getTomorrowsDate()),
    },
  })

const stubGetAppointment = () =>
  stubFor({
    request: {
      method: 'GET',
      url: `/rpApi/resettlement-passport/prisoner/G4161UF/appointment`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: mockedAppointmentsResponse(getTomorrowsDate())[0],
    },
  })

const stubCreateOtp = () =>
  stubFor({
    request: {
      method: 'POST',
      url: `/rpApi/resettlement-passport/popUser/G4161UF/otp`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: mockedOtpResponse,
    },
  })

const stubGetOtp = () =>
  stubFor({
    request: {
      method: 'GET',
      url: `/rpApi/resettlement-passport/popUser/G4161UF/otp`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: mockedOtpResponse,
    },
  })

const stubAssessmentSummary = ({
  nomsId,
  status,
  assessmentType = 'BCST2',
}: {
  nomsId: string
  status: PathwayAssessmentStatus
  assessmentType?: AssessmentType
}) =>
  stubFor({
    request: {
      method: 'GET',
      url: `/rpApi/resettlement-passport/prisoner/${nomsId}/resettlement-assessment/summary?assessmentType=${assessmentType}`,
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: [
        { pathway: 'ACCOMMODATION', assessmentStatus: status },
        { pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR', assessmentStatus: status },
        { pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY', assessmentStatus: status },
        { pathway: 'DRUGS_AND_ALCOHOL', assessmentStatus: status },
        { pathway: 'EDUCATION_SKILLS_AND_WORK', assessmentStatus: status },
        { pathway: 'FINANCE_AND_ID', assessmentStatus: status },
        { pathway: 'HEALTH', assessmentStatus: status },
      ],
    },
  })

const stubJohnSmithPreRelease = () => {
  return Promise.all([
    ...johnSmithDefaults(),
    stubJohnSmithPrisonerDetailsPreRelease(),
    johnSmithTaskList(),
    johnSmithTaskListAfterComplete(),
    johnSmithAccommodationNextPage1(),
    johnSmithNextPage2(),
    johnSmithNextPage3(),
    johnSmithNextPage4(),
    johnSmithWhereDidTheyLive(),
    johnSmithWhereWillTheyLive2(),
    johnSmithAssessmentSummary(),
    johnSmithCheckAnswers(),
    johnSmithConfirm(),
    getResettlementAssessmentVersion('ACCOMMODATION', 'RESETTLEMENT_PLAN'),
  ])
}

const stubJohnSmithImmediateNeedsReportHealth = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithImmediateNeedsReportHealth()])
const stubJohnSmithImmediateNeedsReportEdit = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithImmediateNeedsReportEdit()])
const stubJohnSmithImmediateNeedsReportAccommodation = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithImmediateNeedsReportAccommodation()])
const stubJohnSmithPostFinanceAndID = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithGetPrisonerDetails(), ...johnSmithPostFinanceAndID()])
const stubJohnSmithGetFinanceAndID = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithGetPrisonerDetails(), ...johnSmithGetFinanceAndID()])
const stubJohnSmithGetFinanceAndIDUpdated = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithGetPrisonerDetails(), ...johnSmithGetFinanceAndIDUpdated()])
const stubJohnSmithDeleteFinanceAndID = () =>
  Promise.all([
    ...johnSmithDefaults(),
    ...johnSmithGetPrisonerDetails(),
    ...johnSmithGetFinanceAndID(),
    ...johnSmithDeleteFinanceAndID(),
  ])
const stubJohnSmithUpdateFinanceAndID = () =>
  Promise.all([
    ...johnSmithDefaults(),
    ...johnSmithGetPrisonerDetails(),
    ...johnSmithGetFinanceAndID(),
    ...johnSmithPatchFinanceAndID(),
  ])
const stubJohnSmithAddID = () =>
  Promise.all([
    ...johnSmithDefaults(),
    ...johnSmithGetPrisonerDetails(),
    ...johnSmithGetFinance(),
    ...johnSmithPostID(),
  ])
const stubJohnSmithAdd2ndID = () =>
  Promise.all([
    ...johnSmithDefaults(),
    ...johnSmithGetPrisonerDetails(),
    ...johnSmithGetFinanceAndID(),
    ...johnSmithPostID(),
  ])
const stubJohnSmithDeleteID = () =>
  Promise.all([
    ...johnSmithDefaults(),
    ...johnSmithGetPrisonerDetails(),
    ...johnSmithGetFinanceAndID(),
    ...johnSmithDeleteID(),
  ])
const stubJohnSmithUpdateID = () =>
  Promise.all([
    ...johnSmithDefaults(),
    ...johnSmithGetPrisonerDetails(),
    ...johnSmithGetFinanceAndID(),
    ...johnSmithPatchID(),
  ])
const stubJohnSmithPostWatchlist = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithGetFinanceAndID(), ...johnSmithPostWatchlist()])
const stubJohnSmithPostWatchlistNotFound = () =>
  Promise.all([
    ...johnSmithDefaults(),
    ...johnSmithGetPrisonerDetails(),
    ...johnSmithGetFinanceAndID(),
    ...johnSmithPostWatchlist404(),
  ])
const stubJohnSmithDeleteWatchlist = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithGetFinanceAndID(), ...johnSmithDeleteWatchlist()])
const stubJohnSmithDeleteWatchlistNotFound = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithGetFinanceAndID(), ...johnSmithDeleteWatchlist404()])
const stubJohnSmithWatchlistFilterResults = () =>
  Promise.all([...johnSmithDefaults(), prisonersSearchWithWatchlist(), defaultPrisonersSearch()])
const stubDefaultSearchResults = () => Promise.all([...johnSmithDefaults(), defaultPrisonersSearch()])

const stubJohnSmithCheckBox = () => {
  return Promise.all([
    ...johnSmithDefaults(),
    stubJohnSmithPrisonerDetailsPreRelease(),
    johnSmithTaskList(),
    johnSmithTaskListAfterComplete(),
    johnSmithAccommodationNextPage1(),
    johnSmithCheckbox(),
    johnSmithCheckboxReportVersion(),
  ])
}

export default {
  stubGetPrisoners,
  stubGetAppointments,
  stubGetAppointment,
  stubCreateOtp,
  stubGetOtp,
  stubGetPrisonerData,
  stubGetPrisonerImage,
  stubJohnSmithPreRelease,
  stubJohnSmithImmediateNeedsReportHealth,
  stubJohnSmithImmediateNeedsReportEdit,
  stubJohnSmithImmediateNeedsReportAccommodation,
  stubJohnSmithPostFinanceAndID,
  stubJohnSmithGetFinanceAndID,
  stubJohnSmithDeleteFinanceAndID,
  stubJohnSmithGetFinanceAndIDUpdated,
  stubJohnSmithUpdateFinanceAndID,
  stubJohnSmithAddID,
  stubJohnSmithDeleteID,
  stubJohnSmithUpdateID,
  stubJohnSmithAdd2ndID,
  stubJohnSmithPostWatchlist,
  stubJohnSmithPostWatchlistNotFound,
  stubJohnSmithDeleteWatchlist,
  stubJohnSmithDeleteWatchlistNotFound,
  stubJohnSmithSkipInsidePreReleaseWindow,
  stubJohnSmithSkipOutsidePreReleaseWindow,
  stubAssessmentSummary,
  stubJohnSmithStatusUpdateSuccess,
  stubJohnSmithStatusUpdateFailure,
  stubJohnSmithWatchlistFilterResults,
  stubDefaultSearchResults,
  stubJohnSmithCheckBox,
}
