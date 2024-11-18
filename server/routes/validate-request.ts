import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

export function prisonerNumberValidate(req: Request, res: Response, next: NextFunction) {
  const { prisonerNumber }: { prisonerNumber?: string } = req.query
  if (prisonerNumber) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      next({
        customMessage: 'No data found for prisoner',
      })
    }
  }
  next()
}
