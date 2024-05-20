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
    cy.get('button#add-to-your-cases-btn').should('contain.text', 'Add to your cases')
    cy.get('button#add-to-your-cases-btn').click()
    cy.url().should('include', '/prisoner-overview/?prisonerNumber=A8731DY')
    cy.get('button#add-to-your-cases-btn').should('contain.text', 'Remove from your cases')
  })
  it('Add to cases not found', () => {
    cy.task('stubJohnSmithPostWatchlistNotFound')
    cy.signIn()

    cy.visit('/prisoner-overview/?prisonerNumber=A8731DY')
    cy.get('button#add-to-your-cases-btn').should('contain.text', 'Add to your cases')
    cy.get('button#add-to-your-cases-btn').click()
    cy.url().should('include', '/addToYourCases/')
    cy.get('h1').should('contain.text', 'Error adding to your cases')
  })
  it('Remove from cases success', () => {
    cy.task('stubJohnSmithDeleteWatchlist')
    cy.signIn()

    cy.visit('/prisoner-overview/?prisonerNumber=A8731DY')
    cy.get('button#add-to-your-cases-btn').should('contain.text', 'Remove from your cases')
    cy.get('button#add-to-your-cases-btn').click()
    cy.url().should('include', '/prisoner-overview/?prisonerNumber=A8731DY')
    cy.get('button#add-to-your-cases-btn').should('contain.text', 'Add to your cases')
  })
  it('Remove from cases not found', () => {
    cy.task('stubJohnSmithDeleteWatchlistNotFound')
    cy.signIn()

    cy.visit('/prisoner-overview/?prisonerNumber=A8731DY')
    cy.get('button#add-to-your-cases-btn').should('contain.text', 'Remove from your cases')
    cy.get('button#add-to-your-cases-btn').click()
    cy.url().should('include', '/removeFromYourCases/')
    cy.get('h1').should('contain.text', 'Error removing from your cases')
  })
})
