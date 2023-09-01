import { RequestHandler } from 'express'
import { UserService } from '../services'

// Adds the users current active case load to the res.locals for the breadcrumbs
const populateUserActiveCaseLoad = (userService: UserService): RequestHandler => {
  return async (req, res, next) => {
    try {
      res.locals.userActiveCaseLoad = await userService.getUserActiveCaseLoad(res.locals.user.token)

      next()
    } catch (err) {
      next(err)
    }
  }
}

export default populateUserActiveCaseLoad
