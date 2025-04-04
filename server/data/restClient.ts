import superagent from 'superagent'
import Agent, { HttpsAgent } from 'agentkeepalive'
import { Readable } from 'stream'
import { minutesToMilliseconds } from 'date-fns'

import logger from '../../logger'
import sanitiseError from '../sanitisedError'
import { ApiConfig } from '../config'
import type { UnsanitisedError } from '../sanitisedError'
import { restClientMetricsMiddleware } from './restClientMetricsMiddleware'

interface GetRequest {
  path?: string
  query?: string
  headers?: Record<string, string>
  responseType?: string
  raw?: boolean
  retry?: boolean
}

interface PostRequest {
  path?: string
  headers?: Record<string, string>
  responseType?: string
  data?: Record<string, unknown>
  raw?: boolean
  retry?: boolean
}

interface StreamRequest {
  path?: string
  headers?: Record<string, string>
  errorLogger?: (e: UnsanitisedError) => void
}

export default class RestClient {
  agent: Agent

  constructor(
    private readonly name: string,
    private readonly config: ApiConfig,
    private readonly token: string,
    private readonly sessionId: string = '',
    private readonly userId: string = '',
  ) {
    this.token = token
    this.agent = config.url.startsWith('https') ? new HttpsAgent(config.agent) : new Agent(config.agent)
  }

  private apiUrl() {
    return this.config.url
  }

  private timeoutConfig() {
    return this.config.timeout
  }

  async get<Response = unknown>({
    path = null,
    query = '',
    headers = {},
    responseType = '',
    raw = false,
    retry = false,
  }: GetRequest): Promise<Response> {
    try {
      if (this.userId) {
        logger.trace(`User: ${this.userId} Session: ${this.sessionId} making GET request to ${path}`)
      } else {
        logger.trace(`User making GET request to ${path}`)
      }

      const result = await superagent
        .get(`${this.apiUrl()}${path}`)
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, _) => {
          if (retry === false) {
            return false
          }
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .query(query)
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      this.logRequestAndResponse('GET', path, null, raw, result)

      return raw ? (result as Response) : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError, query }, `Error calling ${this.name}, path: '${path}', verb: 'GET'`)
      throw sanitisedError
    }
  }

  async post<Response = unknown>({
    path = null,
    headers = {},
    responseType = '',
    data = {},
    raw = false,
    retry = false,
  }: PostRequest = {}): Promise<Response> {
    try {
      if (this.userId) {
        logger.info(`User: ${this.userId} Session: ${this.sessionId} making POST request to ${path}`)
      } else {
        logger.info(`User making POST request to ${path}`)
      }
      const result = await superagent
        .post(`${this.apiUrl()}${path}`)
        .send(data)
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, _) => {
          if (retry === false) {
            return false
          }
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      this.logRequestAndResponse('POST', path, data, raw, result)

      return raw ? (result as Response) : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'POST'`)
      throw sanitisedError
    }
  }

  async patch({
    path = null,
    headers = {},
    responseType = '',
    data = {},
    raw = false,
    retry = false,
  }: PostRequest = {}): Promise<unknown> {
    try {
      if (this.userId) {
        logger.info(`User: ${this.userId} Session: ${this.sessionId} making PATCH request to ${path}`)
      } else {
        logger.info(`User making PATCH request to ${path}`)
      }
      const result = await superagent
        .patch(`${this.apiUrl()}${path}`)
        .send(data)
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, _) => {
          if (retry === false) {
            return false
          }
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      this.logRequestAndResponse('PATCH', path, null, raw, result)

      return raw ? result : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'PATCH'`)
      throw sanitisedError
    }
  }

  async stream({ path = null, headers = {} }: StreamRequest = {}): Promise<NodeJS.ReadableStream> {
    if (this.userId) {
      logger.info(`User: ${this.userId} Session: ${this.sessionId} making STREAM request to ${path}`)
    } else {
      logger.info(`User making STREAM request to ${path}`)
    }
    return new Promise((resolve, reject) => {
      superagent
        .get(`${this.apiUrl()}${path}`)
        .agent(this.agent)
        .auth(this.token, { type: 'bearer' })
        .use(restClientMetricsMiddleware)
        .retry(2, (err, _) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .timeout(this.timeoutConfig())
        .set(headers)
        .end((error, response) => {
          if (error) {
            logger.warn(sanitiseError(error), `Error calling ${this.name}`)
            reject(error)
          } else if (response) {
            const s = new Readable()
            // eslint-disable-next-line no-underscore-dangle,@typescript-eslint/no-empty-function
            s._read = () => {}
            s.push(response.body)
            s.push(null)
            resolve(s)
          }
        })
    })
  }

  async delete({
    path = null,
    headers = {},
    responseType = '',
    raw = false,
    retry = false,
  }: PostRequest = {}): Promise<unknown> {
    if (this.userId) {
      logger.info(`User: ${this.userId} Session: ${this.sessionId} making DELETE request to ${path}`)
    } else {
      logger.info(`User making DELETE request to ${path}`)
    }
    try {
      const result = await superagent
        .delete(`${this.apiUrl()}${path}`)
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, _) => {
          if (retry === false) {
            return false
          }
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      this.logRequestAndResponse('DELETE', path, null, raw, result)

      return raw ? result : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'DELETE'`)
      throw sanitisedError
    }
  }

  async upload({ path, filePath, originalFilename }: { path: string; filePath: string; originalFilename: string }) {
    try {
      const result = await superagent
        .post(`${this.apiUrl()}${path}`)
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .auth(this.token, { type: 'bearer' })
        // Longer deadline to upload files
        .timeout({ ...this.timeoutConfig(), deadline: minutesToMilliseconds(5) })
        .field('originalFilename', originalFilename)
        .attach('file', filePath)
      return result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'POST' (multipart)`)
      throw sanitisedError
    }
  }

  logRequestAndResponse(
    method: string,
    path: string,
    data: Record<string, unknown>,
    raw: boolean,
    result: superagent.Response,
  ) {
    if (this.config.logRequestAndResponse) {
      logger.info(
        `${method} to ${path}\nRequest body:\n${JSON.stringify(data)}\nRequest response:\n${
          raw ? result : JSON.stringify(result.body)
        }`,
      )
    }
  }
}
