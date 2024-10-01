context('ResetProfile', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  after(() => {
    cy.task('restoreFlags')
  })

  it('Button navigates to reset profile page', () => {
    cy.task('stubJohnSmithProfileReset')
    cy.signIn()

    const flagsEnabled = [
      {
        feature: 'profileReset',
        enabled: true,
      },
    ]
    cy.task('overwriteFlags', JSON.stringify(flagsEnabled))

    cy.visit('/prisoner-overview/?prisonerNumber=A8731DY')
    cy.get('a#reset-profile-btn').should('contain.text', 'Reset reports and statuses')
    cy.get('a#reset-profile-btn').click()
    cy.url().should('include', '/resetProfile?prisonerNumber=A8731DY')
  })
})
