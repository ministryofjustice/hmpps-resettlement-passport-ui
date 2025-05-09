import { query, ValidationChain } from 'express-validator'

export function getValidationForPathwayQuery(): ValidationChain[] {
  return [
    query('page').isInt({ min: 0 }).optional().withMessage('page must be a positive integer'),
    query('createdByUserId').isInt({ min: 0 }).optional().withMessage('createdByUserId must be a positive integer'),
    query('supportNeedsUpdatesPage')
      .isInt({ min: 0 })
      .optional()
      .withMessage('supportNeedsUpdatesPage must be a positive integer'),
    query('supportNeedUpdateSort')
      .isIn(['createdDate,DESC', 'createdDate,ASC'])
      .optional()
      .withMessage('supportNeedUpdateSort must be createdDate,DESC or createdDate,ASC'),
  ]
}
