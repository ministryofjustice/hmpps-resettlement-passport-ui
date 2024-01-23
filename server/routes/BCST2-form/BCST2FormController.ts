import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import BCST2FormView from './BCST2FormView'
import formatAssessmentResponse from '../../utils/formatAssessmentResponse'
import { createRedisClient } from '../../data/redisClient'
import AssessmentStore from '../../data/assessmentStore'
import { SubmittedInput } from '../../data/model/BCST2Form'

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

    // format current Q&A's from req body
    const dataToSubmit = formatAssessmentResponse(
      await store.getCurrentPage(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway),
      req.body,
    )

    // get previous Q&A's
    const allQuestionsAndAnswers = JSON.parse(
      await store.getAssessment(req.session.id, `${prisonerData.personalDetails.prisonerNumber}`, pathway),
    )

    // append current Q&A's to previous Q&A's
    if (allQuestionsAndAnswers) {
      allQuestionsAndAnswers.questionsAndAnswers.push(dataToSubmit.questionsAndAnswers)
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
    console.log(assessmentPage)

    const store = new AssessmentStore(createRedisClient())
    store.setCurrentPage(
      req.session.id,
      `${prisonerData.personalDetails.prisonerNumber}`,
      pathway,
      assessmentPage,
      3600,
    )

    const view = new BCST2FormView(prisonerData, assessmentPage, pathway)
    res.render('pages/BCST2-form', { ...view.renderArgs })
  }
}
