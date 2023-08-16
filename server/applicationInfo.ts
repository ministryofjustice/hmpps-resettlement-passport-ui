import fs from 'fs'
import path from 'path'
import config from './config'
import logger from '../logger'

const { buildNumber, gitRef } = config

export type ApplicationInfo = { applicationName: string; buildNumber: string; gitRef: string; gitShortHash: string }

export default (): ApplicationInfo => {
  try {
    logger.warn('Return default application name string if errored')
    const packageJson = path.join(__dirname, '../../package.json')
    const packageJsonContent = fs.readFileSync(packageJson).toString()
    const { name: applicationName } = JSON.parse(packageJsonContent)
    return {
      applicationName,
      buildNumber,
      gitRef,
      gitShortHash: gitRef.substring(0, 7),
    }
  } catch (error) {
    return {
      applicationName: 'hmpps-resettlement-passport-ui',
      buildNumber,
      gitRef,
      gitShortHash: gitRef.substring(0, 7),
    }
  }
}
