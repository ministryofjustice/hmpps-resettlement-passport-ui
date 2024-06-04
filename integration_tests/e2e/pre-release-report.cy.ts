context('Pre Release Report', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubJohnSmithPreRelease')
  })

  it('Prisoner Overview should have pre release report banner', () => {
    cy.signIn()

    cy.visit('prisoner-overview?prisonerNumber=A8731DY')

    cy.get('.govuk-notification-banner__heading').should('contain.text', 'John Smith is ready for pre-release report.')

    cy.get('.govuk-notification-banner__link').should('have.attr', 'href').and('include', 'type=RESETTLEMENT_PLAN')
  })

  it('Pre release accommodation pathway scenario', () => {
    cy.signIn()

    cy.visit('/assessment-task-list/?prisonerNumber=A8731DY&type=RESETTLEMENT_PLAN')
    cy.get('.govuk-grid-column-three-quarters > h2').should('have.text', 'Pre-release report')

    // Status buttons
    cy.get('.govuk-table__cell > .govuk-tag').each(item => {
      cy.wrap(item).should('have.text', 'Incomplete')
    })

    // Click Accommodation link
    cy.get(':nth-child(1) > .govuk-table__header > a').click()

    // Should be on the Accommodation pathway page
    getHeading().should('have.text', 'Where did the person in prison live before custody?')
    // Should have no permanent or fixed address pre-selected from immediate needs report answers
    cy.get('#NO_PERMANENT_OR_FIXED').should('be.checked')

    clickContinue()

    getHeading().should('have.text', 'Where will the person in prison live when they are released?')
    cy.get('#NO_ANSWER').should('be.checked')

    clickContinue()
    getHeading().should('have.text', 'Accommodation report summary')

    cy.get('#DONE').should('be.checked')
    cy.get('#CASE_NOTE_SUMMARY').type('Note')
    clickContinue()

    getHeading().should('have.text', 'Check your answers')
    clickConfirm()

    // Should be back to the task list page
    cy.get('.govuk-grid-column-three-quarters > h2').should('have.text', 'Pre-release report')
    // Accommodation should now be completed
    cy.get(':nth-child(1) > .govuk-table__cell > .govuk-tag').should('have.text', 'Completed')
  })
})

function clickContinue() {
  cy.get('.govuk-button').click()
}

function clickConfirm() {
  clickContinue()
}

function getHeading() {
  return cy.get('.govuk-heading-l')
}
