import fs from 'fs'
import path from 'path'
import logger from '../logger'
import { BannerFile } from './@types/express'

export default class Banner {
  private static instance: Banner

  public static getInstance(): Banner {
    if (!Banner.instance) {
      Banner.instance = new Banner()
    }
    return Banner.instance
  }

  private loadWhatsNewBanners(): BannerFile[] {
    try {
      const bannersFolder = path.join(__dirname, 'views/pages/whats-new')
      const bannerFiles = fs.readdirSync(bannersFolder)
      return bannerFiles
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const filePath = path.join(bannersFolder, file)
          const rawData = fs.readFileSync(filePath, 'utf-8')
          return JSON.parse(rawData) as BannerFile
        })
    } catch (err) {
      logger.error(err, 'Error getting whats new banner files')
      return null
    }
  }

  public static getBanners(): BannerFile[] {
    const banner = Banner.getInstance()
    return banner.loadWhatsNewBanners().sort((a, b) => parseInt(b.version, 10) - parseInt(a.version, 10))
  }

  public static getWhatsNewBannerVersion(version: string) {
    const files = Banner.getBanners()
    return files.find(file => file.version === version).banner
  }
}
