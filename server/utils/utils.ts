import { Callback } from 'nunjucks'
import { addMinutes, format } from 'date-fns'
import { PathwayStatus, PrisonerData } from '../@types/express'
import {
  ASSESSMENT_ENUMS_DICTIONARY,
  CHECK_ANSWERS_PAGE_ID,
  ENUMS_DICTIONARY,
  EnumValue,
  PATHWAY_DICTIONARY,
  RISK_ASSESSMENT_ENUMS_DICTIONARY,
  STATUS_DICTIONARY,
} from './constants'
import { CrsReferral } from '../data/model/crsReferralResponse'
import FeatureFlags from '../featureFlag'
import logger from '../../logger'
import { AppointmentLocation } from '../data/model/appointment'
import {
  Answer,
  ApiAssessmentPage,
  ApiQuestionsAndAnswer,
  CachedAssessment,
  CachedQuestionAndAnswer,
  PageWithQuestions,
  ValidationErrors,
  WorkingCachedAssessment,
} from '../data/model/immediateNeedsReport'
import { AssessmentType } from '../data/model/assessmentInformation'
import { toCachedQuestionAndAnswer } from './formatAssessmentResponse'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (name?: string): string | null => {
  // this check is for the authError page
  if (!name) return null

  const array = name.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const formatDate = (dateString: string, monthStyle: 'short' | 'long' = 'short'): string => {
  if (!dateString) return null
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: monthStyle, year: 'numeric' }
  return date.toLocaleDateString('en-GB', options)
}

export const formatDateExtended = (dateString: string): string => {
  if (!dateString) return null
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  return date.toLocaleDateString('en-GB', options)
}

export function formatTimeWithDuration(inputTime: string, duration = 0): string {
  if (!inputTime || inputTime?.length < 1) return null
  const [hours, minutes, seconds] = inputTime.split(':').map(Number)

  const dateObj = new Date()
  dateObj.setHours(hours || 0)
  dateObj.setMinutes(minutes || 0)
  dateObj.setSeconds(seconds || 0)
  const updatedDate = addMinutes(dateObj, duration)

  return format(updatedDate, 'h:mma')?.toLocaleLowerCase()
}

export const formatDateToIso = (dateString: string): string => {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toISOString()
}

export const getDaysFromGivenDate = (targetDate: string, currentDate: Date): { daysDiff: number; isPast: boolean } => {
  if (!targetDate) return null

  const targetDateObj = new Date(targetDate)
  const timeDiff = targetDateObj.getTime() - currentDate.getTime()
  const daysDiff = Math.abs(Math.ceil(timeDiff / (1000 * 3600 * 24)))
  const isPast = timeDiff < 0

  return { daysDiff, isPast }
}

export const getDaysFromDate = (targetDate: string): { daysDiff: number; isPast: boolean } => {
  return getDaysFromGivenDate(targetDate, new Date())
}

export const getMostRecentDate = (dates: string[]): string => {
  if (dates.length === 0) return undefined
  return dates.reduce((mostRecent, current) => {
    if (!mostRecent || current > mostRecent) {
      return current
    }
    return mostRecent
  })
}

export const isFriday = (targetDate: string): boolean => {
  const targetDateObj = new Date(targetDate)
  return targetDateObj.getDay() === 5
}

export const filterByPathway = (arrayData: PathwayStatus[], condition: string): PathwayStatus => {
  return arrayData.find(item => item.pathway === condition)
}

export const getEnumValue = (pathwayStatusEnum: string) => {
  return ENUMS_DICTIONARY[pathwayStatusEnum]
}

export const getRiskAssessmentEnumValue = (pathwayStatusEnum: string) => {
  return RISK_ASSESSMENT_ENUMS_DICTIONARY[pathwayStatusEnum]
}

export const getAssessmentEnumValue = (pathwayStatusEnum: string): EnumValue => {
  return ASSESSMENT_ENUMS_DICTIONARY[pathwayStatusEnum]
}

export function getEnumByName(name: string) {
  return Object.keys(ENUMS_DICTIONARY).find(enumKey => ENUMS_DICTIONARY[enumKey].name === name)
}

