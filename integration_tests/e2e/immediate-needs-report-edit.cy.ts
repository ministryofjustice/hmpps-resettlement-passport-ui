context('Immediate Needs Report Edit', () => {
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

  it('Edit the education skills and work assessment', () => {
    cy.task('stubJohnSmithImmediateNeedsReportEdit')
    cy.signIn()

    cy.visit('/education-skills-and-work?prisonerNumber=A8731DY')

    cy.get('#assessment-information tr')
      .eq(1)
      .children('th')
      .should('contain.text', 'Does the person in prison have a job when they are released?')

    // Click edit
    cy.get('#assessment-information tr').eq(1).children('td').eq(1).click()

    // Should be on question page
    cy.get('.govuk-heading-l').should('contain.text', 'Does the person in prison have a job when they are released?')
    cy.get('#HAVE_A_JOB_AFTER_RELEASE-NO').should('be.checked')
    cy.get('#HAVE_A_JOB_AFTER_RELEASE-YES').check()

    clickContinue()

    cy.get('.govuk-heading-l').should('contain.text', 'Does the person in prison need help contacting the employer?')
    nothingShouldBeSelected()

    cy.get('#HELP_CONTACTING_EMPLOYER-NO').check()
    clickContinue()

    cy.get('.govuk-heading-l').should('contain.text', 'Check your answers')
    clickConfirm()

    // Should be back to education skills and work record page
    cy.get('.govuk-heading-l').should('contain.text', 'Education, skills and work')
  })

  it('PSFR-1656 Edit health assessment - converging on last question', () => {
    cy.task('stubEditHealthAssessmentConvergingOnLastQuestion')
    cy.signIn()

    cy.visit('/health-status?prisonerNumber=A8731DY')

    cy.get('#assessment-information tr')
      .eq(0)
      .children('th')
      .should('contain.text', 'Is the person in prison registered with a GP surgery outside of prison?')

    cy.get('#assessment-information tr')
      .eq(1)
      .children('th')
      .should('contain.text', 'Does the person in prison want to meet with a prison healthcare team?')

    cy.get('#assessment-information tr')
      .eq(2)
      .children('th')
      .should('contain.text', 'What health need is this related to?')

    // Click edit
    cy.get('#assessment-information tr').eq(1).children('td').children('a').contains('Change').click()

    // Should be on question page
    cy.get('.govuk-heading-l').should(
      'contain.text',
      'Does the person in prison want to meet with a prison healthcare team?',
    )
    cy.get('#MEET_HEALTHCARE_TEAM-YES').should('be.checked')
    cy.get('#MEET_HEALTHCARE_TEAM-NO').check()

    clickContinue()

    cy.get('.govuk-heading-l').should('contain.text', 'Check your answers')

    cy.get('.govuk-summary-list__key')
      .eq(0)
      .should('contain.text', 'Is the person in prison registered with a GP surgery outside of prison?')
    cy.get('.govuk-summary-list__value').eq(0).should('contain.text', 'Yes')

    cy.get('.govuk-summary-list__key')
      .eq(1)
      .should('contain.text', 'Does the person in prison want to meet with a prison healthcare team?')
    cy.get('.govuk-summary-list__value').eq(1).should('contain.text', 'No')

    // Should only be 2 questions answered
    cy.get('.govuk-summary-list__value').should('have.length', 2)

    clickConfirm()

    // Should be back to Health pathway page
    cy.url().should('include', '/health-status?prisonerNumber=A8731DY')
  })
})
