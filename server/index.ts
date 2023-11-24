import promClient from 'prom-client'
import cron from 'node-cron'
import { createMetricsApp } from './monitoring/metricsApp'
import createApp from './app'
import { services } from './services'
import FeatureFlags from './featureFlag'
import logger from '../logger'

promClient.collectDefaultMetrics()

// const featureFlags = FeatureFlags.getInstance()
// cron.schedule('* * * * *', async () => {
//   logger.info('Started running feature flags refresh')
//   featureFlags.refreshFeatureFlags()
//   logger.info(`Finished running feature flags refresh`)
// })

const app = createApp(services())
const metricsApp = createMetricsApp()

export { app, metricsApp }
