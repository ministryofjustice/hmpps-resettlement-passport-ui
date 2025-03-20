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
      validationErrors: CustomValidationError[]
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
  immediateNeedsSubmitted: boolean
  preReleaseSubmitted: boolean
  supportNeedsLegacyProfile?: boolean
}

export type PathwayStatus = {
  pathway: string
  status: string
  lastDateChange: string
}

export type ConfigFile = {
  reports: Reports
  whatsNew?: WhatsNewConfig
  supportNeeds?: SupportNeedsConfig
}

export type Reports = {
  immediateNeedsVersion: PathwayVersion
  preReleaseVersion: PathwayVersion
}

export type WhatsNewConfig = {
  enabled: boolean
  version: string
}

export type SupportNeedsConfig = {
  releaseDate: string
}

export type Pathway = keyof typeof PATHWAY_DICTIONARY

export type PathwayVersion = Record<Pathway, number>

export type BannerFile = {
  version: string
  banner: BannerDetails
}

type BannerDetails = {
  date: string
  bodyText: string
  bulletPoints: string[]
  detailsLink: string
}

export type CustomValidationError = {
  id: string
  type: CustomValidationErrorType
  text: string
  href: string
}

export type CustomValidationErrorType =
  | 'SUPPORT_NEEDS_MISSING_SELECTION_IN_CATEGORY'
  | 'SUPPORT_NEEDS_MISSING_OTHER_TEXT'
  | 'SUPPORT_NEEDS_NO_SELECTION'
  | 'SUPPORT_NEEDS_OTHER_TOO_LONG'
