export const getTodaysDate = () => {
  const date = new Date()
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
  return date.toLocaleDateString('en-GB', options)
}

context('ResetProfile', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    const flagsEnabled = [
      {
        feature: 'profileReset',
        enabled: true,
      },
    ]
    cy.task('overwriteFlags', JSON.stringify(flagsEnabled))
  })

  after(() => {
    cy.task('restoreFlags')
  })

  it('Navigate to reset profile form page from overview page', () => {
    cy.task('stubJohnSmithProfileReset')
    cy.signIn()

    cy.visit('/prisoner-overview/?prisonerNumber=A8731DY')
    cy.get('a#reset-profile-btn').should('contain.text', 'Reset reports and statuses')
    cy.get('a#reset-profile-btn').click()
    cy.url().should('include', '/resetProfile?prisonerNumber=A8731DY')
    cy.get('h1').should('contain.text', 'Reset reports and statuses')
    cy.get('a#reset-profile-continue-btn').should('contain.text', 'Continue')
    cy.get('a#reset-profile-continue-btn').click()
    cy.url().should('include', '/resetProfile/reason?prisonerNumber=A8731DY')
    cy.get('h1').should('contain.text', 'Why are you resetting the reports and statuses?')
  })

  it('Reset profile happy path', () => {
    cy.task('stubJohnSmithProfileReset')
    cy.signIn()

    cy.visit('/resetProfile/reason?prisonerNumber=A8731DY')
    cy.get('h1').should('contain.text', 'Why are you resetting the reports and statuses?')
    cy.get('#additionalDetails').should('not.be.visible')
    cy.get('#OTHER').click()
    cy.get('#additionalDetails').should('be.visible')
    cy.get('#additionalDetails').type('Some other reason for resetting profile')
    cy.get('.govuk-button').should('contain.text', 'Continue').click()
    cy.get('.govuk-panel__title').should('contain.text', 'Reports and statuses reset')

    const todaysDate = getTodaysDate()
    cy.get('.govuk-panel__body').should('contain.text', `Reset by: John Smith on ${todaysDate}`)
    cy.get('.govuk-panel__body').should('contain.text', 'Reason for reset: Other')
  })

  it('Reset profile form validation errors', () => {
    cy.task('stubJohnSmithProfileReset')
    cy.signIn()

    cy.visit('/resetProfile/reason?prisonerNumber=A8731DY')
    cy.get('h1').should('contain.text', 'Why are you resetting the reports and statuses?')

    // validate mandatory answer
    cy.get('.govuk-button').should('contain.text', 'Continue').click()
    cy.get('.govuk-error-message').should(
      'contain.text',
      'Select a reason why you are resetting the reports and statuses',
    )

    // validate mandatory other text field
    cy.get('#OTHER').click()
    cy.get('.govuk-button').should('contain.text', 'Continue').click()
    cy.url().should('include', '/resetProfile/reason')
    cy.get('.govuk-error-message').should('contain.text', 'Other reason cannot be blank')

    // check radio button is pre-selected
    cy.get('#OTHER').should('be.checked')
    const MORE_THAN_3000_CHARACTER_STRING =
      'Lorem Ipsum hasbeen the industrys standard dummy text eerincethe 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It rem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 15000sLorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It rem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 15000s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 15000s'

    // validate maximum characters
    cy.get('#OTHER').click()
    cy.url().should('include', '/resetProfile/reason')
    cy.get('#additionalDetails').type(MORE_THAN_3000_CHARACTER_STRING, { delay: 0 })
    cy.get('.govuk-button').should('contain.text', 'Continue').click()
    cy.get('.govuk-error-message').should('contain.text', 'This field must be 3,000 characters or less')

    // check textarea contains current input
    cy.get('#additionalDetails').should('contain.text', MORE_THAN_3000_CHARACTER_STRING)

    cy.get('#additionalDetails').clear()
    cy.get('#additionalDetails').type('Some other reason for resetting profile')
    cy.get('.govuk-button').should('contain.text', 'Continue').click()
    cy.get('.govuk-panel__title').should('contain.text', 'Reports and statuses reset')
  })
})
