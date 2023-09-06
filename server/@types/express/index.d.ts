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
  }
}

export type PersonalDetails = {
  prisonerNumber: string | unknown
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
}

export type PathwayStatus = {
  pathway: string
  status: string
  lastDateChange: string
}
