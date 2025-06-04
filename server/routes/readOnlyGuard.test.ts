import { Request, Response, NextFunction } from 'express'
import { readOnlyGuard } from './readOnlyGuard'
import { FEATURE_FLAGS } from '../utils/constants'
import * as utils from '../utils/utils'

describe('Read Only Guard', () => {
  const getFeatureFlagBoolean = jest.spyOn(utils, 'getFeatureFlagBoolean')

  afterEach(() => {
    getFeatureFlagBoolean.mockReset()
  })

  it('should use the read only mode feature flag', async () => {
    getFeatureFlagBoolean.mockResolvedValue(false)

    const req = {} as Request
    const res = {} as Response
    const next = jest.fn()

    await readOnlyGuard(req, res, next)

    expect(getFeatureFlagBoolean).toHaveBeenCalledTimes(1)
    expect(getFeatureFlagBoolean).toHaveBeenCalledWith(FEATURE_FLAGS.READ_ONLY_MODE)
  })

  it('if read only mode is enabled - return a 404 and render the read only mode page', async () => {
    getFeatureFlagBoolean.mockResolvedValue(true)

    const render = jest.fn()
    const status = jest.fn().mockReturnValue({ render })

    const req = {} as Request
    const res = { status } as unknown as Response
    const next = jest.fn() as NextFunction

    await readOnlyGuard(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(render).toHaveBeenCalledWith('pages/read-only-mode')
    expect(next).not.toHaveBeenCalled()
  })

  it('if read only mode is disabled - do nothing and continue to the next function', async () => {
    getFeatureFlagBoolean.mockResolvedValue(false)

    const req = {} as Request
    const res = {} as Response
    const next = jest.fn()

    await readOnlyGuard(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})
