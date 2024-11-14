import { stubFor } from '../../wiremock'
import { responseHeaders, submitHeaders } from '../../headers'
import { getResettlementAssessmentVersion } from './john-smith'
import { validateAssessment } from '../../common'

const profile = () =>
  stubFor({
    name: 'john smith immediate-needs-report-edit status',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        personalDetails: {
          prisonerNumber: 'A8731DY',
          prisonId: 'MDI',
          firstName: 'John',
          middleNames: 'Michael',
          lastName: 'Smith',
          releaseDate: '2024-06-17',
          releaseType: 'CRD',
          dateOfBirth: '1982-10-24',
          age: 41,
          location: 'K-3-011',
          facialImageId: '1313058',
        },
        pathways: [
          { pathway: 'ACCOMMODATION', status: 'SUPPORT_NOT_REQUIRED', lastDateChange: '2024-04-08' },
          { pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR', status: 'SUPPORT_NOT_REQUIRED', lastDateChange: '2024-04-08' },
          { pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY', status: 'SUPPORT_NOT_REQUIRED', lastDateChange: '2024-04-08' },
          { pathway: 'DRUGS_AND_ALCOHOL', status: 'SUPPORT_DECLINED', lastDateChange: '2024-04-08' },
          { pathway: 'EDUCATION_SKILLS_AND_WORK', status: 'SUPPORT_REQUIRED', lastDateChange: '2024-04-08' },
          { pathway: 'FINANCE_AND_ID', status: 'SUPPORT_REQUIRED', lastDateChange: '2024-04-08' },
          { pathway: 'HEALTH', status: 'SUPPORT_NOT_REQUIRED', lastDateChange: '2024-04-08' },
        ],
        assessmentRequired: false,
        resettlementReviewAvailable: true,
        immediateNeedsSubmitted: true,
        preReleaseSubmitted: false,
      },
    },
  })

const getEducationSkillsAndWork = () =>
  stubFor({
    name: 'John Smith immediate needs report Edit get education 1',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/EDUCATION_SKILLS_AND_WORK/latest',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        latestAssessment: {
          assessmentType: 'BCST2',
          lastUpdated: '2024-04-08T14:34:19.458378',
          questionsAndAnswers: [
            {
              answer: 'No',
              originalPageId: 'JOB_BEFORE_CUSTODY',
              questionTitle: 'Did the person in prison have a job before custody?',
            },
            {
              answer: 'No',
              originalPageId: 'HAVE_A_JOB_AFTER_RELEASE',
              questionTitle: 'Does the person in prison have a job when they are released?',
            },
            {
              answer: 'Yes',
              originalPageId: 'SUPPORT_TO_FIND_JOB',
              questionTitle: 'Does the person in prison want support to find a job when they are released?',
            },
            {
              answer: 'No',
              originalPageId: 'IN_EDUCATION_OR_TRAINING_BEFORE_CUSTODY',
              questionTitle: 'Was the person in prison in education or training before custody?',
            },
            {
              answer: 'No',
              originalPageId: 'WANT_TO_START_EDUCATION_OR_TRAINING_AFTER_RELEASE',
              questionTitle: 'Does the person in prison want to start education or training after release?',
            },
          ],
          updatedBy: 'Matthew Kerry',
        },
        originalAssessment: null,
      },
    },
  })

const crsReferrals = () =>
  stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/crs-referrals/EDUCATION_SKILLS_AND_WORK',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        results: [
          {
            pathway: 'EDUCATION_SKILLS_AND_WORK',
            referrals: [
              {
                serviceCategories: ['Education, Training and Employment (ETE)'],
                contractType: 'Education, Training and Employment (ETE)',
                referralCreatedAt: '2023-07-04T16:59:28.750508',
                referralSentAt: null,
                interventionTitle: 'ETE Services for the East of England',
                referringOfficer: 'R&MP Practitioner',
                responsibleOfficer: null,
                serviceProviderUser: null,
                serviceProviderLocation: null,
                serviceProviderName: null,
                draft: true,
              },
            ],
            message: '',
          },
        ],
      },
    },
  })

