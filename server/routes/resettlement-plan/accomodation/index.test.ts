import { Request, Response } from 'express'
import ResettlementPlanAccomodationController from '.'

afterEach(() => {
  jest.resetAllMocks()
})
describe('resettlement plan - accoomation test', () => {
  const res = {} as unknown as Response
  res.json = jest.fn()
  res.status = jest.fn(() => res)
  res.render = jest.fn()

  it('it should render page2 when answer1 is true and current page is page1', () => {
    const service = new ResettlementPlanAccomodationController()
    const req = {
      headers: {},
      body: {
        pathway: 'Accomodation',
        answer1: true,
        answer2: false,
        currentPage: 'page1',
      },
    } as Request

    service.postView(req, res, null)

    expect(res.render).toHaveBeenCalledWith('page2')
  })

  it('it should render page3 when answer2 is true and current page is page1', () => {
    const service = new ResettlementPlanAccomodationController()
    const req = {
      headers: {},
      body: {
        pathway: 'Accomodation',
        answer1: false,
        answer2: true,
        currentPage: 'page1',
      },
    } as Request

    service.postView(req, res, null)

    expect(res.render).toHaveBeenCalledWith('page3')
  })
})
