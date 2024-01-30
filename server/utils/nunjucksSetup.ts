/* eslint-disable no-param-reassign */
import nunjucks from 'nunjucks'
import express from 'express'
import path from 'path'
import {
  formatDate,
  getAgeFromDate,
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
  getEnumByURL,
  roundNumberUp,
  formatFirstSentence,
  formatDateToIso,
  formatTime,
  convertArrayToCommaSeparatedList,
  createReferralsSubNav,
  createReferralsId,
  getQueryString,
  toTitleCase,
  getFeatureFlag,
  getAssessmentEnumValue,
  formatAddress,
  getAnswerToCurrentQuestion,
} from './utils'
import { ApplicationInfo } from '../applicationInfo'
import config from '../config'
import { FEATURE_FLAGS, FEEDBACK_URL } from './constants'

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
      'node_modules/govuk-frontend/',
      'node_modules/govuk-frontend/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('formatDate', formatDate)
  njkEnv.addFilter('getAgeFromDate', getAgeFromDate)
  njkEnv.addFilter('getDaysFromDate', getDaysFromDate)
  njkEnv.addFilter('getMostRecentDate', getMostRecentDate)
  njkEnv.addFilter('isFriday', isFriday)
  njkEnv.addFilter('filterByPathway', filterByPathway)
  njkEnv.addFilter('getEnumValue', getEnumValue)
  njkEnv.addFilter('getAssessmentEnumValue', getAssessmentEnumValue)
  njkEnv.addFilter('getUrlFromName', getUrlFromName)
  njkEnv.addFilter('getNameFromUrl', getNameFromUrl)
  njkEnv.addFilter('getEnumByName', getEnumByName)
  njkEnv.addFilter('getEnumByURL', getEnumByURL)
  njkEnv.addFilter('getDescriptionFromName', getDescriptionFromName)
  njkEnv.addFilter('roundNumberUp', roundNumberUp)
  njkEnv.addFilter('formatFirstSentence', formatFirstSentence)
  njkEnv.addFilter('formatDateToIso', formatDateToIso)
  njkEnv.addFilter('formatTime', formatTime)
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
  njkEnv.addFilter('getAnswerToCurrentQuestion', getAnswerToCurrentQuestion)
  njkEnv.addGlobal('feedbackUrl', FEEDBACK_URL)
}