const workReadiness = () =>
  stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/work-readiness',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        workReadinessStatus: 'Ready to work',
        workReadinessStatusLastUpdated: '2023-10-13',
        details: {
          lastUpdated: '2023-10-10',
          workInterests: ['Education training', 'Technical', 'Sports'],
          abilityToWork: ['Caring responsibilities', 'Health issues', 'Other reasons'],
          reasonsToNotGetWork: ['Full time carer', 'Health', 'Lacks confidence or motivation', 'Other reasons'],
          volunteeringAndExperience: [
            {
              typeOfWorkExperience: 'Outdoor',
              otherWork: '',
              role: 'Groundskeeper',
              details: 'Outdoor Resourcing PLC',
            },
            {
              typeOfWorkExperience: 'Cleaning and maintenance',
              otherWork: '',
              role: 'Maintenance worker',
              details: 'Cleaning and Maintenance Ltd, Leeds',
            },
          ],
          educationalCoursesAndQualifications: {
            qualifications: [
              {
                subject: 'Science',
                grade: 'A',
                level: 'Entry level 3',
              },
              { subject: 'English', grade: 'B', level: 'Level 3' },
              {
                subject: 'Engineering',
                grade: 'C',
                level: 'Level 5',
              },
            ],
            additionalTraining: [
              'Full UK driving licence',
              'CSCS card',
              'Food hygiene certificate',
              'Computer literacy',
            ],
          },
          inPrisonWorkAndEducation: {
            inPrisonWork: [
              'Woodwork and joinery',
              'Gardening and outdoors',
              'Kitchens and cooking',
              'Computers or desk based',
              'Welding and metalwork',
              'Cleaning and hygiene',
              'Admin',
            ],
            inPrisonEducation: [
              'Running a business',
              'Social and life skills',
              'Communication skills',
              'English language skills',
              'Catering',
              'IT skills',
            ],
          },
          skillsAndInterests: {
            skills: ['Self management', 'Teamwork', 'Helping others'],
            personalInterests: ['Outdoor', 'Crafts', 'Team sports', 'Politics'],
          },
        },
      },
    },
  })

const getCheckAnswers = () =>
  stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/EDUCATION_SKILLS_AND_WORK/page/CHECK_ANSWERS?assessmentType=BCST2&version=1',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'CHECK_ANSWERS',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'EducationSkillsAndWorkResettlementAssessmentQuestion',
              id: 'JOB_BEFORE_CUSTODY',
              title: 'Did the person in prison have a job before custody?',
              subTitle: null,
              type: 'RADIO',
              options: [
                { id: 'YES', displayText: 'Yes', description: null, exclusive: false },
                { id: 'NO', displayText: 'No', description: null, exclusive: false },
                { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
              ],
              validation: { type: 'MANDATORY' },
            },
            answer: { '@class': 'StringAnswer', answer: 'NO' },
            originalPageId: 'JOB_BEFORE_CUSTODY',
          },
          {
            question: {
              '@class': 'EducationSkillsAndWorkResettlementAssessmentQuestion',
              id: 'HAVE_A_JOB_AFTER_RELEASE',
              title: 'Does the person in prison have a job when they are released?',
              subTitle: null,
              type: 'RADIO',
              options: [
                { id: 'YES', displayText: 'Yes', description: null, exclusive: false },
                { id: 'NO', displayText: 'No', description: null, exclusive: false },
                { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
              ],
              validation: { type: 'MANDATORY' },
            },
            answer: { '@class': 'StringAnswer', answer: 'NO' },
            originalPageId: 'HAVE_A_JOB_AFTER_RELEASE',
          },
          {
            question: {
              '@class': 'EducationSkillsAndWorkResettlementAssessmentQuestion',
              id: 'SUPPORT_TO_FIND_JOB',
              title: 'Does the person in prison want support to find a job when they are released?',
              subTitle: null,
              type: 'RADIO',
              options: [
                { id: 'YES', displayText: 'Yes', description: null, exclusive: false },
                { id: 'NO', displayText: 'No', description: null, exclusive: false },
                { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
              ],
              validation: { type: 'MANDATORY' },
            },
            answer: { '@class': 'StringAnswer', answer: 'YES' },
            originalPageId: 'SUPPORT_TO_FIND_JOB',
          },
          {
            question: {
              '@class': 'EducationSkillsAndWorkResettlementAssessmentQuestion',
              id: 'IN_EDUCATION_OR_TRAINING_BEFORE_CUSTODY',
              title: 'Was the person in prison in education or training before custody?',
              subTitle: null,
              type: 'RADIO',
              options: [
                { id: 'YES', displayText: 'Yes', description: null, exclusive: false },
                { id: 'NO', displayText: 'No', description: null, exclusive: false },
                { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
              ],
              validation: { type: 'MANDATORY' },
            },
            answer: { '@class': 'StringAnswer', answer: 'NO' },
            originalPageId: 'IN_EDUCATION_OR_TRAINING_BEFORE_CUSTODY',
          },
          {
            question: {
              '@class': 'EducationSkillsAndWorkResettlementAssessmentQuestion',
              id: 'WANT_TO_START_EDUCATION_OR_TRAINING_AFTER_RELEASE',
              title: 'Does the person in prison want to start education or training after release?',
              subTitle: null,
              type: 'RADIO',
              options: [
                { id: 'YES', displayText: 'Yes', description: null, exclusive: false },
                { id: 'NO', displayText: 'No', description: null, exclusive: false },
                { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
              ],
              validation: { type: 'MANDATORY' },
            },
            answer: { '@class': 'StringAnswer', answer: 'NO' },
            originalPageId: 'WANT_TO_START_EDUCATION_OR_TRAINING_AFTER_RELEASE',
          },
        ],
      },
    },
  })

