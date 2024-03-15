export type EnumValue = { name: string; url?: string; description?: string; color?: string }

export const ENUMS_DICTIONARY: { [key: string]: EnumValue } = {
  ACCOMMODATION: {
    name: 'Accommodation',
    url: 'accommodation',
    description:
      'Referrals and support to enable prison leavers to access suitable and sustainable housing, on their first night and beyond.',
  },
  ATTITUDES_THINKING_AND_BEHAVIOUR: {
    name: 'Attitudes, thinking and behaviour',
    url: 'attitudes-thinking-and-behaviour',
    description:
      'Understand someone’s risks around how they think and behave and ensure any needs in this area are met.',
  },
  CHILDREN_FAMILIES_AND_COMMUNITY: {
    name: 'Children, families and communities',
    url: 'children-families-and-communities',
    description: 'Consider someone’s needs around maintaining contact with their families and communities on release.',
  },
  DRUGS_AND_ALCOHOL: {
    name: 'Drugs and alcohol',
    url: 'drugs-and-alcohol',
    description: 'Prepare someone with substance misuse issues for release.',
  },
  EDUCATION_SKILLS_AND_WORK: {
    name: 'Education, skills and work',
    url: 'education-skills-and-work',
    description: 'Review someone’s work readiness and enter post-release employment or volunteering details.',
  },
  FINANCE_AND_ID: {
    name: 'Finance and ID',
    url: 'finance-and-id',
    description: 'Track financial support requirements and bank account/ID applications.',
  },
  HEALTH: {
    name: 'Health',
    url: 'health-status',
    description: 'Ensure that the physical and mental health needs of prison leavers are met.',
  },
  BENEFITS: {
    name: 'Benefits',
  },
  NOT_STARTED: {
    name: 'Not started',
    color: 'red',
    description: 'no work has begun',
  },
  SUPPORT_REQUIRED: {
    name: 'Support required',
    color: 'orange',
    description: 'support need identified, no work has begun',
  },
  IN_PROGRESS: {
    name: 'In progress',
    color: 'blue',
    description: 'work is ongoing',
  },
  SUPPORT_NOT_REQUIRED: {
    name: 'Support not required',
    color: 'green',
    description: 'no need was identified',
  },
  SUPPORT_DECLINED: {
    name: 'Support declined',
    color: 'green',
    description: 'a need was identified but support was declined',
  },
  DONE: {
    name: 'Done',
    color: 'green',
    description: 'all required work has been completed successfully',
  },
  LOW: {
    name: 'Low',
    color: 'grey',
  },
  MEDIUM: {
    name: 'Medium',
    color: 'blue',
  },
  HIGH: {
    name: 'High',
    color: 'red',
  },
  VERY_HIGH: {
    name: 'Very high',
    color: 'red',
  },
}

export const ERROR_DICTIONARY: { [key: string]: string } = {
  DATA_NOT_FOUND: 'No data available',
  DATA_UNAVAILABLE: 'Data unavailable - try again later or contact administrator if problem persists',
}

export const ASSESSMENT_ENUMS_DICTIONARY: { [key: string]: EnumValue } = {
  NOT_STARTED: {
    name: 'Not started',
    color: 'grey',
  },
  COMPLETE: {
    name: 'Completed',
    color: 'green',
  },
  SUPPORT_REQUIRED: {
    name: 'Support required',
    color: 'orange',
  },
  SUPPORT_DECLINED: {
    name: 'Support declined',
    color: 'green',
  },
  SUPPORT_NOT_REQUIRED: {
    name: 'Support not required',
    color: 'green',
  },
}

export const FEATURE_FLAGS: { [key: string]: string } = {
  REPORTING: 'reporting',
  ADD_APPOINTMENTS: 'addAppointments',
  DELIUS_CASE_NOTES: 'nDeliusCaseNotes',
  RESETTLEMENT_ASSESSMENT: 'resettlementAssessment',
  TASKS_VIEW: 'tasksView',
}

export const FEEDBACK_URL = 'https://eu.surveymonkey.com/r/prepare-someone-for-release-beta'
