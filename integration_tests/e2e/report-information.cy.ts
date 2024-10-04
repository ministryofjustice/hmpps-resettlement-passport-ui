context('Report Information', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  it('No report Information', () => {
    cy.task('stubJohnSmithPostNoReportInfo')
    cy.signIn()

    cy.visit('/accommodation/?prisonerNumber=A8731DY')
    cy.get('div.govuk-error-summary').should(
      'contain.text',
      'Data unavailable - try again later or contact administrator if problem persists',
    )
    cy.visit('/health-status/?prisonerNumber=A8731DY')
    cy.get('div.app-summary-card__body').should('contain.text', 'No report information available')

    cy.visit('/finance-and-id/?prisonerNumber=A8731DY')
    cy.get('div.govuk-error-summary').should('not.exist')
    cy.get('div.app-summary-card__body').should('not.contain', 'No report information available')
  })
})
