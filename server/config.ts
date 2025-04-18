import { hoursToSeconds } from 'date-fns'

const production = process.env.NODE_ENV === 'production'
const enableApplicationInsights = production
function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    response: number
    deadline: number
  }
  agent: AgentConfig
  logRequestAndResponse?: boolean
}

export default {
  buildNumber: get('BUILD_NUMBER', '1_0_0', requiredInProduction),
  productId: get('PRODUCT_ID', 'UNASSIGNED', requiredInProduction),
  gitRef: get('GIT_REF', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  branchName: get('GIT_BRANCH', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  production,
  https: production,
  staticResourceCacheDuration: '1h',
  redis: {
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
    defaultTtlSeconds: parseInt(process.env.REDIS_DEFAULT_TTL_SECONDS, 10) || hoursToSeconds(24 * 5),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      healthPath: '/health/ping',
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 20000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 20000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 20000))),
      apiClientId: get('API_CLIENT_ID', 'clientid', requiredInProduction),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      healthPath: '/health/ping',
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 20000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 20000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 20000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    rpClient: {
      url: get('RESETTLEMENT_PASSPORT_API_URL', 'http://localhost:8080'),
      healthPath: '/health/ping',
      timeout: {
        response: Number(get('RESETTLEMENT_PASSPORT_API_TIMEOUT_RESPONSE', 20000)),
        deadline: Number(get('RESETTLEMENT_PASSPORT_API_TIMEOUT_DEADLINE', 20000)),
      },
      agent: new AgentConfig(Number(get('RESETTLEMENT_PASSPORT_API_TIMEOUT_RESPONSE', 20000))),
      logRequestAndResponse: get('RESETTLEMENT_PASSPORT_API_LOG_REQUEST_AND_RESPONSE', 'false') === 'true',
    },
    nomisUserRolesClient: {
      url: get('NOMIS_USER_ROLES_API_URL', ''),
      healthPath: '/health/ping',
      timeout: {
        response: Number(get('NOMIS_USER_ROLES_API_TIMEOUT_RESPONSE', 20000)),
        deadline: Number(get('NOMIS_USER_ROLES_API_TIMEOUT_DEADLINE', 20000)),
      },
      agent: new AgentConfig(Number(get('NOMIS_USER_ROLES_API_TIMEOUT_RESPONSE', 20000))),
    },
    manageUsersClient: {
      url: get('MANAGE_USERS_API_URL', ''),
      healthPath: '/health/ping',
      timeout: {
        response: Number(get('MANAGE_USERS_API_TIMEOUT_RESPONSE', 20000)),
        deadline: Number(get('MANAGE_USERS_API_TIMEOUT_DEADLINE', 20000)),
      },
      agent: new AgentConfig(Number(get('MANAGE_USERS_API_TIMEOUT_RESPONSE', 20000))),
    },
    frontendComponents: {
      url: get('COMPONENT_API_URL', 'http://localhost:8082', requiredInProduction),
      healthPath: '/ping',
      timeout: {
        response: Number(get('COMPONENT_API_TIMEOUT_RESPONSE', 20000)),
        deadline: Number(get('COMPONENT_API_TIMEOUT_DEADLINE', 20000)),
      },
      agent: new AgentConfig(Number(get('COMPONENT_API_TIMEOUT_RESPONSE', 20000))),
    },
    gotenberg: {
      url: get('GOTENBERG_API_URL', 'http://localhost:3009', requiredInProduction),
      healthPath: '/health',
    },
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  enableApplicationInsights,
  dpsHomeUrl: get('DPS_URL', '#', requiredInProduction),
  phaseName: get('PHASE_NAME', 'BETA'),
  supportUrl: get('SUPPORT_URL', '', requiredInProduction),
  environmentName: get('ENVIRONMENT_NAME', ''),
  s3: {
    featureFlag: {
      enabled: get('FEATURE_FLAG_ENABLED', 'true') === 'true',
      region: get('FEATURE_FLAG_AWS_REGION', 'eu-west-2'),
      bucketName: get('FEATURE_FLAG_BUCKET', 'hmpps-resettlement-passport-ui-config'),
      path: get('FEATURE_FLAG_PATH', 'feature-flags'),
      filename: get('FEATURE_FLAG_PATH_FILENAME', 'flags.json'),
    },
    config: {
      region: get('CONFIG_AWS_REGION', 'eu-west-2'),
      bucketName: get('CONFIG_BUCKET', 'hmpps-resettlement-passport-ui-config'),
      path: get('CONFIG_PATH', 'config'),
      filename: get('CONFIG_PATH_FILENAME', 'config.json'),
    },
  },
  local: {
    featureFlag: {
      enabled: get('LOCAL_FEATURE_FLAG_ENABLED', 'false') === 'true',
      filename: get('LOCAL_FEATURE_FLAG_PATH_FILENAME', 'localstack/flags.json'),
    },
    config: {
      enabled: get('LOCAL_CONFIG_ENABLED', 'false') === 'true',
      filename: get('LOCAL_CONFIG_PATH_FILENAME', 'localstack/config.json'),
    },
    signOutOnFailure: get('LOCAL_SIGN_OUT_ON_AUTH_FAILURE', 'true') === 'true',
  },
  uploads: {
    tempPath: get('UPLOAD_TEMP_PATH', '/tmp', requiredInProduction),
    maxFileSizeBytes: Number(get('UPLOAD_MAX_FILE_SIZE_BYTES', 10 * 1024 * 1024)),
  },
}
