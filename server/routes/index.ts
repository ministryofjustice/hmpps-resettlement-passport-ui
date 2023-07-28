import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('pages/index')
  })
  get('/accommodation', (req, res, next) => {
    res.render('pages/accommodation')
  })
  get('/attitudes-thinking-and-behaviour', (req, res, next) => {
    res.render('pages/attitudes-thinking-behaviour')
  })
  get('/children-families-and-communities', (req, res, next) => {
    res.render('pages/children-families-communities')
  })
  get('/drugs-and-alcohol', (req, res, next) => {
    res.render('pages/drugs-alcohol')
  })
  get('/education-skills-and-work', (req, res, next) => {
    res.render('pages/education-skills-work')
  })
  get('/finance-and-id', (req, res, next) => {
    res.render('pages/finance-id')
  })
  get('/add-an-id', (req, res, next) => {
    res.render('pages/add-id')
  })
  get('/add-a-bank-account', (req, res, next) => {
    res.render('pages/add-bank-account')
  })
  get('/health-status', (req, res, next) => {
    res.render('pages/health')
  })
  get('/prisoner-profile', async (req, res, next) => {
    try {
      const token = res.locals?.user?.token
      const prisonerId = 'G4274GN'

      const headers = {
        Authorization: `Bearer ${token}`,
      }

      const apiResponse = await fetch(
        `https://resettlement-passport-api-dev.hmpps.service.justice.gov.uk/resettlement-passport/prisoner/${prisonerId}/licence-condition`,
        { headers },
      )
      const licenceConditions = await apiResponse.json()

      if (!apiResponse.ok) {
        throw new Error(licenceConditions.userMessage)
      }
      res.render('pages/prisoner-profile', { licenceConditions })
    } catch (error) {
      const errorMessage = error.message
      res.render('pages/prisoner-profile', { errorMessage })
    }
  })

  return router
}
