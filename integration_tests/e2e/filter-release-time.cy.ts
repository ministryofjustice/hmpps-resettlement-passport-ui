context('Release time', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubSignIn')
    cy.task('stubAuthUser', { name: 'john smith', nomis: true })
    cy.task('stubGetPrisoners')
    cy.task('stubGetPrisonerData')
  })

  it('Default search selects all prisoners', () => {
    cy.task('stubDefaultSearchResults')
    cy.signIn()

    cy.visit('/')
    cy.get('select#releaseTime option:selected').should('have.text', 'All prisoners')
    cy.get('[data-qa="prisoner-table-row"]').should('have.length', 3)

    cy.get('select#releaseTime').select('84')
    cy.get('#submit-filter-btn').click()

    cy.get('select#releaseTime option:selected').should('have.text', 'Within 12 weeks')
  })
})
