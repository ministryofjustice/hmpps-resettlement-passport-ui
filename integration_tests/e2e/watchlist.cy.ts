context('Watchlist', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  it('Add to cases success', () => {
    cy.task('stubJohnSmithPostWatchlist')
    cy.signIn()

    cy.visit('/prisoner-overview/?prisonerNumber=A8731DY')
    cy.get('a#add-to-your-cases-btn').click()
    cy.url().should('include', '/prisoner-overview/?prisonerNumber=A8731DY')
  })
  it('Add to cases not found', () => {
    cy.task('stubJohnSmithPostWatchlistNotFound')
    cy.signIn()

    cy.visit('/prisoner-overview/?prisonerNumber=A8731DY')
    cy.get('a#add-to-your-cases-btn').click()
    cy.url().should('include', '/addToYourCases/?prisonerNumber=A8731DY')
  })
})
