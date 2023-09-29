import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('All pathways overview')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')
}
