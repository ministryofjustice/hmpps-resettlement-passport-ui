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

export type PrisonerData = {
  prisonerId: string | unknown
  firstName: string
  lastName: string
  cellLocation: string
  DoB: string
  releaseDate: string
  releaseType: string
  pathways: PathwayStatus[]
}

export type PathwayStatus = {
  pathway: string
  status: string
}
