function assertShouldNotHaveAddressAnswer() {
  cy.get('.govuk-summary-list__key').should(itemKeys => {
    expect(itemKeys.get().map(e => e.textContent)).to.not.contain('Enter the address')
  })
}

context('BCST2 Report', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
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
    cy.task('stubJohnSmithBCST2Health')
    cy.signIn()

    cy.visit('/prisoner-overview?prisonerNumber=A8731DY')

    cy.get('.govuk-notification-banner__heading').should(
      'contain.text',
      'John Smith does not have a completed BCST2 report.',
    )
  })

  it('BCST2 Health pathway scenario', () => {
    cy.task('stubJohnSmithBCST2Health')
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

  it('BCST2 Back button and divergent paths scenario', () => {
    cy.task('stubJohnSmithBCST2Accommodation')
    cy.signIn()

    cy.visit('/assessment-task-list/?prisonerNumber=A8731DY')
    cy.get('.govuk-grid-column-three-quarters > h2').should('have.text', 'BCST2 report')

    // Click Accommodation link
    cy.get(':nth-child(1) > .govuk-table__header > a').click()

    getHeading().should('have.text', 'Where did the person in prison live before custody?')
    cy.get('#PRIVATE_RENTED_HOUSING').check()
    clickContinue()

    cy.get('.govuk-fieldset__legend').should('have.text', 'Enter the address')
    cy.get('#address-line-1').type('line1')
    cy.get('#address-town').type('town')
    cy.get('#address-postcode').type('postcode')
    clickContinue()

    getHeading().should(
      'have.text',
      'Does the person in prison or their family need help to keep their home while they are in prison?',
    )

    // Go back twice to the where did they live question
    cy.go('back')
    cy.get('.govuk-fieldset__legend').should('have.text', 'Enter the address')
    cy.go('back')
    getHeading().should('have.text', 'Where did the person in prison live before custody?')
    cy.get('#PRIVATE_RENTED_HOUSING').should('be.checked')

    // Change answer to go down a different path
    cy.get('#NO_PERMANENT_OR_FIXED').check()
    clickContinue()

    getHeading().should('have.text', 'Where will the person in prison live when they are released?')
    cy.get('#DOES_NOT_HAVE_ANYWHERE').check()
    clickContinue()

    getHeading().should('have.text', 'Accommodation report summary')
    cy.get('#SUPPORT_REQUIRED').check()
    cy.get('#CASE_NOTE_SUMMARY').type('Needs somewhere to stay')
    clickContinue()

    getHeading().should('have.text', 'Check your answers')
    assertShouldNotHaveAddressAnswer()

    clickConfirm()
    cy.url().should('contain', '/assessment-task-list?prisonerNumber=A8731DY')
  })

  it('BCST2 Divergent paths scenario with edit', () => {
    cy.task('stubJohnSmithBCST2Accommodation')
    cy.signIn()

    cy.visit('/assessment-task-list/?prisonerNumber=A8731DY')
    cy.get('.govuk-grid-column-three-quarters > h2').should('have.text', 'BCST2 report')

    // Click Accommodation link
    cy.get(':nth-child(1) > .govuk-table__header > a').click()

    getHeading().should('have.text', 'Where did the person in prison live before custody?')
    cy.get('#PRIVATE_RENTED_HOUSING').check()
    clickContinue()

    cy.get('.govuk-fieldset__legend').should('have.text', 'Enter the address')
    cy.get('#address-line-1').type('line1')
    cy.get('#address-town').type('town')
    cy.get('#address-postcode').type('postcode')
    clickContinue()

    getHeading().should(
      'have.text',
      'Does the person in prison or their family need help to keep their home while they are in prison?',
    )

    cy.get('#NO').check()
    clickContinue()

    getHeading().should('have.text', 'Accommodation report summary')
    cy.get('#SUPPORT_NOT_REQUIRED').check()
    cy.get('#CASE_NOTE_SUMMARY').type('No support required')
    clickContinue()

    getHeading().should('have.text', 'Check your answers')
    // Click change on the first row - Where did the person in prison live before custody?
    cy.get('.govuk-summary-list__actions').eq(0).children('a').click()

    getHeading().should('have.text', 'Where did the person in prison live before custody?')
    cy.get('#PRIVATE_RENTED_HOUSING').should('be.checked')
    cy.get('#NO_PERMANENT_OR_FIXED').check()
    clickContinue()

    getHeading().should('have.text', 'Where will the person in prison live when they are released?')
    cy.get('#DOES_NOT_HAVE_ANYWHERE').check()
    clickContinue()

    assertShouldNotHaveAddressAnswer()
    clickConfirm()

    cy.url().should('contain', '/assessment-task-list?prisonerNumber=A8731DY')
  })
})
