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
} from './utils'
import { ApplicationInfo } from '../applicationInfo'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, applicationInfo: ApplicationInfo): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Digital Prison Services'

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
  njkEnv.addFilter('isFriday', isFriday)
  njkEnv.addFilter('filterByPathway', filterByPathway)
  njkEnv.addFilter('getEnumValue', getEnumValue)
  njkEnv.addFilter('getUrlFromName', getUrlFromName)
  njkEnv.addFilter('getNameFromUrl', getNameFromUrl)
  njkEnv.addFilter('getEnumByName', getEnumByName)
}
