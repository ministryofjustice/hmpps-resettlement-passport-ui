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
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  return date.toLocaleDateString('en-GB', options)
}

export const getAgeFromDate = (birthDate: string): number => {
  const birthYear = new Date(birthDate).getFullYear()
  const currentYear = new Date().getFullYear()
  return currentYear - birthYear
}

export const getDaysFromDate = (targetDate: string): number => {
  const targetDateObj = new Date(targetDate)
  const currentDate = new Date()

  const timeDiff = Math.abs(currentDate.getTime() - targetDateObj.getTime())
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

  return daysDiff
}

export const isFriday = (targetDate: string): boolean => {
  const targetDateObj = new Date(targetDate)
  return targetDateObj.getDay() === 5
}
