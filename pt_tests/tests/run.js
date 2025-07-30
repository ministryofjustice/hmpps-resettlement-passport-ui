import { Trend, Rate, Counter, Gauge } from 'k6/metrics'

export { mainDevBrowserTest } from './browserTests.js'

export const errorRate = new Rate('errors')
const executionType = __ENV.EXECUTION_TYPE
console.log(__ENV.EXECUTION_TYPE)

const ExecutionOptions_Scenarious = getScenarios(executionType)

export const options = {
  scenarios: ExecutionOptions_Scenarious,
  insecureSkipTLSVerify: true,
  thresholds: {
    browser_http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    browser_http_req_duration: ['p(50)<1000', 'p(95)<2000', 'p(99)<5000'], // 50% of requests should be below 1000s, 95% of requests should be below 2000ms / 99% of requests should be below 5000ms
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2000ms
  },
}

export function getScenarios(executionType) {
  switch (executionType) {
    case 'smoke': {
      return {
        browserTest: {
          executor: 'shared-iterations',
          exec: 'mainDevBrowserTest',
          vus: 1,
          iterations: 1,
          maxDuration: '30s',
          options: {
            browser: {
              type: 'chromium',
            },
          },
        },
      }
    }
  }
}

export default function () {
  mainDevBrowserTest()
}
