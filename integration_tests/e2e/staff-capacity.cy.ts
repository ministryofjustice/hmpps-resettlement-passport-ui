context('Staff Capacity', () => {
  const flagsEnabled = [
    {
      feature: 'addAppointments',
      enabled: false,
    },
    {
      feature: 'tasksView',
      enabled: true,
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
      enabled: true,
    },
    {
      feature: 'supportNeeds',
      enabled: true,
    },
  ]

  beforeEach(() => {
    cy.task('reset')
    cy.task(
      'overwriteFlags',
      JSON.stringify(
        flagsEnabled.concat([
          {
            feature: 'readOnly',
            enabled: false,
          },
        ]),
      ),
    )
    cy.task('getUserActiveCaseLoad')
    cy.task('stubSignIn')
    cy.task('stubAuthUser', { name: 'john smith', nomis: true })
    cy.task('stubGetPrisoners')
    cy.task('stubDefaultSearchResults')
    cy.task('stubGetAssignedWorkersList')
  })

  after(() => {
    cy.task('restoreFlags')
  })

  it('Shows staff capacity by default', () => {
    cy.signIn()

    cy.visit('/')
    cy.get('#tabs').should('contain.text', 'Staff capacity')

    cy.visit('/staff-capacity')
    cy.get('[data-qa="page-heading"]').should('contain.text', 'All pathways overview')
  })

  it('Shows page unavailable if read only is enabled', () => {
    cy.task(
      'overwriteFlags',
      JSON.stringify(
        flagsEnabled.concat([
          {
            feature: 'readOnly',
            enabled: true,
          },
        ]),
      ),
    )
    cy.signIn()

    cy.visit('/')
    cy.get('#tabs').should('not.exist')

    cy.request({ url: '/staff-capacity', failOnStatusCode: false }).then(resp => {
      expect(resp.status).to.eq(404)
    })

    cy.visit('/staff-capacity', { failOnStatusCode: false })
    cy.get('[data-qa="page-heading"]').should('contain.text', 'Sorry this page is unavailable')
  })
})
