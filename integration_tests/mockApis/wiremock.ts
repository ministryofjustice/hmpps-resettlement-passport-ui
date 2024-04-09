import superagent, { SuperAgentRequest, Response } from 'superagent'
import { readFileSync } from 'fs'

const url = 'http://localhost:9091/__admin'

const stubFor = (mapping: WireMockMapping): SuperAgentRequest => superagent.post(`${url}/mappings`).send(mapping)

const getMatchingRequests = body => superagent.post(`${url}/requests/find`).send(body)

const resetStubs = (): Promise<Array<Response>> =>
  Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

const importStubs = (fixture: string): SuperAgentRequest =>
  superagent.post(`${url}/mappings/import`).send(readFileSync(`integration_tests/fixtures/${fixture}`))

export type WireMockMapping = {
  name?: string
  request: WireMockRequest
  response: WireMockResponse
  scenarioName?: string
  requiredScenarioState?: string
  newScenarioState?: string
}

type WireMockResponse = {
  body?: string
  jsonBody?: unknown
  base64Body?: string
  headers?: Record<string, unknown>
  status: number
}

type WireMockRequest = {
  body?: unknown
  bodyPatterns?: unknown
  cookies?: Record<string, unknown>
  url?: string
  urlPattern?: string
  urlPathPattern?: string
  headers?: Record<string, unknown>
  method: Method
  queryParameters?: Record<string, unknown>
}

type Method = 'ANY' | 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE'

export { stubFor, getMatchingRequests, resetStubs, importStubs }
