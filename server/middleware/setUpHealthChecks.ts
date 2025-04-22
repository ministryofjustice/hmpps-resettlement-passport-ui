import express, { Router } from 'express'

import { monitoringMiddleware, endpointHealthComponent } from '@ministryofjustice/hmpps-monitoring'
import type { ApplicationInfo } from '../applicationInfo'
import logger from '../../logger'
import config from '../config'
import Config from '../s3Config'

export default function setUpHealthChecks(originalApplicationInfo: ApplicationInfo): Router {
  const router = express.Router()

  const apiConfig = Object.entries(config.apis)

  const applicationInfo = addActivePrisons(originalApplicationInfo)

  const middleware = monitoringMiddleware({
    applicationInfo,
    healthComponents: apiConfig.map(([name, options]) => endpointHealthComponent(logger, name, options)),
  })

  router.get('/health', middleware.health)
  router.get('/info', middleware.info)
  router.get('/ping', middleware.ping)
  return router
}

function addActivePrisons(originalApplicationInfo: ApplicationInfo) {
  const applicationInfo: ApplicationInfo = {
    ...originalApplicationInfo, // clone the incoming param
  }

  Config.getInstance()
    .getConfig()
    .then(c => {
      applicationInfo.additionalFields = {
        activeAgencies: c.activePrisons ?? ['***'],
      }
    })
    .catch(error => {
      logger.warn('Error occurred while retrieving Config', error)
      applicationInfo.additionalFields = {
        activeAgencies: ['***'],
      }
    })

  return applicationInfo
}
