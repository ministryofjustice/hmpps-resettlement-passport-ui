import { PATHWAY_DICTIONARY } from '../../utils/constants'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
      prisonerData: PrisonerData
      config: ConfigFile
      flash(type: string, message: unknown): number
    }

    interface Response {
      internalRedirect(url: string): void
      renderPDF(
        view: string,
        headerHtml: string,
        pageData: Record<string, unknown>,
        options: Record<string, unknown>,
      ): void
    }
  }
}

export type PersonalDetails = {
  prisonerNumber?: string
  prisonId: string
  prisonName?: string
  firstName: string
  lastName: string
  location: string
  dateOfBirth: string
  releaseDate: string
  releaseType: string
  facialImageId: string
}

export type PrisonerData = {
  personalDetails: PersonalDetails
  pathways: PathwayStatus[]
  prisonerImage?: string
  assessmentRequired: boolean
  resettlementReviewAvailable: boolean
  isInWatchlist: boolean
  immediateNeedsSubmitted: boolean
  preReleaseSubmitted: boolean
}

export type PathwayStatus = {
  pathway: string
  status: string
  lastDateChange: string
}

export type ConfigFile = {
  reports: Reports
  whatsNew?: WhatsNewConfig
}

export type Reports = {
  immediateNeedsVersion: PathwayVersion
  preReleaseVersion: PathwayVersion
}

export type WhatsNewConfig = {
  enabled: boolean
  version: string
}

export type Pathway = keyof typeof PATHWAY_DICTIONARY

export type PathwayVersion = Record<Pathway, number>
