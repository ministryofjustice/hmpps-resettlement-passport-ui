import { Request, Response, NextFunction } from 'express'
import { readOnlyGuard } from './readOnlyGuard'
import { FEATURE_FLAGS } from '../utils/constants'
import * as utils from '../utils/utils'

describe('Read Only', () => {
  const getFeatureFlagBoolean = jest.spyOn(utils, 'getFeatureFlagBoolean')

  afterEach(() => {
    getFeatureFlagBoolean.mockReset()
  })

  it('should get the read only mode boolean', async () => {
    getFeatureFlagBoolean.mockResolvedValue(false)

    const req = {} as Request
    const res = {} as Response
    const next = jest.fn()

    await readOnlyGuard(req, res, next)

    expect(getFeatureFlagBoolean).toHaveBeenCalledTimes(1)
    expect(getFeatureFlagBoolean).toHaveBeenCalledWith(FEATURE_FLAGS.READ_ONLY_MODE)
  })

  it('should do nothing if read only is not enabled', async () => {
    getFeatureFlagBoolean.mockResolvedValue(false)

    const req = {} as Request
    const res = {} as Response
    const next = jest.fn()

    await readOnlyGuard(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('should return a 404 error page if read only is enabled', async () => {
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
})
