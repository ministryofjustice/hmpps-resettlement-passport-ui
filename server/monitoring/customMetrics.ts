import { Counter } from 'prom-client'

const userMetricsCounter = new Counter({
  name: 'user_activity_count',
  help: 'Counts up for each page hit by users. Caseload will only be present if auth_type is nomis.',
  labelNames: ['path', 'auth_type', 'caseload'],
})

export default userMetricsCounter
