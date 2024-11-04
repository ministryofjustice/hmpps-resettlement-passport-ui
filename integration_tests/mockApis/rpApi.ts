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
import { getResettlementAssessmentVersion, johnSmithDefaults, johnSmithImage } from './scenarios/john-smith/john-smith'
import {
  johnSmithImmediateNeedsReportAccommodation,
  johnSmithImmediateNeedsReportHealth,
  johnSmithImmediateNeedsReportHealthWithFreeText,
  johnSmithImmediateNeedsReportAllQuestionTypes,
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
import {
  defaultPrisonersSearch,
  defaultPrisonersSearchNoPastReleaseDates,
  prisonersSearchWithWatchlist,
} from './scenarios/prisonersSearch'
import { johnSmithCheckbox, johnSmithCheckboxReportVersion } from './scenarios/john-smith/john-smith-checkbox'
import editHealthAssessmentConvergingOnLastQuestion from './scenarios/john-smith/edit-health-assessment-converging-on-last-question'
import { validateAssessment } from './common'
import { johnSmithResetProfile } from './scenarios/john-smith/john-smith-reset-profile'
import { johnSmithLicenceImage, johnSmithReportInfo } from './scenarios/john-smith/john-smith-overview'

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

const stubDocumentUploadSuccess = () =>
  stubFor({
    request: {
      method: 'POST',
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/documents/upload?category=LICENCE_CONDITIONS`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        value: {
          id: 1,
          prisonerId: 1,
          originalDocumentKey: 'A8731DY_0c1307a5-c02c-4ff6-8af4-ea84079da7ba',
          htmlDocumentKey: 'ebcb4676-b4b4-4f1e-92f7-e41bff1c99df',
          creationDate: '2024-07-29T14:03:05.093319',
          category: 'LICENCE_CONDITIONS',
          originalDocumentFileName: 'licence-conditions.pdf',
        },
      },
    },
  })
const stubDocumentUploadFailure = ({ errorMessage }: { errorMessage: string }) =>
  stubFor({
    request: {
      method: 'POST',
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/documents/upload?category=LICENCE_CONDITIONS`,
    },
    response: {
      status: 400,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 400,
        developerMessage: errorMessage,
      },
    },
  })

const stubDocumentUploadFailureWithVirus = () =>
  stubFor({
    request: {
      method: 'POST',
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/documents/upload?category=LICENCE_CONDITIONS`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { reason: { foundViruses: { badVirus: ['1', '2', '3'] } } },
    },
  })

const stubDocumentUploadFailure500 = () =>
  stubFor({
    request: {
      method: 'POST',
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/documents/upload?category=LICENCE_CONDITIONS`,
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 500,
        developerMessage: 'It broke',
      },
    },
  })
