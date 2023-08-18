export type EnumValue = { name: string; url?: string; color?: string }

const ENUMS_DICTIONARY: { [key: string]: EnumValue } = {
  ACCOMMODATION: {
    name: 'Accommodation',
    url: 'accommodation',
  },
  ATTITUDES_THINKING_AND_BEHAVIOUR: {
    name: 'Attitudes, thinking and behaviour',
    url: 'attitudes-thinking-and-behaviour',
  },
  CHILDREN_FAMILIES_AND_COMMUNITY: {
    name: 'Children, families and communities',
    url: 'children-families-and-communities',
  },
  DRUGS_AND_ALCOHOL: {
    name: 'Drugs and alcohol',
    url: 'drugs-and-alcohol',
  },
  EDUCATION_SKILLS_AND_WORK: {
    name: 'Education, skills and work',
    url: 'education-skills-and-work',
  },
  FINANCE_AND_ID: {
    name: 'Finance and ID',
    url: 'finance-and-id',
  },
  HEALTH: {
    name: 'Health',
    url: 'health-status',
  },
  NOT_STARTED: {
    name: 'Not started',
    color: 'red',
  },
  IN_PROGRESS: {
    name: 'In progress',
    color: 'blue',
  },
  SUPPORT_NOT_REQUIRED: {
    name: 'Support not required',
    color: 'green',
  },
  SUPPORT_DECLINED: {
    name: 'Support declined',
    color: 'green',
  },
  DONE: {
    name: 'Done',
    color: 'green',
  },
}

export default ENUMS_DICTIONARY