export function getEnumByURL(url: unknown) {
  return Object.keys(ENUMS_DICTIONARY).find(enumKey => ENUMS_DICTIONARY[enumKey].url === url)
}

export function getUrlFromName(pathwayName: string) {
  const key = Object.keys(ENUMS_DICTIONARY).find(enumKey => ENUMS_DICTIONARY[enumKey].name === pathwayName)
  return key ? ENUMS_DICTIONARY[key].url : undefined
}

export function getNameFromUrl(url: string) {
  const key = Object.keys(ENUMS_DICTIONARY).find(enumKey => ENUMS_DICTIONARY[enumKey].url === url)
  return key ? ENUMS_DICTIONARY[key].name : undefined
}

export async function getDescriptionFromName(name: string) {
  const key = Object.keys(ENUMS_DICTIONARY).find(enumKey => ENUMS_DICTIONARY[enumKey].name === name)
  return key ? ENUMS_DICTIONARY[key].description : undefined
}

export function roundNumberUp(number: number): number | undefined {
  return Math.ceil(number)
}

export function formatTime(inputTime: string): string {
  // Split the input time string by ':' to extract hours and minutes
  const [hour, minute] = inputTime.split(':')

  // Convert hours and minutes to integers
  const hourInt = parseInt(hour, 10)
  const minuteInt = parseInt(minute, 10)

  // Ensure the minutes are formatted with leading zeros
  const hourStr = hourInt.toString()
  const minuteStr = minuteInt.toString().padStart(2, '0')

  // Create the formatted time string in 24-hour format
  return `${hourStr}:${minuteStr}`
}

export function convertArrayToCommaSeparatedList(inputArray: string[]): string {
  let commaSeparatedList = ''
  if (inputArray !== null) {
    inputArray.forEach(element => {
      commaSeparatedList += element
      commaSeparatedList += ', '
    })
  }
  return commaSeparatedList.slice(0, -2)
}

export function createReferralsSubNav(crsReferrals: CrsReferral[]): { name: string; id: string }[] {
  const subNav: { id: string; name: string }[] = []
  if (!crsReferrals || crsReferrals.length === 0) {
    subNav.push({
      name: 'Referral',
      id: 'referral',
    })
  } else {
    crsReferrals.forEach(referral => {
      subNav.push({
        name: `Referral - ${referral.contractType}`,
        id: `${createReferralsId(referral.contractType)}`,
      })
    })
  }
  return subNav
}

export function createReferralsId(contractType: string): string {
  return `referral-${contractType
    .replace(/([^0-9a-z ])/gi, '')
    .replace(/\s+/g, '-')
    .toLowerCase()}`
}

