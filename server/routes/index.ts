import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import prisonerOverviewRouter from './prisoner-overview'
import staffDashboardRouterGet from './staff-dashboard'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const use = (path: string | string[], handler: RequestHandler) => router.use(path, asyncMiddleware(handler))
  use('/', staffDashboardRouterGet)
  use('/prisoner-overview', prisonerOverviewRouter)
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

  return router
}
