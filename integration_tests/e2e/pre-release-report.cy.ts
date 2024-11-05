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
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'pre-release report')
    cy.get('.govuk-caption-l').should('contain.text', 'Smith, John (A8731DY)')

    // Status buttons
    cy.get('.govuk-table__cell > .govuk-tag').each(item => {
      cy.wrap(item).should('contain.text', 'Incomplete')
    })

    // Click Accommodation link
    cy.get(':nth-child(1) > .govuk-table__header > a').click()

    // Should be on the Accommodation pathway page
    getHeading().should('contain.text', 'Where did the person in prison live before custody?')
    cy.get('.govuk-caption-l').should('contain.text', 'Smith, John (A8731DY)')
    // Should have no permanent or fixed address pre-selected from immediate needs report answers
    cy.get('#WHERE_DID_THEY_LIVE-NO_PERMANENT_OR_FIXED').should('be.checked')

    clickContinue()

    getHeading().should('contain.text', 'Where will the person in prison live when they are released?')
    cy.get('.govuk-caption-l').should('contain.text', 'Smith, John (A8731DY)')
    cy.get('#WHERE_WILL_THEY_LIVE_2-NO_ANSWER').should('be.checked')

    clickContinue()
    getHeading().should('contain.text', 'Accommodation report summary')
    cy.get('.govuk-caption-l').should('contain.text', 'Smith, John (A8731DY)')

    cy.get('#SUPPORT_NEEDS_PRERELEASE-DONE').should('be.checked')

    // Check if the <details> component is visible
    cy.get('details.govuk-details').should('be.visible')

    // Verify that the <summary> content is visible initially
    cy.get('summary.govuk-details__summary').should('be.visible')

    // Click on the <summary> to toggle the visibility of the content
    cy.get('summary.govuk-details__summary').click()

    // Verify that the content inside <details> is now visible
    cy.get('details.govuk-details').should('have.attr', 'open')
    cy.get('details.govuk-details .govuk-details__text').should('be.visible')

    cy.get('#CASE_NOTE_SUMMARY').type('Note')

    clickContinue()

    getHeading().should('contain.text', 'Check your answers')
    cy.get('.govuk-caption-l').should('contain.text', 'Smith, John (A8731DY)')
    clickConfirm()

    // Should be back to the task list page
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'pre-release report')
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'Smith, John (A8731DY)')
    // Accommodation should now be completed
    cy.get(':nth-child(1) > .govuk-table__cell > .govuk-tag').should('contain.text', 'Completed')
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
