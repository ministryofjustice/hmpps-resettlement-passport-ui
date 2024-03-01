import { Callback } from 'nunjucks'
import { PathwayStatus } from '../@types/express'
import {
  ASSESSMENT_ENUMS_DICTIONARY,
  ENUMS_DICTIONARY,
  ENUMS_DICTIONARY_RESETTLEMENT_ASSESSMENT_ENABLED_OVERRIDE,
  EnumValue,
} from './constants'
import { CrsReferral } from '../data/model/crsReferralResponse'
import FeatureFlags from '../featureFlag'
import logger from '../../logger'
import { AppointmentLocation } from '../data/model/appointment'
import { Answer, QuestionsAndAnswers, SubmittedInput } from '../data/model/BCST2Form'

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

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const formatDate = (dateString: string, monthStyle: 'short' | 'long' = 'short'): string => {
  if (!dateString) return null
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: monthStyle, year: 'numeric' }
  return date.toLocaleDateString('en-GB', options)
}

export const formatDateToIso = (dateString: string): string => {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toISOString()
}

export const getAgeFromDate = (birthDate: string): number => {
  const birthYear = new Date(birthDate).getFullYear()
  const currentYear = new Date().getFullYear()
  return currentYear - birthYear
}

export const getDaysFromDate = (targetDate: string): { daysDiff: number; isPast: boolean } => {
  const targetDateObj = new Date(targetDate)
  const currentDate = new Date()

  const timeDiff = targetDateObj.getTime() - currentDate.getTime()
  const daysDiff = Math.abs(Math.ceil(timeDiff / (1000 * 3600 * 24)))
  const isPast = timeDiff < 0

  return { daysDiff, isPast }
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

const getEnumDictionary = (resettlementAssessmentEnabled: boolean) => {
  if (resettlementAssessmentEnabled) {
    return { ...ENUMS_DICTIONARY, ...ENUMS_DICTIONARY_RESETTLEMENT_ASSESSMENT_ENABLED_OVERRIDE }
  }
  return ENUMS_DICTIONARY
}

export const getEnumValue = (pathwayStatusEnum: string, resettlementAssessmentEnabled = true) => {
  const enumDictionary = getEnumDictionary(resettlementAssessmentEnabled)
  return enumDictionary[pathwayStatusEnum]
}

export const getAssessmentEnumValue = (pathwayStatusEnum: string): EnumValue => {
  return ASSESSMENT_ENUMS_DICTIONARY[pathwayStatusEnum]
}

export function getEnumByName(name: string, resettlementAssessmentEnabled = true) {
  const enumDictionary = getEnumDictionary(resettlementAssessmentEnabled)
  return Object.keys(enumDictionary).find(enumKey => enumDictionary[enumKey].name === name)
}

export function getEnumByURL(url: unknown, resettlementAssessmentEnabled = true) {
  const enumDictionary = getEnumDictionary(resettlementAssessmentEnabled)
  return Object.keys(enumDictionary).find(enumKey => enumDictionary[enumKey].url === url)
}

export function getUrlFromName(pathwayName: string, resettlementAssessmentEnabled = true) {
  const enumDictionary = getEnumDictionary(resettlementAssessmentEnabled)
  const key = Object.keys(enumDictionary).find(enumKey => enumDictionary[enumKey].name === pathwayName)
  return key ? enumDictionary[key].url : undefined
}

export function getNameFromUrl(url: string, resettlementAssessmentEnabled = true) {
  const enumDictionary = getEnumDictionary(resettlementAssessmentEnabled)
  const key = Object.keys(enumDictionary).find(enumKey => enumDictionary[enumKey].url === url)
  return key ? enumDictionary[key].name : undefined
}

export async function getDescriptionFromName(name: string, resettlementAssessmentEnabled = true) {
  const enumDictionary = getEnumDictionary(resettlementAssessmentEnabled)
  const key = Object.keys(enumDictionary).find(enumKey => enumDictionary[enumKey].name === name)
  return key ? enumDictionary[key].description : undefined
}

export function roundNumberUp(number: number): number | undefined {
  return Math.ceil(number)
}

export function formatCaseNoteText(caseNoteText: string): string {
  // Replace line breaks with <br />
  const formattedInputString = caseNoteText?.replace(/\n/g, '<br />')
  // Check if the first sentence matches the pattern
  if (formattedInputString?.startsWith('Resettlement status set to:')) {
    // Split the first sentence into two parts: before and after the period
    const parts = formattedInputString.split('.')
    if (parts.length > 1) {
      const beforePeriod = `${parts[0]}.`.trim()
      const afterPeriod = parts.slice(1).join('.').trim()
      const bodyText = afterPeriod ? `<div>${afterPeriod}</div>` : ''
      // Format the part before the period as bold
      return `<strong>${beforePeriod}</strong>${bodyText}`
    }
  }
  return formattedInputString || ''
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
  const lineSeparator = ',<br />'

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
  currentQuestionAndAnswer: QuestionsAndAnswers,
  allQuestionsAndAnswers: SubmittedInput,
): Answer | null {
  if (!currentQuestionAndAnswer || !allQuestionsAndAnswers) return null
  const qaObject = allQuestionsAndAnswers.questionsAndAnswers.find(
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
