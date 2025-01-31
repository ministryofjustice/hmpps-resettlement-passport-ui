context('Status Update and add case note', () => {
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
        feature: 'myCases',
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

  function signInAndVisitStatusUpdatePage() {
    cy.signIn()

    cy.visit('/status-update?selectedPathway=accommodation&prisonerNumber=A8731DY')

    cy.get('.govuk-heading-l').should('contain.text', 'Accommodation')
    cy.get('#SUPPORT_REQUIRED').scrollIntoView()
    cy.get('#SUPPORT_REQUIRED').should('be.checked')
  }

  it('Can change status and enter a case note', () => {
    cy.task('stubJohnSmithStatusUpdateSuccess')
    signInAndVisitStatusUpdatePage()

    cy.get('#IN_PROGRESS').check()
    cy.get('#caseNoteInput_3').type('Initial enquiries have been made')

    // Submit update
    cy.get('.govuk-button').click()

    // Should go to the accommodation pathway page
    cy.url().should('contain', '/accommodation?prisonerNumber=A8731DY')

    cy.get('#pathway-status > header.app-summary-card__header > .app-summary-card__title > .govuk-tag').should(
      'contain.text',
      'In progress',
    )
  })

  it('Case note is preserved if submission fails', () => {
    cy.task('stubJohnSmithStatusUpdateFailure')

    signInAndVisitStatusUpdatePage()

    cy.get('#IN_PROGRESS').check()
    cy.get('#caseNoteInput_3').type('Long and precious case note')

    // Submit update
    cy.get('.govuk-button').click()

    cy.get('h1').should('contain.text', 'Failed to set status')

    // Go back one page and check user input is preserved
    cy.go(-1)
    cy.get('#IN_PROGRESS').should('be.checked')
    cy.get('#caseNoteInput_3').should('have.value', 'Long and precious case note')
  })
})
