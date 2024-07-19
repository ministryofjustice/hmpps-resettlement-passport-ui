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
}

export type PathwayVersion = {
  ACCOMMODATION: number
  ATTITUDES_THINKING_AND_BEHAVIOUR: number
  CHILDREN_FAMILIES_AND_COMMUNITY: number
  DRUGS_AND_ALCOHOL: number
  EDUCATION_SKILLS_AND_WORK: number
  FINANCE_AND_ID: number
  HEALTH: number
}

export type Reports = {
  immediateNeedsVersion: PathwayVersion
  preReleaseVersion: PathwayVersion
}
