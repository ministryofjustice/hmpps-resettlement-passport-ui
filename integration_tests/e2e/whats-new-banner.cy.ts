context(`What's new banner`, () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubSignIn')
    cy.task('stubAuthUser', { name: 'john smith', nomis: true })
  })

  it(`Shows what's new banner on dashboard page, it can be dismissed`, () => {
    cy.task('stubDefaultSearchResults')
    cy.signIn()

    cy.visit('/')
    cy.get('[data-qa="page-heading"]').should('contain.text', 'All pathways overview')

    cy.get('#whats-new-banner').should('be.visible')
    cy.get('#whats-new-dismiss').click()

    cy.get('[data-qa="page-heading"]').should('contain.text', 'All pathways overview')
    cy.get('#whats-new-banner').should('not.exist')

    // Should persist banner dismiss after reloading page
    cy.visit('/')
    cy.get('[data-qa="page-heading"]').should('contain.text', 'All pathways overview')
    cy.get('#whats-new-banner').should('not.exist')
  })
})
