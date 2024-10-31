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

    cy.visit('/drugs-and-alcohol/?prisonerNumber=A8731DY')
    cy.get('div.app-summary-card__body').should('contain.text', 'No report information available')
  })
  it('Licence Condition Map', () => {
    cy.task('stubJohnSmithGetLicenceImage')
    cy.signIn()

    cy.visit('/prisoner-overview/?prisonerNumber=A8731DY')
    cy.get('a[href*="/licence-image/?licenceId="]').should('exist')

    // Temporary removal of 'target' to keep from opening a new tab
    cy.get('a[href*="/licence-image/?licenceId="]').invoke('removeAttr', 'target').click({ force: true })
    cy.get('h1').should('contain.text', 'Not Found')

    cy.visit('/prisoner-overview/?prisonerNumber=A8731DY')
    cy.get('a[href*="/licence-image/?licenceId="]').should('exist')

    // Temporary removal of 'target' to keep from opening a new tab
    cy.get('a[href*="/licence-image/?licenceId="]').invoke('removeAttr', 'target').click({ force: true })
    cy.get('img.licence-image').should('exist')
  })
})
