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
} from './utils'
import { ApplicationInfo } from '../applicationInfo'
import config from '../config'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, applicationInfo: ApplicationInfo): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Prepare someone for release'

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
  njkEnv.addFilter('getUrlFromName', getUrlFromName)
  njkEnv.addFilter('getNameFromUrl', getNameFromUrl)
  njkEnv.addFilter('getEnumByName', getEnumByName)
  njkEnv.addFilter('getEnumByURL', getEnumByURL)
  njkEnv.addFilter('getDescriptionFromName', getDescriptionFromName)
  njkEnv.addFilter('roundNumberUp', roundNumberUp)
  njkEnv.addFilter('formatFirstSentence', formatFirstSentence)
  njkEnv.addFilter('formatDateToIso', formatDateToIso)
  njkEnv.addGlobal('dpsUrl', config.dpsHomeUrl)
  njkEnv.addGlobal('phaseName', config.phaseName)
}
