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
  stubJohnSmithPrisonerDetails,
} from './scenarios/john-smith/john-smith-pre-release'
import { johnSmithDefaults } from './scenarios/john-smith/john-smith'
import { johnSmithBCST2Health, johnSmithBCSTAccommodation } from './scenarios/john-smith/john-smith-bcst2'
import johnSmithBcst2Edit from './scenarios/john-smith/john-smith-bcst2-edit'

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

const stubJohnSmithPreRelease = () => {
  return Promise.all([
    ...johnSmithDefaults(),
    stubJohnSmithPrisonerDetails(),
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
  ])
}

const stubJohnSmithBCST2Health = () => Promise.all([...johnSmithDefaults(), ...johnSmithBCST2Health()])
const stubJohnSmithBCST2Edit = () => Promise.all([...johnSmithDefaults(), ...johnSmithBcst2Edit()])
const stubJohnSmithBCST2Accommodation = () => Promise.all([...johnSmithDefaults(), ...johnSmithBCSTAccommodation()])

export default {
  stubGetPrisoners,
  stubGetAppointments,
  stubGetAppointment,
  stubCreateOtp,
  stubGetOtp,
  stubGetPrisonerData,
  stubGetPrisonerImage,
  stubJohnSmithPreRelease,
  stubJohnSmithBCST2Health,
  stubJohnSmithBCST2Edit,
  stubJohnSmithBCST2Accommodation,
}