const getHaveAJobAfterReleasePage = () =>
  stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/EDUCATION_SKILLS_AND_WORK/page/HAVE_A_JOB_AFTER_RELEASE?assessmentType=BCST2&version=1',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'HAVE_A_JOB_AFTER_RELEASE',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'HAVE_A_JOB_AFTER_RELEASE',
              title: 'Does the person in prison have a job when they are released?',
              subTitle: null,
              type: 'RADIO',
              options: [
                { id: 'YES', displayText: 'Yes', description: null, exclusive: false },
                { id: 'NO', displayText: 'No', description: null, exclusive: false },
                { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
              ],
              validation: { type: 'MANDATORY' },
            },
            answer: { '@class': 'StringAnswer', answer: 'NO' },
            originalPageId: 'HAVE_A_JOB_AFTER_RELEASE',
          },
        ],
      },
    },
  })

const nextPageJobAfterReleasePage = () =>
  stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/EDUCATION_SKILLS_AND_WORK/next-page?version=1&assessmentType=BCST2&currentPage=HAVE_A_JOB_AFTER_RELEASE',
      method: 'POST',
      bodyPatterns: [
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].question',
            contains: 'HAVE_A_JOB_AFTER_RELEASE',
          },
        },
      ],
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        nextPageId: 'HELP_CONTACTING_EMPLOYER',
      },
    },
  })

const helpContactingEmployerQuestion = () =>
  stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/EDUCATION_SKILLS_AND_WORK/page/HELP_CONTACTING_EMPLOYER?assessmentType=BCST2&version=1',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'HELP_CONTACTING_EMPLOYER',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'HELP_CONTACTING_EMPLOYER',
              title: 'Does the person in prison need help contacting the employer?',
              subTitle: null,
              type: 'RADIO',
              options: [
                { id: 'YES', displayText: 'Yes', description: null, exclusive: false },
                { id: 'NO', displayText: 'No', description: null, exclusive: false },
                { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
              ],
              validation: { type: 'MANDATORY' },
            },
            answer: null,
            originalPageId: 'HELP_CONTACTING_EMPLOYER',
          },
        ],
      },
    },
  })

const nextPageHelpContactingEmployerQuestion = () =>
  stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/EDUCATION_SKILLS_AND_WORK/next-page?version=1&assessmentType=BCST2&currentPage=HELP_CONTACTING_EMPLOYER',
      method: 'POST',
      bodyPatterns: [
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].question',
            contains: 'HELP_CONTACTING_EMPLOYER',
          },
        },
      ],
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        nextPageId: 'IN_EDUCATION_OR_TRAINING_BEFORE_CUSTODY',
      },
    },
  })

