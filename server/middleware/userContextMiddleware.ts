import { type NextFunction, type Request, type Response } from 'express'
import { AsyncLocalStorage } from 'node:async_hooks'

type UserContext = {
  token: string
  sessionId: string
  userId: string
}

const userContext = new AsyncLocalStorage<UserContext>()

export async function userContextMiddleware(req: Request, _: Response, next: NextFunction) {
  const currentContext: UserContext = {
    token: req.user.token,
    sessionId: req.sessionID,
    userId: req.user.username,
  }
  return userContext.run(currentContext, () => {
    next()
  })
}

export function currentUser(): UserContext {
  return userContext.getStore()
}
