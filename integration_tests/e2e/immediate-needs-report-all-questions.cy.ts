context('Immediate Needs Report All Questions', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
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

  function getHeading() {
    return cy.get('.govuk-heading-l')
  }

  function getQuestionTitle() {
    return cy.get('.govuk-fieldset__legend--m')
  }

  it('Immediate Needs Report all question types happy path', () => {
    cy.task('stubJohnSmithImmediateNeedsReportAllQuestions')
    cy.signIn()

    cy.visit('/assessment-task-list/?prisonerNumber=A8731DY')
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'Complete immediate needs report')
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'Smith, John (A8731DY)')

    // Click accommodation link
    cy.get('[data-qa="a-ACCOMMODATION"]')

    getHeading().should('have.text', 'Single question on a page This is a radio Question?')
    nothingShouldBeSelected()

    // Check mandatory question error

    clickContinue()
    cy.get('.govuk-error-message').should('contain.text', 'This field is required')

    cy.get('#YES').click()
    clickContinue()

    // Check navigated to multiple questions page

    getHeading().should('have.text', 'Multiple questions on a page, radio question')
    nothingShouldBeSelected()
    getQuestionTitle().eq(0).should('have.text', 'Multiple questions on a page Radio question with regex validation?')
    getQuestionTitle().eq(1).should('have.text', 'Address question: Enter the address')
    getQuestionTitle().eq(2).should('have.text', 'Nested Radio question types?')
    getQuestionTitle().eq(3).should('have.text', 'Long Text Question')
    getQuestionTitle().eq(4).should('have.text', 'Checkbox question with exclusive options?')

    // Check each question is mandatory
    clickContinue()
    cy.get('.govuk-error-message').eq(0).should('contain.text', 'This field is required')
    cy.get('.govuk-error-message').eq(1).should('contain.text', 'This field is required')
    cy.get('.govuk-error-message').eq(2).should('contain.text', 'This field is required')
    cy.get('.govuk-error-message').eq(3).should('contain.text', 'This field is required')
    cy.get('.govuk-error-message').eq(4).should('contain.text', 'This field is required')

    // Fill in answers to each question
    cy.get('#MULTIPLE_QUESTIONS_ON_A_PAGE-YES').click()
    cy.get('#ADDRESS_QUESTION-address-line-1').type('line1')
    cy.get('#ADDRESS_QUESTION-address-town').type('town')
    cy.get('#ADDRESS_QUESTION-address-postcode').type('postcode')
    cy.get('textarea[name="freeText"]').type('Random text')
    cy.get('#NESTED_RADIO_QUESTION_TYPES-NO').click()
    cy.get('#CHECKBOX_QUESTIONS_WITH_EXCLUSIVE_OPTIONS-UNIVERSAL_CREDIT').click()
    clickContinue()

    // Check navigated to next question page
    getHeading().should('have.text', 'Divergent flow options yes for divergent flow?')
    nothingShouldBeSelected()
    clickContinue()
    cy.get('.govuk-error-message').should('contain.text', 'This field is required')
    // Check yes divergence first
    cy.get('#YES').click()
    clickContinue()
    getHeading().should('have.text', 'Divergent option route?')
    // Should go back to previous page
    cy.go('back')
    getHeading().should('have.text', 'Divergent flow options yes for divergent flow?')
    // Change answer so no follow up question
    cy.get('#NO').click()

    // Final page, mandatory and optional question
    getQuestionTitle().eq(0).should('have.text', 'Mandatory question status')
    getQuestionTitle()
      .eq(1)
      .should('have.text', 'This is an optional question to enter address select move to new address')

    clickContinue()
    cy.get('.govuk-error-message').should('contain.text', 'This field is required')

    // Only fill in the mandatory question
    cy.get('#MANDATORY_QUESTION-SUPPORT-REQUIRED').click()
    clickContinue()

    getHeading().should('have.text', 'Check your answers')

    cy.get('.govuk-summary-list__value').eq(0).should('contain.text', 'Yes')
    cy.get('.govuk-summary-list__value').eq(1).should('contain.text', 'Yes')
    cy.get('.govuk-summary-list__value').eq(2).should('contain.text', 'line1 town postcode')
    cy.get('.govuk-summary-list__value').eq(3).should('contain.text', 'Random text')
    cy.get('.govuk-summary-list__value').eq(4).should('contain.text', 'No')
    cy.get('.govuk-summary-list__value').eq(5).should('contain.text', 'Universal Credit')
    cy.get('.govuk-summary-list__value').eq(6).should('contain.text', 'No')

    clickConfirm()
    cy.get('.govuk-table__cell > .govuk-tag').each(item => {
      cy.wrap(item).should('have.text', 'Completed')
    })
    clickConfirm()
    cy.get('.govuk-panel__title').should('contain.text', 'Immediate needs report completed')
  })
})
