import { RequestHandler } from 'express'
import { validatePathwaySupportNeeds } from '../utils/utils'

export const validatePathwayAndFeatureFlag: RequestHandler = async (req, _res, next): Promise<void> => {
  try {
    const { pathway } = req.params
    await validatePathwaySupportNeeds(pathway)

    return next()
  } catch (err) {
    return next(err)
  }
}
