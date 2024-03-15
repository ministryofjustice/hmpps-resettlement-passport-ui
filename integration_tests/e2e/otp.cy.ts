import IndexPage from '../pages/index'
import Page from '../pages/page'

context('Generate Otp', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubGetPrisoners')
    cy.task('stubDeleteOtp')
    cy.task('stubGetPrisonerData')
    cy.task('stubGetPrisonerImage')
    cy.task('stubGetAppointments')
  })

  it('Otp can be generated successfully on user request', () => {
    cy.task('stubCreateOtp')
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.headerUserName().should('contain.text', 'J. Smith')
    // go to overview
    cy.visit('prisoner-overview?prisonerNumber=G4161UF')
    // click generate otp btn
    cy.get('#generate-otp-task-btn').click()
    // should see the new otp generated
    cy.get('.govuk-panel__title').contains('Otp generated')
    // And back btn should exist
    cy.get('.govuk-back-link').should('exist')
  })

  it('Otp generation shows error on user request', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.headerUserName().should('contain.text', 'J. Smith')
    // go to overview
    cy.visit('prisoner-overview?prisonerNumber=G4161UF')
    // click generate otp btn
    cy.get('#generate-otp-task-btn').click()
    // should see the error summary message
    cy.get('.govuk-error-summary').contains('Error recreating OTP, please try again later')
    // And back btn should exist
    cy.get('.govuk-back-link').should('exist')
  })
})
