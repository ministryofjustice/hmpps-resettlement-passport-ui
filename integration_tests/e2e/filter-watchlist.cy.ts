context('Watchlist', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubSignIn')
    cy.task('stubAuthUser', { name: 'john smith', nomis: true })
  })

  it('', () => {
    cy.task('stubJohnSmithWatchlistFilterResults')
    cy.signIn()

    cy.visit('/')

    cy.contains('label', 'Your cases').should('be.visible')
    cy.get('#watchList').should('not.be.checked')

    cy.get('[data-qa="prisoner-table-row"]').should('have.length', 2)

    cy.get('input#watchList').check()
    cy.get('#submit-filter-btn').click()

    cy.get('[data-qa="prisoner-table-row"]').should('have.length', 1).should('contain.text', 'G4161UF')
  })
})
