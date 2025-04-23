import config from './config'

const { buildNumber, gitRef, productId, branchName } = config

export type ApplicationInfo = {
  applicationName: string
  buildNumber: string
  gitRef: string
  gitShortHash: string
  productId: string
  branchName: string
  additionalFields?: Record<string, unknown>
}

export default (): ApplicationInfo => {
  const applicationName = 'hmpps-resettlement-passport-ui'
  return { applicationName, buildNumber, gitRef, gitShortHash: gitRef.substring(0, 7), productId, branchName }
}
