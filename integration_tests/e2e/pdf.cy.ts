import IndexPage from '../pages/index'
import Page from '../pages/page'

context('Generate PDF', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubGetPrisoners')
    cy.task('stubDeleteOtp')
    cy.task('stubGetPrisonerData')
    cy.task('stubGetPrisonerImage')
    cy.task('stubGetAppointment')
    cy.task('stubGetAppointments')
    cy.task('stubFeatureFlags')
  })

  it.skip('Plan your future PDF button should be visible', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.headerUserName().should('contain.text', 'J. Smith')
    // go to overview
    cy.visit('prisoner-overview?prisonerNumber=G4161UF')
    // click generate otp btn
    cy.get('#generate-pdf-task-btn').should('exist')
  })
})
