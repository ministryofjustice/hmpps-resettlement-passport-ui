import { PathwayStatus } from '../@types/express'
import ENUMS_DICTIONARY, { EnumValue } from './constants'

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

export const formatDate = (dateString: string): string => {
  if (!dateString) return null
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
  return date.toLocaleDateString('en-GB', options)
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

export const getEnumValue = (pathwayStatusEnum: string): EnumValue => {
  return ENUMS_DICTIONARY[pathwayStatusEnum]
}

export function getEnumByName(name: string): string {
  const key = Object.keys(ENUMS_DICTIONARY).find(enumKey => ENUMS_DICTIONARY[enumKey].name === name)
  return key
}

export function getEnumByURL(url: unknown): string {
  const key = Object.keys(ENUMS_DICTIONARY).find(enumKey => ENUMS_DICTIONARY[enumKey].url === url)
  return key
}

export function getUrlFromName(pathwayName: string): string | undefined {
  const key = Object.keys(ENUMS_DICTIONARY).find(enumKey => ENUMS_DICTIONARY[enumKey].name === pathwayName)
  return key ? ENUMS_DICTIONARY[key].url : undefined
}

export function getNameFromUrl(url: string): string | undefined {
  const key = Object.keys(ENUMS_DICTIONARY).find(enumKey => ENUMS_DICTIONARY[enumKey].url === url)
  return key ? ENUMS_DICTIONARY[key].name : undefined
}

export function getDescriptionFromName(name: string): string | undefined {
  const key = Object.keys(ENUMS_DICTIONARY).find(enumKey => ENUMS_DICTIONARY[enumKey].name === name)
  return key ? ENUMS_DICTIONARY[key].description : undefined
}

export function roundNumberUp(number: number): number | undefined {
  const value = Math.ceil(number)
  return value
}

export function formatFirstSentence(inputString: string): string {
  const sentences = inputString.split(/(?=Resettlement status set to: [^.]*\.)/)
  let firstSentence = sentences[0]
  // Check if the first sentence matches the pattern
  if (firstSentence.startsWith('Resettlement status set to:')) {
    // Split the first sentence into two parts: before and after the period
    const parts = firstSentence.split('.')
    if (parts.length > 1) {
      const beforePeriod = `${parts[0]}.`
      const afterPeriod = parts.slice(1).join('.')
      // Format the part before the period as bold
      firstSentence = `<strong>${beforePeriod}</strong><div>${afterPeriod}</div>`
    }
  }
  // Join the first sentence with the rest of the sentences using newlines.
  return [firstSentence, ...sentences.slice(1)].join('')
}
