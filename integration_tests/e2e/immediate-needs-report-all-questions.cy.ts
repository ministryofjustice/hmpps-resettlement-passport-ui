context('Immediate Needs Report All Questions', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    const flagsEnabled = [
      {
        feature: 'addAppointments',
        enabled: true,
      },
      {
        feature: 'tasksView',
        enabled: true,
      },
      {
        feature: 'viewAppointmentsEndUser',
        enabled: true,
      },
      {
        feature: 'useNewDeliusCaseNoteFormat',
        enabled: true,
      },
      {
        feature: 'viewDocuments',
        enabled: true,
      },
      {
        feature: 'uploadDocuments',
        enabled: true,
      },
      {
        feature: 'includePastReleaseDates',
        enabled: true,
      },
      {
        feature: 'knowledgeVerification',
        enabled: true,
      },
      {
        feature: 'profileReset',
        enabled: true,
      },
      {
        feature: 'todoList',
        enabled: false,
      },
      {
        feature: 'useNewDpsCaseNoteFormat',
        enabled: false,
      },
      {
        feature: 'whatsNewBanner',
        enabled: false,
      },
      {
        feature: 'assignCaseTab',
        enabled: false,
      },
      {
        feature: 'supportNeeds',
        enabled: false,
      },
    ]
    cy.task('overwriteFlags', JSON.stringify(flagsEnabled))
  })

  after(() => {
    cy.task('restoreFlags')
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
  function getLabel() {
    return cy.get('.govuk-label--m')
  }

  it('Immediate Needs Report all question types happy path', () => {
    cy.task('stubJohnSmithImmediateNeedsReportAllQuestionTypes')
    cy.signIn()

    cy.visit('/assessment-task-list/?prisonerNumber=A8731DY&type=BCST2')
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'Complete immediate needs report')
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'Smith, John (A8731DY)')

    // Click accommodation link
    cy.get('[data-qa="a-ACCOMMODATION"]').click()

    getHeading().should('contain.text', 'Single question on a page This is a radio Question?')
    nothingShouldBeSelected()

    // Check mandatory question error

    clickContinue()
    cy.get('.govuk-error-message').should('contain.text', 'This field is required')

    cy.get('#SINGLE_QUESTION_ON_A_PAGE-YES').click()
    clickContinue()

    // Check navigated to multiple questions page

    getHeading().should('contain.text', 'Multiple questions on a page Radio question with regex validation?')
    nothingShouldBeSelected()
    getQuestionTitle()
      .eq(0)
      .should('contain.text', 'Multiple questions on a page Radio question with regex validation?')
    getQuestionTitle().eq(1).should('contain.text', 'Address question: Enter the address')
    getQuestionTitle().eq(2).should('contain.text', 'Nested Radio question types?')
    getLabel().should('contain.text', 'Long Text Question')
    getLabel().should('contain.text', 'Checkbox question with exclusive options?')

    // Check each question is mandatory
    clickContinue()
    cy.get('.govuk-error-message').eq(0).should('contain.text', 'This field is required')
    cy.get('.govuk-error-message').eq(1).should('contain.text', 'This field is required')
    cy.get('.govuk-error-message').eq(2).should('contain.text', 'This field is required')
    cy.get('.govuk-error-message').eq(3).should('contain.text', 'This field is required')
    cy.get('.govuk-error-message').eq(4).should('contain.text', 'This field is required')

    // Fill in answers to each question
    cy.get('#MULTIPLE_QUESTIONS_ON_A_PAGE-NO').click()
    cy.get('#ADDRESS_QUESTION-address-line-1').type('line1')
    cy.get('#ADDRESS_QUESTION-address-town').type('town')
    cy.get('#ADDRESS_QUESTION-address-postcode').type('postcode')
    cy.get('#LONG_TEXT_QUESTION').type('Random text')
    cy.get('#NESTED_RADIO_QUESTION_TYPES-NO_ANSWER').click()
    cy.get('label[for="CHECKBOX_QUESTION_WITH_EXCLUSIVE_OPTIONS-UNIVERSAL_CREDIT"]').click()
    clickContinue()

    // Check navigated to next question page
    getHeading().should('contain.text', 'Divergent flow options yes for divergent flow?')
    nothingShouldBeSelected()
    clickContinue()
    cy.get('.govuk-error-message').should('contain.text', 'This field is required')
    // Check no divergence first
    cy.get('#DIVERGENT_FLOW_OPTIONS-NO').click()
    clickContinue()
    getHeading().should('contain.text', 'Divergent option route?')
    // Should go back to previous page
    cy.go('back')
    getHeading().should('contain.text', 'Divergent flow options yes for divergent flow?')
    // Change answer to yes
    cy.get('#DIVERGENT_FLOW_OPTIONS-YES').click()
    clickContinue()
    // Answer follow up question
    cy.get('#DIVERGENT_OPTION-PHYSICAL_HEALTH').click()
    clickContinue()
    // Final page, mandatory and optional question
    getQuestionTitle().eq(0).should('contain.text', 'Mandatory question status')
    getQuestionTitle()
      .eq(1)
      .should('contain.text', 'This is an optional question to enter address select move to new address?')

    clickContinue()
    cy.get('.govuk-error-message').should('contain.text', 'This field is required')

    // Answer both questions
    cy.get('#MANDATORY_QUESTION-SUPPORT_REQUIRED').click()
    cy.get('#OPTIONAL_QUESTION-NO_ANSWER').click()
    clickContinue()

    getHeading().should('contain.text', 'Accommodation report summary')
    cy.get('#SUPPORT_NEEDS-SUPPORT_REQUIRED').click()
    cy.get('#CASE_NOTE_SUMMARY').type('Case Note')
    clickContinue()

    getHeading().should('contain.text', 'Check your answers')
    cy.get('.govuk-summary-list__value').eq(0).should('contain.text', 'Yes')
    cy.get('.govuk-summary-list__value').eq(1).should('contain.text', 'No')
    cy.get('.govuk-summary-list__value').eq(2).should('contain.text', 'line1')
    cy.get('.govuk-summary-list__value').eq(2).should('contain.text', 'town')
    cy.get('.govuk-summary-list__value').eq(2).should('contain.text', 'postcode')
    cy.get('.govuk-summary-list__value').eq(3).should('contain.text', 'No answer provided')
    cy.get('.govuk-summary-list__value').eq(4).should('contain.text', 'Random text')
    cy.get('.govuk-summary-list__value').eq(5).should('contain.text', 'Universal credit')
    cy.get('.govuk-summary-list__value').eq(6).should('contain.text', 'Yes')
    cy.get('.govuk-summary-list__value').eq(7).should('contain.text', 'Physical health')
    cy.get('.govuk-summary-list__value').eq(8).should('contain.text', 'Support required')
    cy.get('.govuk-summary-list__value').eq(9).should('contain.text', 'No answer provided')

    clickConfirm()
    cy.url().should('contain', '/assessment-task-list?prisonerNumber=A8731DY')
  })

  it('Immediate Needs Report all question types happy path submitted once', () => {
    cy.task('stubJohnSmithImmediateNeedsReportAllQuestionTypesCompleted')
    cy.signIn()

    cy.visit('/accommodation?prisonerNumber=A8731DY')
    cy.get('#assessment-information tr').eq(0).children('td').eq(1).find('a').click()

    getHeading().should('contain.text', 'Single question on a page This is a radio Question?')
    cy.get('#SINGLE_QUESTION_ON_A_PAGE-NO').should('be.checked')

    cy.get('#SINGLE_QUESTION_ON_A_PAGE-YES').click()
    clickContinue()

    // Check navigated to multiple questions page

    getHeading().should('contain.text', 'Multiple questions on a page Radio question with regex validation?')
    getQuestionTitle()
      .eq(0)
      .should('contain.text', 'Multiple questions on a page Radio question with regex validation?')
    cy.get('#MULTIPLE_QUESTIONS_ON_A_PAGE-YES').should('be.checked')
    cy.get('#REGEX_NUMBER').should('contain.value', '4')
    getQuestionTitle().eq(1).should('contain.text', 'Address question: Enter the address')
    cy.get('#ADDRESS_QUESTION-address-line-1').should('contain.value', '123 Main Street')
    cy.get('#ADDRESS_QUESTION-address-postcode').should('contain.value', 'AB1 2BC')
    getQuestionTitle().eq(2).should('contain.text', 'Nested Radio question types?')
    cy.get('#NESTED_RADIO_QUESTION_TYPES-YES').should('be.checked')
    getLabel().should('contain.text', 'Short text nested')
    cy.get('#SHORT_TEXT_NESTED').should('contain.value', 'Some short text')
    getQuestionTitle().eq(3).should('contain.text', 'Enter the address nested')
    cy.get('#ADDRESS_NESTED-address-line-1').should('contain.value', '1 Main Street')
    cy.get('#ADDRESS_NESTED-address-postcode').should('contain.value', 'BC1 2DE')
    getLabel().should('contain.text', 'Long text nested')
    cy.get('#LONG_TEXT_NESTED').should('contain.value', 'Some long text')
    getLabel().should('contain.text', 'Long Text Question')
    cy.get('#LONG_TEXT_QUESTION').should('contain.value', 'Initial text')
    getLabel().should('contain.text', 'Checkbox question with exclusive options?')
    cy.get('#CHECKBOX_QUESTION_WITH_EXCLUSIVE_OPTIONS-NO_BENEFITS').should('be.checked')

    // Fill in answers to each question
    cy.get('#MULTIPLE_QUESTIONS_ON_A_PAGE-NO').click()
    cy.get('#ADDRESS_QUESTION-address-line-1').type('line1')
    cy.get('#ADDRESS_QUESTION-address-town').type('town')
    cy.get('#ADDRESS_QUESTION-address-postcode').type('postcode')
    cy.get('#LONG_TEXT_QUESTION').type('Random text')
    cy.get('#NESTED_RADIO_QUESTION_TYPES-NO_ANSWER').click()
    cy.get('#CHECKBOX_QUESTION_WITH_EXCLUSIVE_OPTIONS-UNIVERSAL_CREDIT').click()
    clickContinue()

    // Check navigated to next question page
    getHeading().should('contain.text', 'Divergent flow options yes for divergent flow?')

    cy.get('#DIVERGENT_FLOW_OPTIONS-YES').should('be.checked')
    clickContinue()

    cy.get('#DIVERGENT_OPTION-NO_ANSWER').should('be.checked')

    cy.get('#DIVERGENT_OPTION-PHYSICAL_HEALTH').click()
    clickContinue()
    // Final page, mandatory and optional question
    getQuestionTitle().eq(0).should('contain.text', 'Mandatory question status')
    getQuestionTitle()
      .eq(1)
      .should('contain.text', 'This is an optional question to enter address select move to new address?')

    cy.get('#MANDATORY_QUESTION-SUPPORT_NOT_REQUIRED').should('be.checked')
    cy.get('#OPTIONAL_QUESTION-MOVE_TO_NEW_ADDRESS').should('be.checked')
    cy.get('#WHERE_WILL_THEY_LIVE_ADDRESS_MOVE_TO_NEW_ADDRESS-address-line-1').should('contain.value', '1 Main Street')
    cy.get('#WHERE_WILL_THEY_LIVE_ADDRESS_MOVE_TO_NEW_ADDRESS-address-postcode').should('contain.value', 'BC1 2DE')

    // Answer both questions
    cy.get('#MANDATORY_QUESTION-SUPPORT_REQUIRED').click()
    cy.get('#OPTIONAL_QUESTION-NO_ANSWER').click()
    clickContinue()

    getHeading().should('contain.text', 'Accommodation report summary')
    cy.get('#SUPPORT_NEEDS-SUPPORT_REQUIRED').click()
    cy.get('#CASE_NOTE_SUMMARY').type('Case Note')
    clickContinue()

    getHeading().should('contain.text', 'Check your answers')
    cy.get('.govuk-summary-list__value').eq(0).should('contain.text', 'Yes')
    cy.get('.govuk-summary-list__value').eq(1).should('contain.text', 'No')
    cy.get('.govuk-summary-list__value').eq(2).should('contain.text', 'line1')
    cy.get('.govuk-summary-list__value').eq(2).should('contain.text', 'town')
    cy.get('.govuk-summary-list__value').eq(2).should('contain.text', 'postcode')
    cy.get('.govuk-summary-list__value').eq(3).should('contain.text', 'No answer provided')
    cy.get('.govuk-summary-list__value').eq(4).should('contain.text', 'Random text')
    cy.get('.govuk-summary-list__value').eq(5).should('contain.text', 'Universal credit')
    cy.get('.govuk-summary-list__value').eq(6).should('contain.text', 'Yes')
    cy.get('.govuk-summary-list__value').eq(7).should('contain.text', 'Physical health')
    cy.get('.govuk-summary-list__value').eq(8).should('contain.text', 'Support required')
    cy.get('.govuk-summary-list__value').eq(9).should('contain.text', 'No answer provided')

    clickConfirm()
    cy.url().should('contain', '/accommodation?prisonerNumber=A8731DY')
  })
})