const inEducationOrTrainingQuestion = () =>
  stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/EDUCATION_SKILLS_AND_WORK/page/IN_EDUCATION_OR_TRAINING_BEFORE_CUSTODY?assessmentType=BCST2&version=1',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'IN_EDUCATION_OR_TRAINING_BEFORE_CUSTODY',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'IN_EDUCATION_OR_TRAINING_BEFORE_CUSTODY',
              title: 'Was the person in prison in education or training before custody?',
              subTitle: null,
              type: 'RADIO',
              options: [
                { id: 'YES', displayText: 'Yes', description: null, exclusive: false },
                { id: 'NO', displayText: 'No', description: null, exclusive: false },
                { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
              ],
              validation: { type: 'MANDATORY' },
            },
            answer: { '@class': 'StringAnswer', answer: 'NO' },
            originalPageId: 'IN_EDUCATION_OR_TRAINING_BEFORE_CUSTODY',
          },
        ],
      },
    },
  })

const submitEdit = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/EDUCATION_SKILLS_AND_WORK/complete?assessmentType=BCST2',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: JSON.stringify(educationSkillsWorkCompleteValidateBody),
          ignoreArrayOrder: true,
        },
      ],
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
  })
}

const educationSkillsWorkCompleteValidateBody = {
  questionsAndAnswers: [
    {
      answer: {
        '@class': 'StringAnswer',
        answer: 'NO',
        displayText: 'No',
      },
      pageId: 'JOB_BEFORE_CUSTODY',
      question: 'JOB_BEFORE_CUSTODY',
      questionTitle: 'Did the person in prison have a job before custody?',
      questionType: 'RADIO',
    },
    {
      answer: {
        '@class': 'StringAnswer',
        answer: 'YES',
        displayText: 'Yes',
      },
      pageId: 'HAVE_A_JOB_AFTER_RELEASE',
      question: 'HAVE_A_JOB_AFTER_RELEASE',
      questionTitle: 'Does the person in prison have a job when they are released?',
      questionType: 'RADIO',
    },
    {
      answer: {
        '@class': 'StringAnswer',
        answer: 'NO',
        displayText: 'No',
      },
      pageId: 'HELP_CONTACTING_EMPLOYER',
      question: 'HELP_CONTACTING_EMPLOYER',
      questionTitle: 'Does the person in prison need help contacting the employer?',
      questionType: 'RADIO',
    },
    {
      answer: {
        '@class': 'StringAnswer',
        answer: 'NO',
        displayText: 'No',
      },
      pageId: 'IN_EDUCATION_OR_TRAINING_BEFORE_CUSTODY',
      question: 'IN_EDUCATION_OR_TRAINING_BEFORE_CUSTODY',
      questionTitle: 'Was the person in prison in education or training before custody?',
      questionType: 'RADIO',
    },
    {
      answer: {
        '@class': 'StringAnswer',
        answer: 'NO',
        displayText: 'No',
      },
      pageId: 'WANT_TO_START_EDUCATION_OR_TRAINING_AFTER_RELEASE',
      question: 'WANT_TO_START_EDUCATION_OR_TRAINING_AFTER_RELEASE',
      questionTitle: 'Does the person in prison want to start education or training after release?',
      questionType: 'RADIO',
    },
  ],
  version: 1,
}

const johnSmithImmediateNeedsReportEdit = () => [
  profile(),
  getEducationSkillsAndWork(),
  crsReferrals(),
  workReadiness(),
  getCheckAnswers(),
  getHaveAJobAfterReleasePage(),
  nextPageJobAfterReleasePage(),
  helpContactingEmployerQuestion(),
  nextPageHelpContactingEmployerQuestion(),
  inEducationOrTrainingQuestion(),
  submitEdit(),
  getResettlementAssessmentVersion('EDUCATION_SKILLS_AND_WORK', 'BCST2'),
  validateAssessment('EDUCATION_SKILLS_AND_WORK', 'BCST2'),
]
export default johnSmithImmediateNeedsReportEdit
