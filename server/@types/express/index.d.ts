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
    }

    interface Response {
      internalRedirect(url: string): void
      renderPDF(view: string, pageData: Record<string, unknown>, options: Record<string, unknown>): void
    }
  }
}

export type PersonalDetails = {
  prisonerNumber: string | unknown
  prisonId: string
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
}

export type PathwayStatus = {
  pathway: string
  status: string
  lastDateChange: string
}
