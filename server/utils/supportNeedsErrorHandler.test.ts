import { Request, Response, NextFunction } from 'express'
import { handleSupportNeedsNotFoundRedirect } from './supportNeedsErrorHandler' // adjust path
import { SupportNeedsNotFoundInCacheError } from '../data/supportNeedStateService'
import { PersonalDetails, PrisonerData } from '../@types/express' // adjust path

describe('handleSupportNeedsNotFoundRedirect', () => {
  const prisonerNumber = 'A1234BC'
  const pathway = 'accommodation'
  const personalDetails = { firstName: 'fred', lastName: 'FlintstOne', prisonerNumber } as PersonalDetails
  const prisonerData = { personalDetails } as PrisonerData

  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    req = {
      params: { pathway },
      prisonerData,
    }

    res = {
      redirect: jest.fn(),
    }

    next = jest.fn()
  })

  it('should redirect if error is SupportNeedsNotFoundInCacheError', () => {
    const err = new SupportNeedsNotFoundInCacheError('Not found in cache')

    handleSupportNeedsNotFoundRedirect(err, req as Request, res as Response, next as NextFunction)

    expect(res.redirect).toHaveBeenCalledWith(`/${pathway}?prisonerNumber=${prisonerNumber}`)
    expect(next).not.toHaveBeenCalled()
  })

  it('should call next(err) if error is not SupportNeedsNotFoundInCacheError', () => {
    const err = new Error('Some other error')

    handleSupportNeedsNotFoundRedirect(err, req as Request, res as Response, next as NextFunction)

    expect(next).toHaveBeenCalledWith(err)
    expect(res.redirect).not.toHaveBeenCalled()
  })
})
