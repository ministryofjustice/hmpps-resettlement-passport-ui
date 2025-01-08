import IndexPage from '../pages/index'
import Page from '../pages/page'

context('Generate PDF', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubGetPrisoners')
    cy.task('stubGetPrisonerData')
    cy.task('stubGetPrisonerImage')
    cy.task('stubGetAppointment')
    cy.task('stubGetAppointments')
    cy.task('stubGetOtp')
    cy.task('johnSmithLicenseConditions')
    cy.task('johnSmithRiskScores')
    cy.task('johnSmithRiskRosh')
    cy.task('johnSmithRiskMappa')
    cy.task('johnSmithCaseNotes')
    cy.task('johnSmithStaffContacts')
    cy.task('johnSmithAppointments')
  })

  after(() => {
    cy.task('restoreFlags')
  })

  it('Plan your future PDF should have registration code and appointments when viewAppointmentsEndUser=true', () => {
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
        enabled: true,
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
      {
        feature: 'supportNeeds',
        enabled: true,
      },
    ]
    cy.task('overwriteFlags', JSON.stringify(flagsEnabled))

    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.headerUserName().should('contain.text', 'J. Smith')
    // go to overview
    cy.visit('prisoner-overview?prisonerNumber=G4161UF')
    // click generate otp btn
    cy.get('#generate-pdf-task-btn').should('exist')

    cy.downloadFile('http://localhost:3007/print/packPdf?prisonerNumber=G4161UF', '', 'test.pdf')
    cy.task('getPdfContent', './test.pdf').should('contain', 'John Smith').and('contain', '123456')
    cy.task('getPdfContent', './test.pdf')
      .should('contain', 'Appointments')
      .and('contain', 'details of your appointments')
  })

  it('Plan your future PDF should have registration code, not appointments when viewAppointmentsEndUser=false', () => {
    const flagsDisabled = [
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
      {
        feature: 'supportNeeds',
        enabled: true,
      },
    ]
    cy.task('overwriteFlags', JSON.stringify(flagsDisabled))
    cy.signIn()
    cy.visit('prisoner-overview?prisonerNumber=G4161UF')
    cy.get('#generate-pdf-task-btn').should('exist')

    cy.downloadFile('http://localhost:3007/print/packPdf?prisonerNumber=G4161UF', '', 'test.pdf')
    cy.task('getPdfContent', './test.pdf').should('contain', 'John Smith').and('contain', '123456')
    cy.task('getPdfContent', './test.pdf')
      .should('not.contain', 'Appointments')
      .and('not.contain', 'details of your appointments')
  })
})
