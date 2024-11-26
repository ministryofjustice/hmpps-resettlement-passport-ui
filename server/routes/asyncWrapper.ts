import type { Request, Response, NextFunction, RequestHandler } from 'express'

export default function asyncWrapper(requestHandler: RequestHandler): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return Promise.resolve(requestHandler(req, res, next)).catch(next)
  }
}
