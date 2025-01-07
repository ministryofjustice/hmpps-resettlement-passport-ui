context('Delius SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser', { name: 'john smith', nomis: false })
  })

  it('Login as a Delius user', () => {
    cy.signIn()
    cy.visit('/')
    cy.get('#main-content > p').should(
      'have.text',
      'This functionality is only currently available for NOMIS users. Please log in as a NOMIS user and try again.',
    )
  })
})
