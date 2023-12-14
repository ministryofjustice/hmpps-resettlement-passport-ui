import { Request, RequestHandler } from 'express'

export default class ResettlementPlanAccomodationController {
  decisionTree = [
    {
      pathway: 'Accomodation',
      currentPage: 'page1',
      nextPage: (req: Request) => {
        const { answer1, answer2 } = req.body
        if (answer1 === true) return 'page2'
        if (answer2 === true) return 'page3'
        return null
      },
    },
    {
      pathway: 'Accomodation',
      currentPage: 'page2',
      nextPage: (req: Request) => {
        return 'page4'
      },
    },
  ]

  postView: RequestHandler = async (req, res, next): Promise<void> => {
    const { currentPage } = req.body
    const { pathway } = req.body
    const nextPageFucntion = this.decisionTree.find(
      it => it.currentPage === currentPage && it.pathway === pathway,
    ).nextPage
    const nextPage = nextPageFucntion(req)
    res.render(nextPage)
  }
}
