import { NextFunction, Request, Response } from 'express'
import { RPClient } from '../data'
import logger from '../../logger'
import { AssessmentStatus, AssessmentsSummary } from '../data/model/assessmentStatus'
import { ERROR_DICTIONARY } from '../utils/constants'

export default async function assessmentsSummaryMiddleware(req: Request, res: Response, next: NextFunction) {
  const { prisonerNumber } = req.query
  let assessmentsSummary: AssessmentsSummary

  const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)

  try {
    const assessmentsSummaryResponse = (await rpClient.get(
      `/resettlement-passport/prisoner/${prisonerNumber}/resettlement-assessment/summary`,
    )) as AssessmentStatus[]
    assessmentsSummary = { results: assessmentsSummaryResponse }
  } catch (err) {
    logger.warn(
      `Session: ${req.sessionID} Cannot retrieve assessments summary for ${prisonerNumber} ${err.status} ${err}`,
    )
    assessmentsSummary = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
  }
  const BCST2Completed: boolean = assessmentsSummary.results
    ? assessmentsSummary.results.every((status: AssessmentStatus) => status.assessmentStatus === 'SUBMITTED')
    : null

  req.assessmentsSummary = assessmentsSummary
  req.BCST2Completed = BCST2Completed
  next()
}
