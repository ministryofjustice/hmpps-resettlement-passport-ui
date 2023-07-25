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
    const licenceConditions = {
      status: 'In Progress',
      standardLicenceConditions: [
        {
          id: 98987,
          text: 'Be of generally good behaviour',
        },
        {
          id: 98987,
          text: 'Be of really good behaviour',
        },
        {
          id: 98987,
          text: 'Be of extremely good behaviour',
        },
      ],
      standardPssConditions: [
        {
          id: 98987,
          text: 'Be of generally good behaviour',
        },
      ],
      additionalLicenceConditions: [
        {
          id: 98989,
          image: true,
          text: 'You must not enter the location Tesco Superstore',
        },
      ],
      additionalPssConditions: [
        {
          id: 98989,
          image: true,
          text: 'You must not enter the location Tesco Superstore',
        },
      ],
      bespokeConditions: [
        {
          id: 98989,
          text: 'You should not visit any music venues',
        },
      ],
    }
    res.render('pages/prisoner-profile', { licenceConditions })
  })

  return router
}
