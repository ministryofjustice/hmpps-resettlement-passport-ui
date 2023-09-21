import { RequestHandler } from 'express'
import { UserService } from '../services'

// Adds the users current active case load to the res.locals for the breadcrumbs
const populateUserActiveCaseLoad = (userService: UserService): RequestHandler => {
  return async (req, res, next) => {
    // Only Prison Staff (NOMIS) users will have a caseload
    if (res.locals.user.authSource === 'nomis') {
      try {
        res.locals.userActiveCaseLoad = await userService.getUserActiveCaseLoad(res.locals.user.token)
        next()
      } catch (err) {
        next(err)
      }
    } else {
      next()
    }
  }
}

export default populateUserActiveCaseLoad
