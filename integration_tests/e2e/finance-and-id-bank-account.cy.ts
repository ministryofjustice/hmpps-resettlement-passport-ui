context('Finance and ID - bank account', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  it('Add bank account application', () => {
    cy.task('stubJohnSmithPostFinanceAndID')
    cy.signIn()

    cy.visit('/finance-and-id/?prisonerNumber=A8731DY')

    cy.get('section#finance').find('p').should('contain.text', 'No current applications')
    cy.get('a').contains('Add a bank account application').click()

    cy.get('select#bank').select('Nationwide')
    cy.get('input#applicationSubmittedDay').type('26')
    cy.get('input#applicationSubmittedMonth').type('4')
    cy.get('input#applicationSubmittedYear').type('2024')
    cy.get('.govuk-button').contains('Submit').click()

    cy.get('h2').eq(0).should('contain.text', 'Finance and ID')
    cy.get('h2').eq(1).should('contain.text', 'Check your answers before adding a bank account application')
    cy.get('.govuk-summary-list__row > dt').eq(0).should('contain.text', 'Bank')
    cy.get('.govuk-summary-list__row > dd').eq(0).should('contain.text', 'Nationwide')
    cy.get('.govuk-summary-list__row > dd').eq(1).should('contain.text', 'Change')
    cy.get('.govuk-summary-list__row > dt').eq(1).should('contain.text', 'Application submitted')
    cy.get('.govuk-summary-list__row > dd').eq(2).should('contain.text', '26 April 2024')
    cy.get('.govuk-summary-list__row > dd').eq(3).should('contain.text', 'Change')
    cy.get('.govuk-button').contains('Confirm').click()

    cy.url().should('include', '/finance-and-id/?prisonerNumber=A8731DY#finance')
  })

  it('View bank account application', () => {
    cy.task('stubJohnSmithGetFinanceAndID')
    cy.signIn()

    cy.visit('/finance-and-id/?prisonerNumber=A8731DY')

    cy.get('section#finance').find('h3').eq(0).should('contain.text', 'Finance')
    cy.get('section#finance').find('h3').eq(1).should('contain.text', 'Bank account')
    cy.get('section#finance').find('th').eq(0).should('contain.text', 'Bank')
    cy.get('section#finance').find('td').eq(0).should('contain.text', 'Barclays')
    cy.get('section#finance').find('th').eq(1).should('contain.text', 'Application submitted')
    cy.get('section#finance').find('td').eq(1).should('contain.text', '12 March 2024')
    cy.get('section#finance').find('th').eq(2).should('contain.text', 'Status')
    cy.get('section#finance').find('td').eq(2).should('contain.text', 'Pending')
  })

  it('View bank account application - updated', () => {
    cy.task('stubJohnSmithGetFinanceAndIDUpdated')
    cy.signIn()

    cy.visit('/finance-and-id/?prisonerNumber=A8731DY')

    cy.get('section#finance').find('h3').eq(0).should('contain.text', 'Finance')
    cy.get('section#finance').find('h3').eq(1).should('contain.text', 'Bank account')
    cy.get('section#finance').find('th').eq(0).should('contain.text', 'Bank')
    cy.get('section#finance').find('td').eq(0).should('contain.text', 'HSBC')
    cy.get('section#finance').find('th').eq(1).should('contain.text', 'Application submitted')
    cy.get('section#finance').find('td').eq(1).should('contain.text', '12 April 2024')
    cy.get('section#finance').find('th').eq(2).should('contain.text', 'Status')
    cy.get('section#finance').find('td').eq(2).should('contain.text', 'Account declined')
    cy.get('section#finance').find('th').eq(3).should('contain.text', 'Date Account declined')
    cy.get('section#finance').find('td').eq(3).should('contain.text', '14 April 2024')

    cy.get('details').contains('Application history').click()
    cy.get('section#finance').find('th').eq(4).should('contain.text', 'Application submitted')
    cy.get('section#finance').find('td').eq(4).should('contain.text', '12 April 2024')
    cy.get('section#finance').find('th').eq(5).should('contain.text', 'Returned incomplete')
    cy.get('section#finance').find('td').eq(5).should('contain.text', '13 April 2024')
    cy.get('section#finance').find('th').eq(6).should('contain.text', 'Application declined')
    cy.get('section#finance').find('td').eq(6).should('contain.text', '14 April 2024')
  })

  it('Delete bank account application', () => {
    cy.task('stubJohnSmithDeleteFinanceAndID')
    cy.signIn()

    cy.visit('/finance-and-id/?prisonerNumber=A8731DY')

    cy.get('button.delete-finance-button').contains('Delete application').click()
    cy.get('button').contains('Confirm delete application').click()
  })
})
