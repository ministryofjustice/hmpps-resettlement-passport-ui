context('Immediate Needs Report Edit', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubJohnSmithImmediateNeedsReportEdit')
  })

  function clickContinue() {
    cy.get('.govuk-button').click()
  }

  function clickConfirm() {
    clickContinue()
  }

  function nothingShouldBeSelected() {
    cy.get("input[type='radio']").each(input => {
      cy.wrap(input).should('not.be.checked')
    })
  }

  it('Edit the education skills and work assessment', () => {
    cy.signIn()

    cy.visit('/education-skills-and-work?prisonerNumber=A8731DY')

    cy.get('#assessment-information tr')
      .eq(1)
      .children('th')
      .should('have.text', 'Does the person in prison have a job when they are released?')

    // Click edit
    cy.get('#assessment-information tr').eq(1).children('td').eq(1).click()

    // Should be on question page
    cy.get('.govuk-heading-l').should('have.text', 'Does the person in prison have a job when they are released?')
    cy.get('#HAVE_A_JOB_AFTER_RELEASE-NO').should('be.checked')
    cy.get('#HAVE_A_JOB_AFTER_RELEASE-YES').check()

    clickContinue()

    cy.get('.govuk-heading-l').should('have.text', 'Does the person in prison need help contacting the employer?')
    nothingShouldBeSelected()

    cy.get('#HELP_CONTACTING_EMPLOYER-NO').check()
    clickContinue()

    cy.get('.govuk-heading-l').should('have.text', 'Check your answers')
    clickConfirm()

    // Should be back to education skills and work record page
    cy.get('.govuk-heading-l').should('contain.text', 'Education, skills and work')
  })
})
