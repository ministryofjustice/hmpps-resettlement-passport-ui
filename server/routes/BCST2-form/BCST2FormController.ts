import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import BCST2FormView from './BCST2FormView'
import formatAssessmentResponse from '../../utils/formatAssessmentResponse'
import { createRedisClient } from '../../data/redisClient'
import AssessmentStore from '../../data/assessmentStore'
import { SubmittedInput, SubmittedQuestionAndAnswer } from '../../data/model/BCST2Form'

export default class BCST2FormController {
  constructor(private readonly rpService: RpService) {}

  getNextPage: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { token } = req.user
    const { pathway } = req.query

    const nextPage = await this.rpService.fetchNextPage(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      pathway as string,
      {
        questionsAndAnswers: null,
      },
      null,
    )
    const { nextPageId } = nextPage

    res.redirect(
      `/BCST2-assessment/pathway/${pathway}/page/${nextPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}`,
    )
  }

  saveAnswerAndGetNextPage: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { token } = req.user
    const { pathway, currentPageId } = req.body
    const store = new AssessmentStore(createRedisClient())

    // prepare current Q&A's from req body for post request
    const dataToSubmit: SubmittedInput = formatAssessmentResponse(
      await store.getCurrentPage(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway),
      req.body,
    )

    // get previous Q&A's
    const allQuestionsAndAnswers = JSON.parse(
      await store.getAssessment(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway),
    )

    if (allQuestionsAndAnswers) {
      dataToSubmit.questionsAndAnswers.forEach((newQandA: SubmittedQuestionAndAnswer) => {
        const index = allQuestionsAndAnswers.questionsAndAnswers.findIndex(
          (existingQandA: SubmittedQuestionAndAnswer) => {
            return existingQandA.question === newQandA.question
          },
        )

        if (index !== -1) {
          // Replace the existing question with the new one
          allQuestionsAndAnswers.questionsAndAnswers[index] = newQandA
        } else {
          // Add the new question if it doesn't exist
          allQuestionsAndAnswers.questionsAndAnswers.push(newQandA)
        }
      })
    }

    await store.setAssessment(
      req.session.id,
      `${prisonerData.personalDetails.prisonerNumber}`,
      pathway,
      allQuestionsAndAnswers || dataToSubmit,
      3600,
    )

    const nextPage = await this.rpService.fetchNextPage(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      pathway as string,
      dataToSubmit as SubmittedInput,
      currentPageId,
    )
    const { nextPageId } = nextPage

    res.redirect(
      `/BCST2-assessment/pathway/${pathway}/page/${nextPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}`,
    )
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { token } = req.user
    const { pathway, currentPageId } = req.params
    const assessmentPage = await this.rpService.getAssessmentPage(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      pathway as string,
      currentPageId,
    )

    const store = new AssessmentStore(createRedisClient())
    store.setCurrentPage(
      req.session.id,
      `${prisonerData.personalDetails.prisonerNumber}`,
      pathway,
      assessmentPage,
      3600,
    )

    // send all Q&A's to frontend for check answers page
    const allQuestionsAndAnswers = JSON.parse(
      await store.getAssessment(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway),
    )

    const view = new BCST2FormView(prisonerData, assessmentPage, pathway, allQuestionsAndAnswers)
    res.render('pages/BCST2-form', { ...view.renderArgs })
  }
}
