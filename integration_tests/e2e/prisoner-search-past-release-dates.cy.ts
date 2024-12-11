context('Prisoner search page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubSignIn')
    cy.task('stubAuthUser', { name: 'john smith', nomis: true })
  })

  afterEach(() => {
    cy.task('restoreFlags')
  })

  it('Past release dates feature flag turned on', () => {
    cy.task('stubDefaultSearchResults')
    cy.signIn()

    cy.visit('/')

    cy.get('[data-qa="prisoner-table-row"]').should('have.length', 3)
  })

  it('Past release dates feature flag turned off', () => {
    cy.task('stubDefaultSearchResultsNoPastReleaseDates')
    cy.task(
      'overwriteFlags',
      JSON.stringify([
        {
          feature: 'addAppointments',
          enabled: false,
        },
        {
          feature: 'tasksView',
          enabled: false,
        },
        {
          feature: 'viewAppointmentsEndUser',
          enabled: false,
        },
        {
          feature: 'useNewDeliusCaseNoteFormat',
          enabled: false,
        },
        {
          feature: 'viewDocuments',
          enabled: false,
        },
        {
          feature: 'uploadDocuments',
          enabled: false,
        },
        {
          feature: 'includePastReleaseDates',
          enabled: false,
        },
        {
          feature: 'knowledgeVerification',
          enabled: false,
        },
        {
          feature: 'profileReset',
          enabled: false,
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
      ]),
    )
    cy.signIn()

    cy.visit('/')

    cy.get('[data-qa="prisoner-table-row"]').should('have.length', 2)
  })
})
