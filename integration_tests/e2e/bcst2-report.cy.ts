context('BCST2 Report', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubJohnSmithBCST2')
  })

  function clickContinue() {
    cy.get('.govuk-button').click()
  }

  function clickConfirm() {
    clickContinue()
  }

  function clickSubmit() {
    clickContinue()
  }

  function nothingShouldBeSelected() {
    cy.get("input[type='radio']").each(input => {
      cy.wrap(input).should('not.be.checked')
    })
  }

  function getHeading() {
    return cy.get('.govuk-heading-l')
  }

  it('Prisoner Overview should have BCST2 Banner', () => {
    cy.signIn()

    cy.visit('/prisoner-overview?prisonerNumber=A8731DY')

    cy.get('.govuk-notification-banner__heading').should(
      'contain.text',
      'John Smith does not have a completed BCST2 report.',
    )
  })

  it('BCST2 Health pathway scenario', () => {
    cy.signIn()

    cy.visit('/assessment-task-list/?prisonerNumber=A8731DY')
    cy.get('.govuk-grid-column-three-quarters > h2').should('have.text', 'BCST2 report')

    // // Status buttons
    cy.get('.govuk-table__cell > .govuk-tag').each((item, index) => {
      if (index !== 6) {
        cy.wrap(item).should('have.text', 'Completed')
      } else {
        cy.wrap(item).should('have.text', 'Not started')
      }
    })

    // Click Health link
    cy.get(':nth-child(7) > .govuk-table__header > a').click()

    // Should be on the Accommodation pathway page
    getHeading().should('have.text', 'Is the person in prison registered with a GP surgery outside of prison?')
    nothingShouldBeSelected()
    cy.get('#YES').click()

    clickContinue()

    getHeading().should('have.text', 'Does the person in prison want to meet with a prison healthcare team?')
    nothingShouldBeSelected()
    cy.get('#NO').click()

    clickContinue()
    getHeading().should('have.text', 'Health report summary')

    nothingShouldBeSelected()
    cy.get('#SUPPORT_NOT_REQUIRED').click()
    cy.get('#CASE_NOTE_SUMMARY').type('Case Note')

    clickContinue()

    getHeading().should('have.text', 'Check your answers')

    cy.get('.govuk-summary-list__value').eq(0).should('contain.text', 'Yes')
    cy.get('.govuk-summary-list__value').eq(1).should('contain.text', 'No')
    cy.get('.govuk-summary-list__value').eq(2).should('contain.text', 'Support not required')
    cy.get('.govuk-summary-list__value').eq(3).should('contain.text', 'Case Note')
    clickConfirm()

    cy.get('.govuk-table__cell > .govuk-tag').each(item => {
      cy.wrap(item).should('have.text', 'Completed')
    })
    clickSubmit()
    cy.get('.govuk-panel__title').should('contain.text', 'BCST2 report completed')
  })
})