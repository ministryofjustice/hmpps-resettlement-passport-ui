import type { ApplicationInfo } from '../applicationInfo'
import Config from '../s3Config'
import logger from '../../logger'

export function addActivePrisons(originalApplicationInfo: ApplicationInfo) {
  const applicationInfo: ApplicationInfo = {
    ...originalApplicationInfo, // clone the incoming param
  }

  Config.getInstance()
    .getConfig()
    .then(c => {
      applicationInfo.additionalFields = {
        activeAgencies: c.activePrisons ?? [],
      }
    })
    .catch(error => {
      logger.warn('Error occurred while retrieving Config', error)
      applicationInfo.additionalFields = {
        activeAgencies: [],
      }
    })

  return applicationInfo
}
