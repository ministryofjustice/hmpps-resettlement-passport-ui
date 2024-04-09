import IndexPage from '../pages/index'
import Page from '../pages/page'

context('Generate PDF', () => {
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
    cy.task('stubGetOtp')
  })

  it('Plan your future PDF button should be visible', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.headerUserName().should('contain.text', 'J. Smith')
    // go to overview
    cy.visit('prisoner-overview?prisonerNumber=G4161UF')
    // click generate otp btn
    cy.get('#generate-pdf-task-btn').should('exist')

    cy.downloadFile('http://localhost:3007/print/packPdf?prisonerNumber=G4161UF', '', 'test.pdf')
    cy.readFile('test.pdf').should('exist')
  })
})
