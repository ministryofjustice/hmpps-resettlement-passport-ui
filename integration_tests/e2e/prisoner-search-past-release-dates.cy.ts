context('Prisoner search page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubSignIn')
    cy.task('stubAuthUser', { name: 'john smith', nomis: true })
  })

  afterEach(() => {
    cy.task('restoreFlags')
  })

  it('Past release dates feature flag turned on', () => {
    cy.task('stubDefaultSearchResults')
    cy.signIn()

    cy.visit('/')

    cy.get('[data-qa="prisoner-table-row"]').should('have.length', 3)
  })

  it('Past release dates feature flag turned off', () => {
    cy.task('stubDefaultSearchResultsNoPastReleaseDates')
    cy.task(
      'overwriteFlags',
      JSON.stringify([
        {
          feature: 'includePastReleaseDates',
          enabled: false,
        },
      ]),
    )
    cy.signIn()

    cy.visit('/')

    cy.get('[data-qa="prisoner-table-row"]').should('have.length', 2)
  })
})
