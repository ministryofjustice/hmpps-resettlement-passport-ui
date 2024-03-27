import IndexPage from '../pages/index'
import Page from '../pages/page'

context('Generate Login Code', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubGetPrisoners')
    cy.task('stubGetPrisonerData')
    cy.task('stubGetPrisonerImage')
    cy.task('stubGetAppointment')
    cy.task('stubGetAppointments')
  })

  it('Login Code can be generated successfully on user request', () => {
    cy.task('stubCreateOtp')
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.headerUserName().should('contain.text', 'J. Smith')
    // go to print otp page
    cy.visit('print/otp?prisonerNumber=G4161UF')
    // should see the new otp generated
    cy.get('.govuk-panel__title').contains('Login code generated')
    // And back btn should exist
    cy.get('.govuk-back-link').should('exist')
  })

  it('Login Code generation shows error on user request', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.headerUserName().should('contain.text', 'J. Smith')
    // go to print otp page
    cy.visit('print/otp?prisonerNumber=G4161UF')
    // should see the error summary message
    cy.get('.govuk-error-summary').contains('Error recreating login code, please try again later')
    // And back btn should exist
    cy.get('.govuk-back-link').should('exist')
  })
})
