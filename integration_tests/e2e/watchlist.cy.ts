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
    cy.get('button').contains('Add to your cases').click()
    cy.url().should('include', '/prisoner-overview/?prisonerNumber=A8731DY')
  })
  it('Add to cases not found', () => {
    cy.task('stubJohnSmithPostWatchlistNotFound')
    cy.signIn()

    cy.visit('/prisoner-overview/?prisonerNumber=A8731DY')
    cy.get('button').contains('Add to your cases').click()
    cy.url().should('include', '/prisoner-overview/?prisonerNumber=A8731DY')
    cy.get('h2').contains('404')
  })
})
