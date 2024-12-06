import fs from 'fs'
import Banner from './banner'

jest.mock('fs')
const mockedReadFileSync = jest.mocked(fs.readFileSync)

describe('Banner', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getInstance', () => {
    it('should return the same instance on multiple calls', () => {
      const instance1 = Banner.getInstance()
      const instance2 = Banner.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('getBanners', () => {
    it('should return banners sorted by version in descending order', () => {
      jest.spyOn(Banner.prototype, 'getFiles').mockReturnValue(['banner1.json', 'banner2.json', 'invalid.txt'])
      mockReadFileSync()

      const banners = Banner.getBanners()
      expect(banners).toEqual([
        {
          version: '2',
          banner: {
            date: '2024-02-01',
            bodyText: 'Bug fixes and improvements',
            bulletPoints: ['Fix A', 'Improvement B'],
            detailsLink: 'https://example.com/details2',
          },
        },
        {
          version: '1',
          banner: {
            date: '2024-01-01',
            bodyText: 'New feature release',
            bulletPoints: ['Feature A', 'Feature B'],
            detailsLink: 'https://example.com/details1',
          },
        },
      ])
    })

    it('should return an empty array if no valid JSON files are found', () => {
      jest.spyOn(Banner.prototype, 'getFiles').mockReturnValue(['invalid.txt'])
      mockedReadFileSync.mockImplementation(() => {
        throw new Error('Unexpected file')
      })

      const banners = Banner.getBanners()
      expect(banners).toEqual([])
    })
  })

  describe('getWhatsNewBannerVersion', () => {
    it('should return the banner details for a given version', () => {
      jest.spyOn(Banner.prototype, 'getFiles').mockReturnValue(['banner1.json', 'banner2.json'])
      mockReadFileSync()

      const banner = Banner.getWhatsNewBannerVersion('2')
      expect(banner).toEqual({
        date: '2024-02-01',
        bodyText: 'Bug fixes and improvements',
        bulletPoints: ['Fix A', 'Improvement B'],
        detailsLink: 'https://example.com/details2',
      })
    })

    it('should return null if the version is not found', () => {
      jest.spyOn(Banner.prototype, 'getFiles').mockReturnValue(['banner1.json'])
      mockedReadFileSync.mockImplementation(filePath => {
        if (typeof filePath === 'string') {
          if (filePath.endsWith('banner1.json')) {
            return JSON.stringify({
              version: '1',
              banner: {
                date: '2024-01-01',
                bodyText: 'New feature release',
                bulletPoints: ['Feature A', 'Feature B'],
                detailsLink: 'https://example.com/details1',
              },
            })
          }
        }
        throw new Error('Unexpected file')
      })

      const banner = Banner.getWhatsNewBannerVersion('3')
      expect(banner).toEqual(null)
    })
  })
})

function mockReadFileSync() {
  mockedReadFileSync.mockImplementation(filePath => {
    if (typeof filePath === 'string') {
      if (filePath.endsWith('banner1.json')) {
        return JSON.stringify({
          version: '1',
          banner: {
            date: '2024-01-01',
            bodyText: 'New feature release',
            bulletPoints: ['Feature A', 'Feature B'],
            detailsLink: 'https://example.com/details1',
          },
        })
      }
      if (filePath.endsWith('banner2.json')) {
        return JSON.stringify({
          version: '2',
          banner: {
            date: '2024-02-01',
            bodyText: 'Bug fixes and improvements',
            bulletPoints: ['Fix A', 'Improvement B'],
            detailsLink: 'https://example.com/details2',
          },
        })
      }
    }
    throw new Error('Unexpected file')
  })
}
