context('Status Update and add case note', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  it('Can change status and enter a case note', () => {
    cy.task('stubJohnSmithStatusUpdateSuccess')
    cy.signIn()

    cy.visit('/status-update?selectedPathway=accommodation&prisonerNumber=A8731DY')

    cy.get('.govuk-heading-l').should('contain.text', 'Accommodation')
    cy.get('#SUPPORT_REQUIRED').scrollIntoView()
    cy.get('#SUPPORT_REQUIRED').should('be.checked')

    cy.get('#IN_PROGRESS').check()
    cy.get('#caseNoteInput_3').type('Initial enquiries have been made')

    // Submit update
    cy.get('.govuk-button').click()

    // Should go to the accommodation pathway page
    cy.url().should('contain', '/accommodation/?prisonerNumber=A8731DY')

    cy.get('#pathway-status > header.app-summary-card__header > .app-summary-card__title > .govuk-tag').should(
      'contain.text',
      'In progress',
    )
  })
})
