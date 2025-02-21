context('Finance and ID - bank account', () => {
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

  it('Add bank account application', () => {
    cy.task('stubJohnSmithPostFinanceAndID')
    cy.signIn()

    cy.visit('/finance-and-id/?prisonerNumber=A8731DY')

    cy.get('section#finance').find('p').should('contain.text', 'No current applications')
    cy.get('a').contains('Add a bank account application').click()

    cy.get('select#bank').select('Nationwide')
    cy.get('input#applicationSubmittedDay').type('26')
    cy.get('input#applicationSubmittedMonth').type('4')
    cy.get('input#applicationSubmittedYear').type('2024')
    cy.get('.govuk-button').contains('Submit').click()

    cy.get('h2').eq(0).should('contain.text', 'Finance and ID')
    cy.get('h2').eq(1).should('contain.text', 'Check your answers before adding a bank account application')
    cy.get('.govuk-summary-list__row > dt').eq(0).should('contain.text', 'Bank')
    cy.get('.govuk-summary-list__row > dd').eq(0).should('contain.text', 'Nationwide')
    cy.get('.govuk-summary-list__row > dd').eq(1).should('contain.text', 'Change')
    cy.get('.govuk-summary-list__row > dt').eq(1).should('contain.text', 'Application submitted')
    cy.get('.govuk-summary-list__row > dd').eq(2).should('contain.text', '26 April 2024')
    cy.get('.govuk-summary-list__row > dd').eq(3).should('contain.text', 'Change')
    cy.get('.govuk-button').contains('Confirm').click()

    cy.url().should('include', '/finance-and-id/?prisonerNumber=A8731DY#finance')
  })

  it('View bank account application', () => {
    cy.task('stubJohnSmithGetFinanceAndID')
    cy.signIn()

    cy.visit('/finance-and-id/?prisonerNumber=A8731DY')

    cy.get('section#finance').find('h3').eq(0).should('contain.text', 'Finance')
    cy.get('section#finance').find('h3').eq(1).should('contain.text', 'Bank account')
    cy.get('section#finance').find('th').eq(0).should('contain.text', 'Bank')
    cy.get('section#finance').find('td').eq(0).should('contain.text', 'Barclays')
    cy.get('section#finance').find('th').eq(1).should('contain.text', 'Application submitted')
    cy.get('section#finance').find('td').eq(1).should('contain.text', '12 March 2024')
    cy.get('section#finance').find('th').eq(2).should('contain.text', 'Status')
    cy.get('section#finance').find('td').eq(2).should('contain.text', 'Pending')
  })

  it('View bank account application - updated', () => {
    cy.task('stubJohnSmithGetFinanceAndIDUpdated')
    cy.signIn()

    cy.visit('/finance-and-id/?prisonerNumber=A8731DY')

    cy.get('section#finance').find('h3').eq(0).should('contain.text', 'Finance')
    cy.get('section#finance').find('h3').eq(1).should('contain.text', 'Bank account')
    cy.get('section#finance').find('th').eq(0).should('contain.text', 'Bank')
    cy.get('section#finance').find('td').eq(0).should('contain.text', 'HSBC')
    cy.get('section#finance').find('th').eq(1).should('contain.text', 'Application submitted')
    cy.get('section#finance').find('td').eq(1).should('contain.text', '12 April 2024')
    cy.get('section#finance').find('th').eq(2).should('contain.text', 'Status')
    cy.get('section#finance').find('td').eq(2).should('contain.text', 'Account declined')
    cy.get('section#finance').find('th').eq(3).should('contain.text', 'Date Account declined')
    cy.get('section#finance').find('td').eq(3).should('contain.text', '14 April 2024')

    cy.get('details').contains('Application history').click()
    cy.get('section#finance').find('th').eq(4).should('contain.text', 'Application submitted')
    cy.get('section#finance').find('td').eq(4).should('contain.text', '12 April 2024')
    cy.get('section#finance').find('th').eq(5).should('contain.text', 'Returned incomplete')
    cy.get('section#finance').find('td').eq(5).should('contain.text', '13 April 2024')
    cy.get('section#finance').find('th').eq(6).should('contain.text', 'Application declined')
    cy.get('section#finance').find('td').eq(6).should('contain.text', '14 April 2024')
  })

  it('Delete bank account application', () => {
    cy.task('stubJohnSmithDeleteFinanceAndID')
    cy.signIn()

    cy.visit('/finance-and-id/?prisonerNumber=A8731DY')

    cy.get('button.delete-finance-button').contains('Delete application').click()
    cy.get('button').contains('Confirm delete application').click()
  })

  it('Update bank account application', () => {
    cy.task('stubJohnSmithUpdateFinanceAndID')
    cy.signIn()

    cy.visit('/finance-and-id/?prisonerNumber=A8731DY')

    cy.get('.govuk-button').contains('Update application').click()

    cy.get('select#status').select('Account opened')
    cy.get('input#accountOpenedDay').type('29')
    cy.get('input#accountOpenedMonth').type('04')
    cy.get('input#accountOpenedYear').type('2024')
    cy.get('input#added-to-items-yes').click()
    cy.get('input#day').type('30')
    cy.get('input#month').type('04')
    cy.get('input#year').type('2024')
    cy.get('.govuk-button').contains('Submit').click()

    cy.get('h2').eq(0).should('contain.text', 'Finance and ID')
    cy.get('h2').eq(1).should('contain.text', 'Check your answers before adding a bank account application')
    cy.get('.govuk-summary-list__row > dt').eq(0).should('contain.text', 'Status')
    cy.get('.govuk-summary-list__row > dd').eq(0).should('contain.text', 'Account opened')
    cy.get('.govuk-summary-list__row > dd').eq(1).should('contain.text', 'Change')
    cy.get('.govuk-summary-list__row > dt').eq(1).should('contain.text', 'Date account opened')
    cy.get('.govuk-summary-list__row > dd').eq(2).should('contain.text', '29 April 2024')
    cy.get('.govuk-summary-list__row > dd').eq(3).should('contain.text', 'Change')
    cy.get('.govuk-summary-list__row > dt').eq(2).should('contain.text', 'Added to personal items')
    cy.get('.govuk-summary-list__row > dd').eq(4).should('contain.text', '30 April 2024')
    cy.get('.govuk-summary-list__row > dd').eq(5).should('contain.text', 'Change')
    cy.get('.govuk-button').contains('Confirm').click()

    cy.url().should('include', '/finance-and-id/?prisonerNumber=A8731DY#finance')
  })

  const flowForAddDrivingLicence = () => {
    cy.get('a').contains('Add an ID application').click()

    cy.get('select#idType').select('Driving licence')
    cy.get('input#applicationSubmittedDay').type('01')
    cy.get('input#applicationSubmittedMonth').type('5')
    cy.get('input#applicationSubmittedYear').type('2024')
    cy.get('.govuk-button').contains('Submit').click()

    cy.get('h2').eq(0).should('contain.text', 'Finance and ID')
    cy.get('h2').eq(1).should('contain.text', 'Apply for a Driving licence')
    cy.get('select#driversLicenceType').select('Renewal')
    cy.get('select#driversLicenceApplicationMadeAt').select('Online')
    cy.get('input#costOfApplication').type('100')
    cy.get('.govuk-button').contains('Submit').click()

    cy.get('h2').eq(0).should('contain.text', 'Finance and ID')
    cy.get('h2').eq(1).should('contain.text', 'Check your answers before applying for a')
    cy.get('h2').eq(1).should('contain.text', 'Driving licence')
    cy.get('.govuk-summary-list__row > dt').eq(0).should('contain.text', 'Type')
    cy.get('.govuk-summary-list__row > dd').eq(0).should('contain.text', 'Driving licence')
    cy.get('.govuk-summary-list__row > dd').eq(1).should('contain.text', 'Change')
    cy.get('.govuk-summary-list__row > dt').eq(1).should('contain.text', 'Application submitted')
    cy.get('.govuk-summary-list__row > dd').eq(2).should('contain.text', '1 May 2024')
    cy.get('.govuk-summary-list__row > dd').eq(3).should('contain.text', 'Change')
    cy.get('.govuk-summary-list__row > dt').eq(2).should('contain.text', 'Driving licence type')
    cy.get('.govuk-summary-list__row > dd').eq(4).should('contain.text', 'Renewal')
    cy.get('.govuk-summary-list__row > dd').eq(5).should('contain.text', 'Change')
    cy.get('.govuk-summary-list__row > dt').eq(3).should('contain.text', 'Driving licence application location')
    cy.get('.govuk-summary-list__row > dd').eq(6).should('contain.text', 'Online')
    cy.get('.govuk-summary-list__row > dd').eq(7).should('contain.text', 'Change')
    cy.get('.govuk-summary-list__row > dt').eq(4).should('contain.text', 'Cost of application')
    cy.get('.govuk-summary-list__row > dd').eq(8).should('contain.text', '£100')
    cy.get('.govuk-summary-list__row > dd').eq(9).should('contain.text', 'Change')
    cy.get('.govuk-button').contains('Confirm').click()

    cy.url().should('include', '/finance-and-id/?prisonerNumber=A8731DY#id')
  }

  it('Add ID application', () => {
    cy.task('stubJohnSmithAddID')
    cy.signIn()

    cy.visit('/finance-and-id/?prisonerNumber=A8731DY')

    cy.get('section#id').find('p').should('contain.text', 'No current applications')
    flowForAddDrivingLicence()
  })

  it('Add 2nd ID application', () => {
    cy.task('stubJohnSmithAdd2ndID')
    cy.signIn()

    cy.visit('/finance-and-id/?prisonerNumber=A8731DY')

    cy.get('section#id').find('p').should('not.exist')
    flowForAddDrivingLicence()

    cy.get('a').contains('Add an ID application').click()

    cy.get('select#idType').select('Replacement marriage certificate')
    cy.get('input#applicationSubmittedDay').type('02')
    cy.get('input#applicationSubmittedMonth').type('05')
    cy.get('input#applicationSubmittedYear').type('2024')
    cy.get('.govuk-button').contains('Submit').click()

    cy.get('h2').eq(0).should('contain.text', 'Finance and ID')
    cy.get('h2').eq(1).should('contain.text', 'Apply for a Marriage certificate')
    cy.get('input#haveGroNo').click()
    cy.get('input#isUkNationalBornOverseasYes').click()
    cy.get('select#countryBornIn').select('Malawi')
    cy.get('input#isPriorityApplicationNo').click()
    cy.get('input#costOfApplication').type('10.50')
    cy.get('.govuk-button').contains('Submit').click()

    cy.get('h2').eq(0).should('contain.text', 'Finance and ID')
    cy.get('h2').eq(1).should('contain.text', 'Check your answers before applying for a')
    cy.get('h2').eq(1).should('contain.text', 'Marriage certificate')
    cy.get('.govuk-summary-list__row > dt').eq(0).should('contain.text', 'Type')
    cy.get('.govuk-summary-list__row > dd').eq(0).should('contain.text', 'Marriage certificate')
    cy.get('.govuk-summary-list__row > dd').eq(1).should('contain.text', 'Change')
    cy.get('.govuk-summary-list__row > dt').eq(1).should('contain.text', 'Application submitted')
    cy.get('.govuk-summary-list__row > dd').eq(2).should('contain.text', '2 May 2024')
    cy.get('.govuk-summary-list__row > dd').eq(3).should('contain.text', 'Change')
    cy.get('.govuk-summary-list__row > dt').eq(2).should('contain.text', 'Has the GRO number?')
    cy.get('.govuk-summary-list__row > dd').eq(4).should('contain.text', 'No')
    cy.get('.govuk-summary-list__row > dd').eq(5).should('contain.text', 'Change')
    cy.get('.govuk-summary-list__row > dt').eq(3).should('contain.text', 'Was a UK national born overseas?')
    cy.get('.govuk-summary-list__row > dd').eq(6).should('contain.text', 'Yes')
    cy.get('.govuk-summary-list__row > dd').eq(6).should('contain.text', '(Malawi)')
    cy.get('.govuk-summary-list__row > dd').eq(7).should('contain.text', 'Change')
    cy.get('.govuk-summary-list__row > dt').eq(4).should('contain.text', 'Priority application')
    cy.get('.govuk-summary-list__row > dd').eq(8).should('contain.text', 'No')
    cy.get('.govuk-summary-list__row > dd').eq(9).should('contain.text', 'Change')
    cy.get('.govuk-summary-list__row > dt').eq(5).should('contain.text', 'Cost of application')
    cy.get('.govuk-summary-list__row > dd').eq(10).should('contain.text', '£10.50')
    cy.get('.govuk-summary-list__row > dd').eq(11).should('contain.text', 'Change')
    cy.get('.govuk-button').contains('Confirm').click()

    cy.url().should('include', '/finance-and-id/?prisonerNumber=A8731DY#id')
  })

  it('Delete ID application', () => {
    cy.task('stubJohnSmithDeleteID')
    cy.signIn()

    cy.visit('/finance-and-id/?prisonerNumber=A8731DY')

    cy.get('button.delete-id-button').contains('Delete application').click()
    cy.get('section#id').find('button').not(':hidden').contains('Confirm delete application').click()
  })

  it('Update ID application', () => {
    cy.task('stubJohnSmithUpdateID')
    cy.signIn()

    cy.visit('/finance-and-id/?prisonerNumber=A8731DY')

    cy.get('section#id').find('.govuk-button').not(':hidden').contains('Update application').click()

    cy.get('select#updatedStatus').select('Accepted')
    cy.get('input#dateIdReceivedDay').type('02')
    cy.get('input#dateIdReceivedMonth').type('05')
    cy.get('input#dateIdReceivedYear').type('2024')
    cy.get('input#isAddedToPersonalItemsYes').click()
    cy.get('input#addedToPersonalItemsDateDay').type('02')
    cy.get('input#addedToPersonalItemsDateMonth').type('05')
    cy.get('input#addedToPersonalItemsDateYear').type('2024')
    cy.get('.govuk-button').contains('Submit').click()

    cy.get('h2').eq(0).should('contain.text', 'Finance and ID')
    cy.get('h2').eq(1).should('contain.text', 'Check your answers before completing application for a')
    cy.get('h2').eq(1).should('contain.text', 'Birth certificate')
    cy.get('.govuk-summary-list__row > dt').eq(0).should('contain.text', 'Application status')
    cy.get('.govuk-summary-list__row > dd').eq(0).should('contain.text', 'Accepted')
    cy.get('.govuk-summary-list__row > dd').eq(1).should('contain.text', 'Change')
    cy.get('.govuk-summary-list__row > dt').eq(1).should('contain.text', 'Date ID received')
    cy.get('.govuk-summary-list__row > dd').eq(2).should('contain.text', '2 May 2024')
    cy.get('.govuk-summary-list__row > dd').eq(3).should('contain.text', 'Change')
    cy.get('.govuk-summary-list__row > dt').eq(2).should('contain.text', 'Added to personal items')
    cy.get('.govuk-summary-list__row > dd').eq(4).should('contain.text', '2 May 2024')
    cy.get('.govuk-summary-list__row > dd').eq(5).should('contain.text', 'Change')
    cy.get('.govuk-button').contains('Confirm').click()

    cy.url().should('include', '/finance-and-id/?prisonerNumber=A8731DY#id')
  })
})
