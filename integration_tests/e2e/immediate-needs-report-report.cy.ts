function assertShouldNotHaveAddressAnswer() {
  cy.get('.govuk-summary-list__key').should(itemKeys => {
    expect(itemKeys.get().map(e => e.textContent)).to.not.contain('Enter the address')
  })
}

context('Immediate Needs Report', () => {
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

  function clickSubmit() {
    clickContinue()
  }

  function nothingShouldBeSelected() {
    cy.get("input[type='radio']").each(input => {
      cy.wrap(input).should('not.be.checked')
    })
  }

  function noCheckboxesShouldBeSelected() {
    cy.get("input[type='checkbox']").each(input => {
      cy.wrap(input).should('not.be.checked')
    })
  }

  function getHeading() {
    return cy.get('.govuk-heading-l')
  }

  it('Prisoner Overview should have Immediate Needs Report Banner', () => {
    cy.task('stubJohnSmithImmediateNeedsReportHealth')
    cy.signIn()

    cy.visit('/prisoner-overview?prisonerNumber=A8731DY')

    cy.get('.govuk-notification-banner__heading').should(
      'contain.text',
      'John Smith does not have a completed immediate needs report.',
    )
  })

  it('Immediate Needs Report Health pathway scenario', () => {
    cy.task('stubJohnSmithImmediateNeedsReportHealth')
    cy.signIn()

    cy.visit('/assessment-task-list/?prisonerNumber=A8731DY&type=BCST2')
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'Complete immediate needs report')
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'Smith, John (A8731DY)')

    // // Status buttons
    cy.get('.govuk-table__cell > .govuk-tag').each((item, index) => {
      if (index !== 6) {
        cy.wrap(item).should('have.text', 'Completed')
      } else {
        cy.wrap(item).should('have.text', 'Incomplete')
      }
    })

    // Click Health link
    cy.get('[data-qa="a-HEALTH"]').click()

    getHeading().should('have.text', 'Is the person in prison registered with a GP surgery outside of prison?')
    nothingShouldBeSelected()

    // Check validation
    clickContinue()
    cy.get('.govuk-error-message').eq(0).should('contain.text', 'This field is required')
    cy.get('.govuk-error-message').eq(1).should('contain.text', 'This field is required')

    cy.get('#REGISTERED_WITH_GP-YES').click()

    cy.get('#GP_PHONE_NUMBER').type('not a phone number')
    clickContinue()

    cy.get('.govuk-error-message').should('contain.text', 'Must be numerical')

    cy.get('#GP_PHONE_NUMBER').clear()
    cy.get('#GP_PHONE_NUMBER').type('01234567890')
    clickContinue()

    getHeading().should('have.text', 'Does the person in prison want to meet with a prison healthcare team?')
    nothingShouldBeSelected()
    cy.get('#MEET_HEALTHCARE_TEAM-NO').click()

    clickContinue()

    getHeading().should('have.text', 'Support needs')
    noCheckboxesShouldBeSelected()

    // Check mandatory validation
    clickContinue()
    cy.get('.govuk-error-message').should('contain.text', 'This field is required')

    cy.get('#NEED_2').click()

    clickContinue()

    getHeading().should('have.text', 'Health report summary')

    nothingShouldBeSelected()
    cy.get('#SUPPORT_NEEDS-SUPPORT_NOT_REQUIRED').click()
    cy.get('#CASE_NOTE_SUMMARY').type('Case Note')

    clickContinue()

    getHeading().should('have.text', 'Check your answers')

    cy.get('.govuk-summary-list__value').eq(0).should('contain.text', 'Yes')
    cy.get('.govuk-summary-list__value').eq(1).should('contain.text', '01234567890')
    cy.get('.govuk-summary-list__value').eq(2).should('contain.text', 'No')
    cy.get('.govuk-summary-list__value').eq(3).should('contain.text', 'Need 2')
    cy.get('.govuk-summary-list__value').eq(4).should('contain.text', 'Support not required')
    cy.get('.govuk-summary-list__value').eq(5).should('contain.text', 'Case Note')
    clickConfirm()

    cy.get('.govuk-table__cell > .govuk-tag').each(item => {
      cy.wrap(item).should('have.text', 'Completed')
    })
    clickSubmit()
    cy.get('.govuk-panel__title').should('contain.text', 'Immediate needs report completed')
  })

  it('Immediate Needs Report Back button and divergent paths scenario', () => {
    cy.task('stubJohnSmithImmediateNeedsReportAccommodation')
    cy.signIn()

    cy.visit('/assessment-task-list/?prisonerNumber=A8731DY&type=BCST2')
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'Complete immediate needs report')
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'Smith, John (A8731DY)')

    // Click Accommodation link
    cy.get('[data-qa="a-ACCOMMODATION"]').click()

    getHeading().should('have.text', 'Where did the person in prison live before custody?')
    cy.get('#WHERE_DID_THEY_LIVE-PRIVATE_RENTED_HOUSING').check()
    clickContinue()

    cy.get('.govuk-fieldset__legend').should('have.text', 'Enter the address')
    cy.get('#WHERE_DID_THEY_LIVE_ADDRESS-address-line-1').type('line1')
    cy.get('#WHERE_DID_THEY_LIVE_ADDRESS-address-town').type('town')
    cy.get('#WHERE_DID_THEY_LIVE_ADDRESS-address-postcode').type('postcode')
    clickContinue()

    getHeading().should(
      'have.text',
      'Does the person in prison or their family need help to keep their home while they are in prison?',
    )

    // Go back twice to the where did they live question
    cy.go('back')
    cy.get('.govuk-fieldset__legend').should('have.text', 'Enter the address')
    cy.go('back')
    getHeading().should('have.text', 'Where did the person in prison live before custody?')
    cy.get('#WHERE_DID_THEY_LIVE-PRIVATE_RENTED_HOUSING').should('be.checked')

    // Change answer to go down a different path
    cy.get('#WHERE_DID_THEY_LIVE-NO_PERMANENT_OR_FIXED').check()
    clickContinue()

    getHeading().should('have.text', 'Where will the person in prison live when they are released?')
    cy.get('#WHERE_WILL_THEY_LIVE_2-DOES_NOT_HAVE_ANYWHERE').check()
    clickContinue()

    getHeading().should('have.text', 'Accommodation report summary')
    cy.get('#SUPPORT_NEEDS-SUPPORT_REQUIRED').check()
    cy.get('#CASE_NOTE_SUMMARY').type('Needs somewhere to stay')
    clickContinue()

    getHeading().should('have.text', 'Check your answers')
    assertShouldNotHaveAddressAnswer()

    clickConfirm()
    cy.url().should('contain', '/assessment-task-list?prisonerNumber=A8731DY')
  })

  it('Immediate Needs Report Divergent paths scenario with edit', () => {
    cy.task('stubJohnSmithImmediateNeedsReportAccommodation')
    cy.signIn()

    cy.visit('/assessment-task-list/?prisonerNumber=A8731DY')
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'Complete immediate needs report')
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'Smith, John (A8731DY)')

    // Click Accommodation link
    cy.get('[data-qa="a-ACCOMMODATION"]').click()

    getHeading().should('have.text', 'Where did the person in prison live before custody?')
    cy.get('#WHERE_DID_THEY_LIVE-PRIVATE_RENTED_HOUSING').check()
    clickContinue()

    cy.get('.govuk-fieldset__legend').should('have.text', 'Enter the address')
    cy.get('#WHERE_DID_THEY_LIVE_ADDRESS-address-line-1').type('line1')
    cy.get('#WHERE_DID_THEY_LIVE_ADDRESS-address-town').type('town')
    cy.get('#WHERE_DID_THEY_LIVE_ADDRESS-address-postcode').type('postcode')
    clickContinue()

    getHeading().should(
      'have.text',
      'Does the person in prison or their family need help to keep their home while they are in prison?',
    )

    cy.get('#HELP_TO_KEEP_HOME-NO').check()
    clickContinue()

    getHeading().should('have.text', 'Accommodation report summary')
    cy.get('#SUPPORT_NEEDS-SUPPORT_NOT_REQUIRED').check()
    cy.get('#CASE_NOTE_SUMMARY').type('No support required')
    clickContinue()

    getHeading().should('have.text', 'Check your answers')
    // Click change on the first row - Where did the person in prison live before custody?
    cy.get('.govuk-summary-list__actions').eq(0).children('a').click()

    getHeading().should('have.text', 'Where did the person in prison live before custody?')
    cy.get('#WHERE_DID_THEY_LIVE-PRIVATE_RENTED_HOUSING').should('be.checked')
    cy.get('#WHERE_DID_THEY_LIVE-NO_PERMANENT_OR_FIXED').check()
    clickContinue()

    // PSFR-1312 Clicking back at this point should take you to 'Where did the person in prison live before custody?'
    // NOT the check your answers page
    cy.go(-1)
    getHeading().should('have.text', 'Where did the person in prison live before custody?')
    cy.get('#WHERE_DID_THEY_LIVE-NO_PERMANENT_OR_FIXED').should('be.checked')
    clickContinue()

    getHeading().should('have.text', 'Where will the person in prison live when they are released?')
    cy.get('#WHERE_WILL_THEY_LIVE_2-DOES_NOT_HAVE_ANYWHERE').check()
    clickContinue()

    assertShouldNotHaveAddressAnswer()
    clickConfirm()

    cy.url().should('contain', '/assessment-task-list?prisonerNumber=A8731DY')
  })

  it('should be able to resume entering immediate needs report', () => {
    cy.task('stubJohnSmithImmediateNeedsReportAccommodation')
    cy.signIn()

    cy.visit('/assessment-task-list/?prisonerNumber=A8731DY')
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'Complete immediate needs report')
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'Smith, John (A8731DY)')

    // Click Accommodation link
    cy.get('[data-qa="a-ACCOMMODATION"]').click()

    getHeading().should('have.text', 'Where did the person in prison live before custody?')
    cy.get('#WHERE_DID_THEY_LIVE-NO_PERMANENT_OR_FIXED').check()
    clickContinue()

    getHeading().should('have.text', 'Where will the person in prison live when they are released?')

    // Go back to the task list page
    cy.visit('/assessment-task-list/?prisonerNumber=A8731DY')
    // Go back to accommodation
    cy.get('[data-qa="a-ACCOMMODATION"]').click()

    getHeading().should('have.text', 'Where will the person in prison live when they are released?')
    cy.get('#WHERE_WILL_THEY_LIVE_2-DOES_NOT_HAVE_ANYWHERE').check()
    clickContinue()

    getHeading().should('have.text', 'Accommodation report summary')
    cy.get('#SUPPORT_NEEDS-SUPPORT_REQUIRED').check()
    cy.get('#CASE_NOTE_SUMMARY').type('Needs somewhere to stay')
    clickContinue()

    getHeading().should('have.text', 'Check your answers')

    clickConfirm()
    cy.url().should('contain', '/assessment-task-list?prisonerNumber=A8731DY')
  })

  it('Immediate Needs Report Health pathway scenario without a version', () => {
    cy.task('stubJohnSmithImmediateNeedsReportHealth')
    cy.task('initRedisCacheForNullExistingAssessment')
    cy.signIn()

    cy.visit('/assessment-task-list/?prisonerNumber=A8731DY')
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'Complete immediate needs report')
    cy.get('.govuk-grid-column-two-thirds > h1').should('contain.text', 'Smith, John (A8731DY)')

    // // Status buttons
    cy.get('.govuk-table__cell > .govuk-tag').each((item, index) => {
      if (index !== 6) {
        cy.wrap(item).should('have.text', 'Completed')
      } else {
        cy.wrap(item).should('have.text', 'Incomplete')
      }
    })

    // Click Health link
    cy.get('[data-qa="a-HEALTH"]').click()

    getHeading().should('have.text', 'Does the person in prison want to meet with a prison healthcare team?')
    cy.get('.govuk-caption-l').should('have.text', 'Smith, John (A8731DY)')
    nothingShouldBeSelected()
    cy.get('#MEET_HEALTHCARE_TEAM-NO').click()

    clickContinue()

    getHeading().should('have.text', 'Support needs')
    cy.get('.govuk-caption-l').should('have.text', 'Smith, John (A8731DY)')
    noCheckboxesShouldBeSelected()

    // Check mandatory validation
    clickContinue()
    cy.get('.govuk-error-message').should('contain.text', 'This field is required')

    cy.get('#NEED_2').click()

    clickContinue()

    getHeading().should('have.text', 'Health report summary')

    nothingShouldBeSelected()
    cy.get('#SUPPORT_NEEDS-SUPPORT_NOT_REQUIRED').click()
    cy.get('#CASE_NOTE_SUMMARY').type('Case Note')

    clickContinue()

    getHeading().should('have.text', 'Check your answers')
    cy.get('.govuk-caption-l').should('have.text', 'Smith, John (A8731DY)')

    cy.get('.govuk-summary-list__value').eq(0).should('contain.text', 'Yes')
    cy.get('.govuk-summary-list__value').eq(1).should('contain.text', '01234567890')
    cy.get('.govuk-summary-list__value').eq(2).should('contain.text', 'No')
    cy.get('.govuk-summary-list__value').eq(3).should('contain.text', 'Need 2')
    cy.get('.govuk-summary-list__value').eq(4).should('contain.text', 'Support not required')
    cy.get('.govuk-summary-list__value').eq(5).should('contain.text', 'Case Note')
    clickConfirm()

    cy.get('.govuk-table__cell > .govuk-tag').each(item => {
      cy.wrap(item).should('have.text', 'Completed')
    })
    clickSubmit()
    cy.get('.govuk-panel__title').should('contain.text', 'Immediate needs report completed')
  })

  it('PSFR-1629 Validation errors and back button scenario', () => {
    cy.task('stubJohnSmithImmediateNeedsReportHealthFreeText')
    cy.signIn()

    cy.visit('/assessment-task-list/?prisonerNumber=A8731DY')

    // Click Health link
    cy.get('[data-qa="a-HEALTH"]').click()

    getHeading().should('have.text', 'Is the person in prison registered with a GP surgery outside of prison?')
    nothingShouldBeSelected()

    cy.get('#REGISTERED_WITH_GP-YES').click()

    // Click continue to get missing mandatory validation
    clickContinue()
    cy.get('.govuk-error-message').eq(0).should('contain.text', 'This field is required')

    // Click back twice to go back to task list page
    cy.go(-2)

    // Click Health link
    cy.get('[data-qa="a-HEALTH"]').click()

    // Should go to page 1
    getHeading().should('have.text', 'Is the person in prison registered with a GP surgery outside of prison?')
    cy.get('#REGISTERED_WITH_GP-YES').should('be.checked')
    cy.get('#GP_PHONE_NUMBER').type('01234567890')
    clickContinue()

    getHeading().should('have.text', 'Does the person in prison want to meet with a prison healthcare team?')
    nothingShouldBeSelected()
    cy.get('#MEET_HEALTHCARE_TEAM-NO').click()

    clickContinue()

    getHeading().should('have.text', 'Support needs')
    noCheckboxesShouldBeSelected()
    cy.get('#NEED_2').click()

    // Verify textarea is toggled and populate input field
    cy.get('textarea[name="freeText"]').should('not.be.visible')
    cy.get('input[type="checkbox"][value="OTHER_SUPPORT_NEEDS"]').click()
    cy.get('textarea[name="freeText"]').should('be.visible')

    clickContinue()
    cy.get('.govuk-error-message').eq(0).should('contain.text', 'This field is required')

    cy.get('textarea[name="freeText"]').type('Random text')

    clickContinue()

    getHeading().should('have.text', 'Health report summary')

    nothingShouldBeSelected()
    cy.get('#SUPPORT_NEEDS-SUPPORT_NOT_REQUIRED').click()
    cy.get('#CASE_NOTE_SUMMARY').type('Case Note')

    clickContinue()

    getHeading().should('have.text', 'Check your answers')

    cy.get('.govuk-summary-list__value').eq(0).should('contain.text', 'Yes')
    cy.get('.govuk-summary-list__value').eq(1).should('contain.text', '01234567890')
    cy.get('.govuk-summary-list__value').eq(2).should('contain.text', 'No')
    cy.get('.govuk-summary-list__value').eq(3).should('contain.text', 'Need 2')
    cy.get('.govuk-summary-list__value').eq(3).should('contain.text', 'Random text')
    cy.get('.govuk-summary-list__value').eq(4).should('contain.text', 'Support not required')
    cy.get('.govuk-summary-list__value').eq(5).should('contain.text', 'Case Note')
    clickConfirm()

    cy.get('.govuk-table__cell > .govuk-tag').each(item => {
      cy.wrap(item).should('have.text', 'Completed')
    })
    clickSubmit()
    cy.get('.govuk-panel__title').should('contain.text', 'Immediate needs report completed')
  })
})
