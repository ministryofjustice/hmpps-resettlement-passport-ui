export type EnumValue = { name: string; url?: string; description?: string; color?: string }

export const PATHWAY_DICTIONARY = {
  ACCOMMODATION: {
    name: 'Accommodation',
    url: 'accommodation',
    description: 'Access to suitable and sustainable housing.',
  },
  ATTITUDES_THINKING_AND_BEHAVIOUR: {
    name: 'Attitudes, thinking and behaviour',
    url: 'attitudes-thinking-and-behaviour',
    description: 'Personal wellbeing, and support with gambling issues and emotions.',
  },
  CHILDREN_FAMILIES_AND_COMMUNITY: {
    name: 'Children, families and communities',
    url: 'children-families-and-communities',
    description: 'Keeping in contact with family and communities. And identifying potential threats outside of prison.',
  },
  DRUGS_AND_ALCOHOL: {
    name: 'Drugs and alcohol',
    url: 'drugs-and-alcohol',
    description: 'Support with drug and alcohol issues.',
  },
  EDUCATION_SKILLS_AND_WORK: {
    name: 'Education, skills and work',
    url: 'education-skills-and-work',
    description: 'Being ready to work, volunteer or go into education.',
  },
  FINANCE_AND_ID: {
    name: 'Finance and ID',
    url: 'finance-and-id',
    description: 'Applying for bank accounts and IDs, and benefits and debt management.',
  },
  HEALTH: {
    name: 'Health',
    url: 'health-status',
    description: 'Physical and mental health support, and registering for a GP.',
  },
} as const

export const ENUMS_DICTIONARY: { [key: string]: EnumValue } = {
  ...PATHWAY_DICTIONARY,
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
  IMMEDIATE_NEEDS_REPORT: {
    name: 'Immediate needs report',
  },
  PRE_RELEASE_REPORT: {
    name: 'Pre-release report',
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
  IN_PROGRESS: {
    name: 'In progress',
    color: 'blue',
  },
  DONE: {
    name: 'Done',
    color: 'green',
  },
}

export const RISK_ASSESSMENT_ENUMS_DICTIONARY: { [key: string]: { name: string; className: string } } = {
  LOW: {
    name: 'Low',
    className: 'low',
  },
  MEDIUM: {
    name: 'Medium',
    className: 'medium',
  },
  HIGH: {
    name: 'High',
    className: 'high',
  },
  VERY_HIGH: {
    name: 'Very high',
    className: 'very-high',
  },
}

export const FEATURE_FLAGS: { [key: string]: string } = {
  ADD_APPOINTMENTS: 'addAppointments',
  TASKS_VIEW: 'tasksView',
  VIEW_APPOINTMENTS_END_USER: 'viewAppointmentsEndUser',
  USE_NEW_DELIUS_CASE_NOTE_FORMAT: 'useNewDeliusCaseNoteFormat',
}

export const FEEDBACK_URL = 'https://eu.surveymonkey.com/r/prepare-someone-for-release-beta'
