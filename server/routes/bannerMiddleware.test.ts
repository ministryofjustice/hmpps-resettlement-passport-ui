import { Request, Response } from 'express'
import { milliseconds } from 'date-fns'
import bannerMiddleware from './bannerMiddleware'
import Banner from '../banner'

describe('Banner Middleware', () => {
  const banner = {
    date: 'date',
    bodyText: 'bodyText',
    bulletPoints: ['bulletPoint'],
    detailsLink: 'detailsLink',
  }

  const nextFn = jest.fn()
  const getWhatsNewBannerVersion = jest.spyOn(Banner, 'getWhatsNewBannerVersion')

  beforeEach(() => {
    getWhatsNewBannerVersion.mockReturnValue(banner)
  })

  afterEach(() => {
    nextFn.mockReset()
    getWhatsNewBannerVersion.mockReset()
  })

  describe('if whats new feature is not enabled', () => {
    const req = { config: { whatsNew: { enabled: false } } } as unknown as Request
    const res = { locals: {} } as unknown as Response

    it('should add whatsNewEnabled = false to res.locals', async () => {
      bannerMiddleware()(req, res, nextFn)

      expect(res.locals).toEqual({ whatsNewEnabled: false })
      expect(nextFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('if whats new feature is enabled', () => {
    const reqBase = {
      config: {
        whatsNew: {
          enabled: true,
          version: '20200611',
        },
      },
      user: { username: 'JoeBloggs' },
      cookies: {},
      query: {},
      url: '/page',
    }
    const res = { locals: {}, cookie: jest.fn() } as unknown as Response
    const cookieName = `whatsnew-${reqBase.user.username}`

    it('should return the banner information in res.locals', async () => {
      const req = { ...reqBase } as unknown as Request

      bannerMiddleware()(req, res, nextFn)

      expect(res.locals).toEqual({
        whatsNewEnabled: true,
        whatsNewDismissUrl: 'http://localhost:3000/page?dismissWhatsNew=true',
        whatsNewVersion: req.config.whatsNew.version,
        banner,
      })
      expect(nextFn).toHaveBeenCalledTimes(1)
    })

    it('should dismiss the banner if the user chooses', async () => {
      const req = { ...reqBase, query: { dismissWhatsNew: 'true' } } as unknown as Request

      bannerMiddleware()(req, res, nextFn)

      expect(res.cookie).toHaveBeenCalledWith(cookieName, req.config.whatsNew.version, {
        httpOnly: true,
        secure: true,
        maxAge: milliseconds({ years: 1 }),
        sameSite: 'lax',
      })
      expect(res.locals.whatsNewEnabled).toBe(false)
      expect(nextFn).toHaveBeenCalledTimes(1)
    })

    it('should not show the banner if the user has already dismissed it', async () => {
      const req = {
        ...reqBase,
        cookies: { [cookieName]: reqBase.config.whatsNew.version },
      } as unknown as Request

      bannerMiddleware()(req, res, nextFn)

      expect(res.locals.whatsNewEnabled).toBe(false)
      expect(nextFn).toHaveBeenCalledTimes(1)
    })

    it('should show the banner if the user has dismissed a previous version', async () => {
      const req = {
        ...reqBase,
        cookies: { [cookieName]: 'previous-version' },
      } as unknown as Request

      bannerMiddleware()(req, res, nextFn)

      expect(res.locals.whatsNewEnabled).toBe(true)
      expect(nextFn).toHaveBeenCalledTimes(1)
    })
  })
})
