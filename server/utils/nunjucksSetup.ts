/* eslint-disable no-param-reassign */
import nunjucks from 'nunjucks'
import express from 'express'
import path from 'path'
import {
  formatDate,
  formatDateExtended,
  getDaysFromDate,
  filterByPathway,
  initialiseName,
  isFriday,
  getEnumValue,
  getUrlFromName,
  getNameFromUrl,
  getEnumByName,
  getDescriptionFromName,
  getMostRecentDate,
  roundNumberUp,
  getCaseNotesIntro,
  getCaseNotesText,
  getResetReason,
  getCaseNoteTitle,
  formatDateToIso,
  formatTime,
  formatTimeWithDuration,
  convertArrayToCommaSeparatedList,
  createReferralsSubNav,
  createReferralsId,
  getQueryString,
  toTitleCase,
  getFeatureFlag,
  getAssessmentEnumValue,
  formatAddress,
  getAnswerToCurrentQuestion,
  getAnswerValueFromArrayOfMaps,
  getValidationError,
  getRiskAssessmentEnumValue,
  removeSlashes,
  fullName,
  startsWith,
  removePrefix,
  getOptionValidationError,
} from './utils'
import { ApplicationInfo } from '../applicationInfo'
import config from '../config'
import { CHECK_ANSWERS_PAGE_ID, FEATURE_FLAGS, FEEDBACK_URL } from './constants'
import { formatDocumentCategory } from '../services/documentService'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, applicationInfo: ApplicationInfo): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Prepare someone for release'
  app.locals.applicationInsightsConnectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || ''
  app.locals.enableApplicationInsights = config.enableApplicationInsights
  // Cachebusting version string
  if (production) {
    // Version only changes with new commits
    app.locals.version = applicationInfo.gitShortHash
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist/',
      'node_modules/govuk-frontend/dist/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
    ],
    {
      autoescape: true,
      express: app,
      dev: !production,
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('formatDate', formatDate)
  njkEnv.addFilter('formatDateExtended', formatDateExtended)
  njkEnv.addFilter('getDaysFromDate', getDaysFromDate)
  njkEnv.addFilter('getMostRecentDate', getMostRecentDate)
  njkEnv.addFilter('isFriday', isFriday)
  njkEnv.addFilter('filterByPathway', filterByPathway)
  njkEnv.addFilter('getEnumValue', getEnumValue)
  njkEnv.addFilter('getRiskAssessmentEnumValue', getRiskAssessmentEnumValue)
  njkEnv.addFilter('getAssessmentEnumValue', getAssessmentEnumValue)
  njkEnv.addFilter('getUrlFromName', getUrlFromName)
  njkEnv.addFilter('getNameFromUrl', getNameFromUrl)
  njkEnv.addFilter('getEnumByName', getEnumByName)
  njkEnv.addFilter('getDescriptionFromName', getDescriptionFromName)
  njkEnv.addFilter('roundNumberUp', roundNumberUp)
  njkEnv.addFilter('getCaseNotesIntro', getCaseNotesIntro)
  njkEnv.addFilter('getCaseNotesText', getCaseNotesText)
  njkEnv.addFilter('getResetReason', getResetReason)
  njkEnv.addFilter('getCaseNoteTitle', getCaseNoteTitle)
  njkEnv.addFilter('formatDateToIso', formatDateToIso)
  njkEnv.addFilter('formatTime', formatTime)
  njkEnv.addFilter('formatTimeWithDuration', formatTimeWithDuration)
  njkEnv.addGlobal('dpsUrl', config.dpsHomeUrl)
  njkEnv.addGlobal('phaseName', config.phaseName)
  njkEnv.addFilter('convertArrayToCommaSeparatedList', convertArrayToCommaSeparatedList)
  njkEnv.addFilter('createReferralsSubNav', createReferralsSubNav)
  njkEnv.addFilter('createReferralsId', createReferralsId)
  njkEnv.addFilter('getQueryString', getQueryString)
  njkEnv.addFilter('toTitleCase', toTitleCase)
  njkEnv.addFilter('getFeatureFlag', getFeatureFlag, true)
  njkEnv.addGlobal('features', FEATURE_FLAGS)
  njkEnv.addFilter('formatAddress', formatAddress)
  njkEnv.addFilter('getCaseNotesIntro', getCaseNotesIntro)
  njkEnv.addFilter('getAnswerToCurrentQuestion', getAnswerToCurrentQuestion)
  njkEnv.addGlobal('feedbackUrl', FEEDBACK_URL)
  njkEnv.addFilter('getAnswerValueFromArrayOfMaps', getAnswerValueFromArrayOfMaps)
  njkEnv.addFilter('getValidationError', getValidationError)
  njkEnv.addFilter('getOptionValidationError', getOptionValidationError)
  njkEnv.addFilter('formatDocumentCategory', formatDocumentCategory)
  njkEnv.addFilter('removeSlashes', removeSlashes)
  njkEnv.addFilter('fullName', fullName)
  njkEnv.addFilter('startsWith', startsWith)
  njkEnv.addFilter('removePrefix', removePrefix)
  njkEnv.addGlobal('checkAnswersPageId', CHECK_ANSWERS_PAGE_ID)
}
