context('Watchlist', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  it('', () => {
    cy.task('stubJohnSmithWatchlistFilterResults')
    cy.signIn()

    cy.visit('/')

    cy.contains('label', 'Your cases').should('be.visible')
    cy.get('#watchList').should('not.be.checked')
    cy.get('input#watchList').check()
    cy.get('#submit-filter-btn').click()
  })
})