const stubListDocumentsSuccess = () =>
  stubFor({
    request: {
      method: 'GET',
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/documents`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          id: 2,
          fileName: 'conditions.pdf',
          category: 'LICENCE_CONDITIONS',
          creationDate: '2024-08-16T14:03:05.093319',
        },
        {
          id: 1,
          fileName: 'old-conditions.pdf',
          category: 'LICENCE_CONDITIONS',
          creationDate: '2024-08-14T09:05:02.013214',
        },
      ],
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
    validateAssessment('ACCOMMODATION', 'RESETTLEMENT_PLAN'),
  ])
}

const stubJohnSmithImmediateNeedsReportHealth = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithImmediateNeedsReportHealth()])
const stubJohnSmithImmediateNeedsReportHealthFreeText = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithImmediateNeedsReportHealthWithFreeText()])
const stubJohnSmithImmediateNeedsReportEdit = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithImmediateNeedsReportEdit()])
const stubJohnSmithImmediateNeedsReportAccommodation = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithImmediateNeedsReportAccommodation()])
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stubJohnSmithImmediateNeedsReportAllQuestionTypes = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithImmediateNeedsReportAllQuestionTypes()])
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
const stubDefaultSearchResultsNoPastReleaseDates = () =>
  Promise.all([...johnSmithDefaults(), defaultPrisonersSearchNoPastReleaseDates()])

const stubJohnSmithCheckBox = () => {
  return Promise.all([
    ...johnSmithDefaults(),
    stubJohnSmithPrisonerDetailsPreRelease(),
    johnSmithTaskList(),
    johnSmithCheckAnswers(),
    johnSmithTaskListAfterComplete(),
    johnSmithAccommodationNextPage1(),
    johnSmithCheckbox(),
    johnSmithCheckboxReportVersion(),
  ])
}

const stubEditHealthAssessmentConvergingOnLastQuestion = () =>
  Promise.all([...johnSmithDefaults(), ...editHealthAssessmentConvergingOnLastQuestion()])

const stubJohnSmithProfileReset = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithImmediateNeedsReportAccommodation(), johnSmithResetProfile()])

const stubJohnSmithPostNoReportInfo = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithGetPrisonerDetails(), ...johnSmithReportInfo()])

const stubJohnSmithGetLicenceImage = () =>
  Promise.all([...johnSmithDefaults(), ...johnSmithGetPrisonerDetails(), ...johnSmithLicenceImage()])

const stubJohnSmithWithSomeErrors = () =>
  Promise.all([johnSmithImage(), ...johnSmithGetPrisonerDetails(), ...johnSmithLicenceImage()])

export const johnSmithLicenseConditions = () =>
  stubFor({
    name: 'john-smith-license-conditions',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/G4161UF/licence-condition',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        licenceId: 101,
        status: 'ACTIVE',
        standardLicenceConditions: [
          {
            id: 1001,
            image: false,
            text: 'Be of good behaviour and not behave in a way which undermines the purpose of the licence period.',
          },
          {
            id: 1002,
            image: false,
            text: 'Not commit any offence.',
          },
          {
            id: 1003,
            image: false,
            text: 'Keep in touch with the supervising officer in accordance with instructions given by the supervising officer.',
          },
        ],
        otherLicenseConditions: [
          {
            id: 1007,
            image: false,
            text: 'You must reside overnight within London probation region while of no fixed abode, unless otherwise approved by your supervising officer.',
          },
          {
            id: 1008,
            image: true,
            text: 'Not to enter the area of dsdsds, as defined by the attached map, without the prior approval of your supervising officer.',
          },
          {
            id: 1009,
            image: false,
            text: 'Report to staff at Sasasa at 01:01 am and 01:01 am Daily, unless otherwise authorised by your supervising officer. This condition will be reviewed by your supervising officer on a monthly basis and may be amended or removed if it is felt that the level of risk you present has reduced appropriately.',
          },
          {
            id: 1010,
            image: false,
            text: 'Attend a location, as required by your supervising officer, to give a sample of oral fluid / urine in order to test whether you have any specified Class A and specified Class B drugs in your body, for the purpose of ensuring that you are complying with the condition of your licence requiring you to be of good behaviour. Do not take any action that could hamper or frustrate the drug testing process.',
          },
          {
            id: 1011,
            image: false,
            text: 'Allow person(s) as designated by your supervising officer to install an electronic monitoring tag on you and access to install any associated equipment in your property, and for the purpose of ensuring that equipment is functioning correctly. You must not damage or tamper with these devices and ensure that the tag is charged, and report to your supervising officer and the EM provider immediately if the tag or the associated equipment are not working correctly. This will be for the purpose of monitoring your [INSERT TYPES OF CONDITIONS TO BE ELECTRONICALLY MONITORED HERE] licence condition(s) unless otherwise authorised by your supervising officer.',
          },
          {
            id: 1012,
            image: false,
            text: 'You will be subject to trail monitoring. Your whereabouts will be electronically monitored by GPS Satellite Tagging, ending on [INSERT END DATE], and you must cooperate with the monitoring as directed by your supervising officer unless otherwise authorised by your supervising officer.',
          },
          {
            id: 1013,
            image: false,
            text: 'You must let the police search you if they ask. You must also let them search a vehicle you are with, like a car or a motorbike.',
          },
        ],
      },
    },
  })

export const johnSmithRiskScores = () =>
  stubFor({
    name: 'john-smith-risk-scores',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/G4161UF/risk/scores',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        completedDate: '2023-07-29T03:07:38',
        assessmentStatus: 'Complete',
        groupReconvictionScore: { oneYear: 10, twoYears: 20, scoreLevel: 'LOW' },
        violencePredictorScore: {
          ovpStaticWeightedScore: 2,
          ovpDynamicWeightedScore: 3,
          ovpTotalWeightedScore: 4,
          oneYear: 12,
          twoYears: 13,
          ovpRisk: 'LOW',
        },
        generalPredictorScore: {
          ogpStaticWeightedScore: 40,
          ogpDynamicWeightedScore: 50,
          ogpTotalWeightedScore: 60,
          ogp1Year: 20,
          ogp2Year: 30,
          ogpRisk: 'HIGH',
        },
        riskOfSeriousRecidivismScore: { percentageScore: 4, staticOrDynamic: 'STATIC', scoreLevel: 'LOW' },
        sexualPredictorScore: {
          ospIndecentPercentageScore: 50,
          ospContactPercentageScore: 78,
          ospIndecentScoreLevel: 'MEDIUM',
          ospContactScoreLevel: 'MEDIUM',
        },
      },
    },
  })

export const johnSmithRiskRosh = () =>
  stubFor({
    name: 'john-smith-risk-rosh',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/G4161UF/risk/rosh',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        riskInCommunity: { CHILDREN: 'HIGH', PUBLIC: 'HIGH', KNOWN_ADULT: 'HIGH', STAFF: 'MEDIUM', PRISONERS: 'LOW' },
        overallRiskLevel: 'HIGH',
        assessedOn: '2023-07-29T03:07:38',
      },
    },
  })

export const johnSmithRiskMappa = () =>
  stubFor({
    name: 'john-smith-risk-mappa',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/G4161UF/risk/mappa',
      method: 'GET',
    },
    response: {
      headers: responseHeaders,
      status: 200,
      jsonBody: {
        level: 1,
        levelDescription: 'MAPPA Level 1',
        category: 3,
        categoryDescription: 'MAPPA Cat 3',
        startDate: '2023-01-27',
        reviewDate: '2023-04-27',
      },
    },
  })

export const johnSmithCaseNotes = () =>
  stubFor({
    name: 'john-smith-case-notes',
    request: {
      url: '/rpApi/resettlement-passport/case-notes/G4161UF?page=0&size=10&sort=occurenceDateTime%2CDESC&days=0&pathwayType=All',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        content: [
          {
            caseNoteId: '47041356',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T18:08:43.322997385',
            occurenceDateTime: '2024-04-02T18:08:43',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Finance and ID Pre-release report\\n\\nuij',
          },
          {
            caseNoteId: '47041355',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T18:08:43.16034987',
            occurenceDateTime: '2024-04-02T18:08:43',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Education, skills and work Pre-release report\\n\\nui',
          },
          {
            caseNoteId: '47041357',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T18:08:43.479647039',
            occurenceDateTime: '2024-04-02T18:08:43',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Health Pre-release report\\n\\ng',
          },
          {
            caseNoteId: '47041352',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T18:08:42.647197381',
            occurenceDateTime: '2024-04-02T18:08:42',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Attitudes, thinking and behaviour Pre-release report\\n\\nf',
          },
          {
            caseNoteId: '47041354',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T18:08:42.989484866',
            occurenceDateTime: '2024-04-02T18:08:42',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Drugs and alcohol Pre-release report\\n\\nou\\r\\n]hi',
          },
          {
            caseNoteId: '47041351',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T18:08:42.420725451',
            occurenceDateTime: '2024-04-02T18:08:42',
            createdBy: 'Boobier, James',
            text: 'Case note summary from Accommodation Pre-release report\\n\\nPutting back in progress (testing)',
          },
          {
            caseNoteId: '47041353',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T18:08:42.825820244',
            occurenceDateTime: '2024-04-02T18:08:42',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Children, families and communities Pre-release report\\n\\nsdf\\r\\njhkb',
          },
          {
            caseNoteId: '47041350',
            pathway: 'ACCOMMODATION',
            creationDateTime: '2024-04-02T18:07:16.82079488',
            occurenceDateTime: '2024-04-02T18:07:16',
            createdBy: 'Boobier, James',
            text: 'Resettlement status set to: Done. This is a test,',
          },
          {
            caseNoteId: '47041336',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T10:41:37.562169416',
            occurenceDateTime: '2024-04-02T10:41:37',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Accommodation Pre-release report\\n\\nsr',
          },
          {
            caseNoteId: '47041332',
            pathway: 'DRUGS_AND_ALCOHOL',
            creationDateTime: '2024-04-02T10:38:29.087589618',
            occurenceDateTime: '2024-04-02T10:38:29',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Drugs and alcohol immediate needs report\\n\\nou\\r\\n]hi',
          },
        ],
        pageSize: 10,
        page: 0,
        sortName: 'occurenceDateTime,DESC',
        totalElements: 364,
        last: false,
      },
    },
  })

export const johnSmithStaffContacts = () =>
  stubFor({
    name: 'john-smith-staff-contacts',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/G4161UF/staff-contacts',
      method: 'GET',
    },
    response: {
      headers: responseHeaders,
      status: 200,
      jsonBody: {
        primaryPom: { name: 'David Jones' },
        secondaryPom: { name: 'Barbara Winter' },
        com: { name: 'John Doe' },
        keyWorker: null,
      },
    },
  })

export const johnSmithAppointments = () =>
  stubFor({
    name: 'john-smith-appointments',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/G4161UF/appointments',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        results: [
          {
            title: 'Appointment with CRS Staff (NS)',
            contact: 'CRSUATU Staff',
            date: '2024-09-14',
            time: '14:05:00',
            location: {
              buildingName: '',
              buildingNumber: '77',
              streetName: 'High Street',
              district: '',
              town: 'EDINBURGH',
              county: '',
              postcode: 'EH50 2GR',
              description: null,
            },
            contactEmail: 'CRSUATU.staff@test.com',
            duration: null,
            note: null,
          },
          {
            title: 'Appointment with Charity ABC',
            contact: 'Bob Example',
            date: '2024-09-18',
            time: '09:00:00',
            location: {
              buildingName: '',
              buildingNumber: '',
              streetName: '',
              district: '',
              town: '',
              county: 'Swansea',
              postcode: 'SA1 1JG',
              description: null,
            },
            contactEmail: 'charity@test.com',
            duration: 30,
            note: null,
          },
          {
            title: 'Appointment with Jobs centre plus',
            contact: 'CRSUATU Staff',
            date: '2024-09-18',
            time: '14:46:00',
            location: {
              buildingName: '',
              buildingNumber: 'Unit 7',
              streetName: 'Parc Tawe North',
              district: '',
              town: 'Swansea',
              county: 'Swansea',
              postcode: 'SA1 2AA',
              description: null,
            },
            contactEmail: 'CRSUATU.staff@test.com',
            duration: 60,
            note: null,
          },
        ],
      },
    },
  })

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
  stubJohnSmithImmediateNeedsReportHealthFreeText,
  stubJohnSmithImmediateNeedsReportAllQuestionTypes,
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
  stubJohnSmithDefaults: () => Promise.all([...johnSmithDefaults(), ...johnSmithGetPrisonerDetails()]),
  stubDocumentUploadSuccess,
  stubDocumentUploadFailure,
  stubJohnSmithCheckBox,
  stubListDocumentsSuccess,
  stubDocumentUploadFailureWithVirus,
  stubDocumentUploadFailure500,
  stubDefaultSearchResultsNoPastReleaseDates,
  stubEditHealthAssessmentConvergingOnLastQuestion,
  stubJohnSmithProfileReset,
  stubJohnSmithPostNoReportInfo,
  stubJohnSmithGetLicenceImage,
  johnSmithLicenseConditions,
  johnSmithRiskScores,
  johnSmithRiskRosh,
  johnSmithRiskMappa,
  johnSmithCaseNotes,
  johnSmithStaffContacts,
  johnSmithAppointments,
  stubJohnSmithWithSomeErrors,
}
