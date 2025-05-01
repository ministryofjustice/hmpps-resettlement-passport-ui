import { Request, Response, NextFunction } from 'express'
import { SupportNeedsNotFoundInCacheError } from '../data/supportNeedStateService'

export function handleSupportNeedsNotFoundRedirect(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof SupportNeedsNotFoundInCacheError) {
    const { pathway } = req.params
    const { prisonerNumber } = req.prisonerData.personalDetails
    res.redirect(`/${pathway}?prisonerNumber=${prisonerNumber}`)
  } else {
    next(err)
  }
}
