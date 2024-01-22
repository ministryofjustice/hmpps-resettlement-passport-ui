import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import BCST2FormView from './BCST2FormView'

export default class BCST2FormController {
  constructor(private readonly rpService: RpService) {}

  getNextPage: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { token } = req.user
    const { pathway } = req.query

    const nextPage = await this.rpService.getNextPage(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      pathway as string,
      {
        questionsAndAnswers: null,
      },
    )
    const { nextPageId } = nextPage

    res.redirect(
      `/BCST2-assessment/pathway/${pathway}/page/${nextPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}`,
    )
  }

  saveAnswerAndGetNextPage: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { token } = req.user
    const { pathway, pageId } = req.body
    console.log(req.body)
    const dataToSubmit = {
      questionsAndAnswers: [
        {
          question: 'WHERE_WILL_THEY_LIVE',
          answer: {
            answer: ['NO_PLACE_TO_LIVE'],
            '@class': 'ResettlementAssessmentResponseQuestion',
          },
        },
      ],
    }

    const nextPage = await this.rpService.getNextPage(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      pathway as string,
      dataToSubmit,
    )
    const { nextPageId } = nextPage

    res.redirect(
      `/BCST2-assessment/pathway/${pathway}/page/${nextPageId}?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}`,
    )
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { token } = req.user
    const { pathway, pageId } = req.params

    const assessmentPage = await this.rpService.getAssessmentPage(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      pathway as string,
      pageId,
    )

    const view = new BCST2FormView(prisonerData, assessmentPage, pathway)
    res.render('pages/BCST2-form', { ...view.renderArgs })
  }
}
