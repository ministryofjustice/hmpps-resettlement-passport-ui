context('Check-box', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  it('Check display of Checkbox subTitle', () => {
    cy.task('stubJohnSmithCheckBox')
    cy.signIn()

    // Intercept the API call and log the response
    cy.intercept(
      'GET',
      '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/WHERE_DID_THEY_LIVE?assessmentType=RESETTLEMENT_PLAN',
      req => {
        req.continue(res => {
          console.log(res.body)
        })
      },
    )

    cy.visit('/assessment-task-list/?prisonerNumber=A8731DY&type=RESETTLEMENT_PLAN')

    // Click Accommodation link
    cy.get('[data-qa="a-ACCOMMODATION"]').click()

    // Should be on the Accommodation pathway page
    cy.get('.govuk-heading-l').should('have.text', 'Where did the person in prison live before custody?')
    cy.get('#waste-hint').should('have.text', 'New subTitle text here')
  })
})
