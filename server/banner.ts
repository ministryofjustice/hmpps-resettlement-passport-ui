import fs from 'fs'
import path from 'path'
import logger from '../logger'
import { BannerFile } from './@types/express'

export default class Banner {
  private static instance: Banner

  private bannersFolder = path.join(__dirname, 'views/pages/whats-new')

  public static getInstance(): Banner {
    if (!Banner.instance) {
      Banner.instance = new Banner()
    }
    return Banner.instance
  }

  getFiles(): string[] {
    return fs.readdirSync(this.bannersFolder)
  }

  private loadWhatsNewBanners(): BannerFile[] {
    try {
      const bannerFiles = this.getFiles()
      return bannerFiles
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const filePath = path.join(this.bannersFolder, file)
          const rawData = fs.readFileSync(filePath, 'utf-8')
          return JSON.parse(rawData) as BannerFile
        })
    } catch (err) {
      logger.error(err, 'Error getting whats new banner files')
      return []
    }
  }

  public static getBanners(): BannerFile[] {
    const banner = Banner.getInstance()
    return banner.loadWhatsNewBanners().sort((a, b) => parseInt(b.version, 10) - parseInt(a.version, 10))
  }

  public static getWhatsNewBannerVersion(version: string) {
    const files = Banner.getBanners()
    const matchingBanner = files.find(file => file.version === version)

    if (!matchingBanner) {
      return null
    }
    return matchingBanner.banner
  }
}
