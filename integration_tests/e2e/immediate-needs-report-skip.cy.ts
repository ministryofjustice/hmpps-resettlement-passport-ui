context('BCST2 pre-release skip form', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  it('Skip assessment with reason', () => {
    cy.signIn()
    cy.task('stubJohnSmithSkipInsidePreReleaseWindow')
    cy.task('stubAssessmentSummary', { nomsId: 'A8731DY', status: 'NOT_STARTED', assessmentType: 'BCST2' })
    cy.task('stubAssessmentSummary', { nomsId: 'A8731DY', status: 'NOT_STARTED', assessmentType: 'RESETTLEMENT_PLAN' })
    cy.visit('/assessment-task-list?prisonerNumber=A8731DY&type=BCST2')

    // Should have been redirected to assessment skip page
    cy.url().should('include', 'assessment-skip')

    cy.get('#completedInOASys').check()
    cy.get('#supportingInfo').type('Helpful comment')
    cy.get('.govuk-button').click()

    // Should have been redirected to assessment skip page
    cy.url().should('include', '/assessment-task-list?prisonerNumber=A8731DY&type=RESETTLEMENT_PLAN')
  })

  it('Continue to BCST2', () => {
    cy.signIn()
    cy.task('stubJohnSmithSkipInsidePreReleaseWindow')
    cy.task('stubAssessmentSummary', { nomsId: 'A8731DY', status: 'NOT_STARTED', assessmentType: 'BCST2' })
    cy.task('stubAssessmentSummary', { nomsId: 'A8731DY', status: 'NOT_STARTED', assessmentType: 'RESETTLEMENT_PLAN' })
    cy.visit('/assessment-task-list?prisonerNumber=A8731DY&type=BCST2')

    // Should have been redirected to assessment skip page
    cy.url().should('include', 'assessment-skip')

    cy.get('[data-qa="completeImmediateNeedsReport"]').click()

    // Should have been redirected to assessment skip page
    cy.url().should('include', '/assessment-task-list?prisonerNumber=A8731DY&type=BCST2&force=true')
  })

  it('Shows validation error if nothing is selected', () => {
    cy.signIn()
    cy.task('stubJohnSmithSkipInsidePreReleaseWindow')
    cy.task('stubAssessmentSummary', { nomsId: 'A8731DY', status: 'NOT_STARTED', assessmentType: 'BCST2' })
    cy.task('stubAssessmentSummary', { nomsId: 'A8731DY', status: 'NOT_STARTED', assessmentType: 'RESETTLEMENT_PLAN' })
    cy.visit('/assessment-task-list?prisonerNumber=A8731DY&type=BCST2')

    // Should have been redirected to assessment skip page
    cy.url().should('include', 'assessment-skip')

    cy.get('.govuk-button').click()

    cy.get('.govuk-error-message').should('include.text', 'This field is required')
  })

  it('Redirects to pre release report if it is in progress', () => {
    cy.signIn()
    cy.task('stubJohnSmithSkipInsidePreReleaseWindow')
    cy.task('stubAssessmentSummary', { nomsId: 'A8731DY', status: 'NOT_STARTED', assessmentType: 'BCST2' })
    cy.task('stubAssessmentSummary', { nomsId: 'A8731DY', status: 'COMPLETE', assessmentType: 'RESETTLEMENT_PLAN' })
    cy.visit('/assessment-task-list?prisonerNumber=A8731DY&type=BCST2')

    // Should have been redirected to RESETTLEMENT_PLAN
    cy.url().should('include', '/assessment-task-list?prisonerNumber=A8731DY&type=RESETTLEMENT_PLAN')
  })

  it('Goes to BCST2 task list if outside of resettlement window', () => {
    cy.signIn()
    cy.task('stubJohnSmithSkipOutsidePreReleaseWindow')
    cy.task('stubAssessmentSummary', { nomsId: 'A8731DY', status: 'NOT_STARTED', assessmentType: 'BCST2' })
    cy.visit('/assessment-task-list?prisonerNumber=A8731DY&type=BCST2')

    cy.url().should('include', '/assessment-task-list?prisonerNumber=A8731DY&type=BCST2')
  })
})
