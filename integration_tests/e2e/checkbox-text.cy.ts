context('Check-box', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  it('Check display of Checkbox subTitle', () => {
    cy.task('stubJohnSmithCheckBox')
    cy.signIn()

    cy.visit('/assessment-task-list/?prisonerNumber=A8731DY&type=RESETTLEMENT_PLAN')

    // Click Accommodation link
    cy.get(':nth-child(1) > .govuk-table__header > a').click()

    // Should be on the Accommodation pathway page
    cy.get('.govuk-heading-l').should('have.text', 'Where did the person in prison live before custody?')
    cy.get('#waste-hint').should('have.text', 'New subTitle text here')
  })
})