export function isDateValid(dateString: string): boolean {
  const pattern = /^\d{4}-\d{1,2}-\d{1,2}$/
  if (!pattern.test(dateString)) {
    return false // Invalid format
  }
  const parts = dateString.split('-')
  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const day = parseInt(parts[2], 10)
  const date = new Date(year, month - 1, day)

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

export function getQueryString(url: string): string {
  return `?${url.split('?')[1]}`
}

export function toTitleCase(input: string): string {
  const firstLetter = input.charAt(0).toUpperCase()
  return `${firstLetter}${input.toLowerCase().slice(1)}`
}

export async function getFeatureFlag(flag: string, callback: Callback<string, boolean>) {
  callback(null, await getFeatureFlagBoolean(flag))
}

export async function getFeatureFlagBoolean(flag: string) {
  const featureFlags = FeatureFlags.getInstance()
  const res = await featureFlags.getFeatureFlags()
  if (res) {
    const featureEnabled = res.find(feature => feature.feature === flag)?.enabled
    if (featureEnabled !== undefined) {
      return featureEnabled
    }
    return false // If feature is missing from map send back false
  }
  logger.warn(`No feature flags available, returning false for feature [${flag}].`)
  return false
}

export function formatAddress(location: AppointmentLocation): string {
  let address = ''
  const lineSeparator = ',\n'

  if (location) {
    if (location.buildingNumber) {
      address += location.buildingNumber
    }
    if (location.streetName) {
      address += ' '
      address += location.streetName
    }
    if (location.town) {
      address += lineSeparator
      address += location.town
    }
    if (location.postcode) {
      address += lineSeparator
      address += location.postcode
    }
    if (address.startsWith(lineSeparator)) {
      address = address.substring(lineSeparator.length, address.length)
    }
  }
  return address.trim()
}

export function getAnswerToCurrentQuestion(
  currentQuestionAndAnswer: ApiQuestionsAndAnswer,
  allQuestionsAndAnswers: CachedAssessment,
): Answer | null {
  if (!currentQuestionAndAnswer || !allQuestionsAndAnswers) return null
  const qaObject = allQuestionsAndAnswers.questionsAndAnswers?.find(
    qa => qa.question === currentQuestionAndAnswer.question.id,
  )
  return qaObject?.answer || null
}

export function getAnswerValueFromArrayOfMaps(answer: Answer, key: string) {
  if (answer) {
    const answers = answer.answer as { [key: string]: string }[]
    const result = Object.entries(answers)
      .map(it => it[1])
      .find(it => it[key])
    if (result) {
      return result[key]
    }
  }
  return ''
}

export function getValidationError(validationErrors: ValidationErrors, questionId: string) {
  if (!validationErrors || !questionId) return null
  return validationErrors.find(item => item.questionId === questionId && item.optionId === undefined)
}

export function getOptionValidationError(validationErrors: ValidationErrors, questionId: string, optionId: string) {
  if (!validationErrors || !questionId) return null
  return validationErrors.find(item => item.questionId === questionId && item.optionId === optionId)
}

export function parseAssessmentType(type: unknown): AssessmentType {
  switch (type) {
    case 'BCST2': {
      return 'BCST2'
    }
    case 'RESETTLEMENT_PLAN': {
      return 'RESETTLEMENT_PLAN'
    }
    case undefined: {
      throw new Error('Assessment type is missing from request')
    }
    default: {
      throw new Error(`Unable to parse assessmentType: ${type}`)
    }
  }
}

export function formatDateAsLocal(dateString: string) {
  if (dateString) {
    const date = new Date(dateString)
    const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
      date.getMinutes(),
    )}:${pad(date.getSeconds())}`
  }
  return null
}

export function getCaseNotesIntro(caseNoteText: string): string | null {
  if (caseNoteText?.startsWith('Resettlement status set to:')) {
    // Split the first sentence into two parts: before and after the period
    const parts = caseNoteText.split('.')
    if (parts.length > 1) {
      const beforePeriod = `${parts[0]}.`.trim()
      return beforePeriod
    }
  }
  return null
}

export function getCaseNotesText(caseNoteText: string): string | null {
  if (caseNoteText?.startsWith('Resettlement status set to:')) {
    // Split the first sentence into two parts: before and after the period
    const parts = caseNoteText.split('.')
    if (parts.length > 1) {
      const afterPeriod = parts.slice(1).join('.').trim()
      return afterPeriod
    }
  }
  return caseNoteText || ''
}

export function getResetReason(caseNoteText: string): string | null {
  const resetPrefix = 'Prepare someone for release reports and statuses reset'
  const reasonPrefix = 'Reason for reset:'
  if (caseNoteText?.startsWith(resetPrefix)) {
    const reasonIndex = caseNoteText.indexOf(reasonPrefix)
    if (reasonIndex !== -1) {
      // Extract everything after 'Reason for reset:'
      const reasonText = caseNoteText.substring(reasonIndex + reasonPrefix.length).trim()
      return reasonText
    }
  }
  return null
}

export function getCaseNoteTitle(caseNoteText: string, pathway?: string): string {
  const resetPrefix = 'Prepare someone for release reports and statuses reset'
  if (caseNoteText?.startsWith(resetPrefix)) {
    return resetPrefix
  }
  return pathway || ''
}

export function removeSlashes(s: string): string {
  return s ? s.replaceAll('/', '') : null
}

export function fullName(prisonerData: PrisonerData): string {
  const { firstName, lastName } = prisonerData?.personalDetails ?? {}
  if (firstName?.length > 0 && lastName?.length > 0) {
    return `${toTitleCase(firstName)} ${toTitleCase(lastName)}`
  }
  return ''
}

export function convertQuestionsAndAnswersToCacheFormat(prefillFromApi: ApiQuestionsAndAnswer[]) {
  if (prefillFromApi?.length > 0) {
    return prefillFromApi.map(it => toCachedQuestionAndAnswer(it))
  }
  return []
}

export function getPagesFromCheckYourAnswers(apiQuestionsAndAnswers: ApiQuestionsAndAnswer[]) {
  if (apiQuestionsAndAnswers?.length > 0) {
    const pages: PageWithQuestions[] = []
    const allPages = [...new Set(apiQuestionsAndAnswers.map(it => it.originalPageId))]
    allPages.forEach(p => {
      const allQuestionsOnPage = apiQuestionsAndAnswers.filter(it => it.originalPageId === p)
      const questions: string[] = []
      allQuestionsOnPage.forEach(qa => {
        questions.push(qa.question.id)
        if (qa.question.options) {
          questions.push(
            ...qa.question.options
              .flatMap(it => it.nestedQuestions)
              .flatMap(it => it?.question.id)
              .filter(it => it),
          )
        }
      })
      pages.push({
        pageId: p,
        questions,
      })
    })
    pages.push({ pageId: CHECK_ANSWERS_PAGE_ID, questions: [] })
    return pages
  }
  return []
}

export function convertApiQuestionAndAnswersToPageWithQuestions(apiAssessmentPage: ApiAssessmentPage) {
  const questions: string[] = []
  apiAssessmentPage?.questionsAndAnswers?.forEach(qa => {
    questions.push(qa.question.id)
    if (qa.question.options) {
      questions.push(
        ...qa.question.options
          .flatMap(it => it.nestedQuestions)
          .flatMap(it => it?.question.id)
          .filter(it => it),
      )
    }
  })
  return {
    pageId: apiAssessmentPage?.id,
    questions,
  } as PageWithQuestions
}

export function findOtherNestedQuestions(
  newQandA: CachedQuestionAndAnswer,
  existingAssessmentFromCache: WorkingCachedAssessment,
  apiAssessmentPage: ApiAssessmentPage,
): CachedQuestionAndAnswer[] {
  const parentQuestion = apiAssessmentPage?.questionsAndAnswers?.find(qa => {
    return qa.question.options
      ?.flatMap(it => it.nestedQuestions)
      .map(it => it?.question.id)
      .includes(newQandA.question)
  })
  const questionFromApi =
    parentQuestion || apiAssessmentPage?.questionsAndAnswers.find(it => it.question.id === newQandA.question)
  const currentlySelectedOption = questionFromApi?.question.options?.find(
    option =>
      option.id === newQandA.answer.answer ||
      option.nestedQuestions?.flatMap(it => it.question.id).includes(newQandA.question),
  )
  const nestedQuestions =
    questionFromApi?.question.options
      ?.filter(it => it !== currentlySelectedOption)
      .flatMap(it => it.nestedQuestions)
      .map(it => it?.question.id) || []
  return (
    existingAssessmentFromCache?.assessment.questionsAndAnswers.filter(it => nestedQuestions.includes(it.question)) ||
    []
  )
}

export function startsWith(string: string, prefix: string): boolean {
  return string.startsWith(prefix)
}

export function removePrefix(string: string, prefix: string): string {
  if (typeof string === 'string' && string.startsWith(prefix)) {
    return string.slice(prefix.length)
  }
  return string
}

export function isValidPathway(pathwayFromUrl: string): boolean {
  return Object.keys(PATHWAY_DICTIONARY).includes(getEnumByURL(pathwayFromUrl))
}

export function isValidStatus(status: string): boolean {
  return Object.keys(STATUS_DICTIONARY).includes(status)
}

export const getOptionalText = (questionAndAnswer: ApiQuestionsAndAnswer) =>
  questionAndAnswer.question.validation.type === 'OPTIONAL' ? ' (optional)' : ''

export function isAdditionalDetails(questionAnswer: { question?: string; questionTitle?: string }): boolean {
  return (
    questionAnswer?.question?.endsWith('_ADDITIONAL_DETAILS') ??
    questionAnswer?.questionTitle?.toLowerCase()?.endsWith('additional details') ??
    false
  )
}
