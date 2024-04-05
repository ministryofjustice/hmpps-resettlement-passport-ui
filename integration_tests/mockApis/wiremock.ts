import superagent, { SuperAgentRequest, Response } from 'superagent'
import { readFileSync } from 'fs'

const url = 'http://localhost:9091/__admin'

const stubFor = (mapping: Record<string, unknown>): SuperAgentRequest =>
  superagent.post(`${url}/mappings`).send(mapping)

const getMatchingRequests = body => superagent.post(`${url}/requests/find`).send(body)

const resetStubs = (): Promise<Array<Response>> =>
  Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

const importStubs = (fixture: string): SuperAgentRequest =>
  superagent.post(`${url}/mappings/import`).send(readFileSync(`integration_tests/fixtures/${fixture}`))

export { stubFor, getMatchingRequests, resetStubs, importStubs }
