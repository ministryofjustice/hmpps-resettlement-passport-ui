context('Support Needs', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubJohnSmithGetAccommodation')
  })

  it('Accommodation pathway page should show no support needs set', () => {
    cy.task('stubJohnSmithGetAccommodationNoSupportNeeds')
    cy.signIn()

    cy.visit('/accommodation/?prisonerNumber=A8731DY')

    cy.get('.app-summary-card__title').should('contain.text', 'Support needs')

    cy.get('.govuk-summary-card__actions').should('have.attr', 'href')
    cy.get('.govuk-summary-card__actions').should('contain.text', 'Add a support need')

    cy.get('.app-summary-card__body > p').should('contain.text', 'Support needs not set')
  })

  it('Adding an Accommodation support need', () => {
    cy.task('stubJohnSmithGetAccommodationNoSupportNeeds')
    cy.signIn()

    cy.visit('/accommodation/?prisonerNumber=A8731DY')

    // Click 'Add Support Need'
    cy.get('.govuk-summary-card__actions').click()

    cy.get('.govuk-grid-column-full > h1').should('contain.text', 'Add accommodation support needs')

    // Click to expand 'support needs already selected - verify 'No support needs selected'
    cy.get('.govuk-details__summary').click()
    cy.get('.govuk-details__text > p').should('contain.text', 'No support needs selected')

    // Fill in support needs form
    // Tick 'End a tenancy'
    cy.get('.govuk-checkboxes__input[name="support-need-option-Accommodation before custody"]').first().check()
    // Tick 'No new accommodation support needs identified'
    cy.get('.govuk-checkboxes__input[name="support-need-option-Moving to new accommodation"]').eq(3).check()
    // Tick 'Set up payment for rent arrears'
    cy.get('.govuk-checkboxes__input[name="support-need-option-Accommodation related debt and arrears"]')
      .first()
      .check()
    // Tick 'Other' and fill in custom support need.
    cy.get('.govuk-checkboxes__input[name="support-need-option-Accommodation related debt and arrears"]').eq(2).check()
    cy.get('.govuk-input').eq(2).type('Custom accommodation support need')

    // Click Continue
    cy.get('.govuk-button[type="submit"]').click()
    cy.get('.govuk-grid-column-three-quarters > h1').should('contain.text', 'End a tenancy')

    // Test back button
    cy.get('.govuk-back-link').click()
    cy.get('.govuk-grid-column-full > h1').should('contain.text', 'Add accommodation support needs')
    cy.get('.govuk-button[type="submit"]').click()

    // Fill in 'End a tenancy' support need
    cy.get('[id="status"]').check()
    cy.get('[id="responsibleStaff"]').check()
    cy.get('.govuk-textarea[id="updateText"]').type('Some additional details')
    cy.get('.govuk-button[type="submit"]').first().click()

    // Remove support need 'Set up payment for rent arrears'
    cy.get('.ghost-button').first().click()
    cy.get('.confirm-remove-support-need .govuk-button[type="submit"]').click()

    // Fill in 'Custom accommodation support need'
    cy.get('.govuk-grid-column-three-quarters > h1').should('contain.text', 'Custom accommodation support need')
    cy.get('[id="status-2"]').check()
    cy.get('[id="responsibleStaff-2"]').check()
    cy.get('.govuk-button[type="submit"]').first().click()

    // Submit 'Check your answers' page
    cy.get('.govuk-grid-column-two-thirds-from-desktop > h1').should('contain.text', 'Check your answers')
    cy.get('.govuk-grid-column-two-thirds-from-desktop > h2').should('contain.text', 'Accommodation support needs')
    cy.get('.govuk-button[type="submit"]').first().click()

    // Should be back to the accommodation overview page
    cy.get('.govuk-grid-column-two-thirds > h2').should('contain.text', 'Accommodation')
    cy.get('.app-summary-card__title').should('contain.text', 'Support needs')
  })

  it('Editing an existing Accommodation support need', () => {
    cy.task('stubJohnSmithGetAccommodationWithSupportNeeds')

    cy.signIn()

    cy.visit('/accommodation/?prisonerNumber=A8731DY')

    cy.get('.app-summary-card__title').should('contain.text', 'Support needs')

    cy.get('.govuk-summary-card__actions').should('have.attr', 'href')
    cy.get('.govuk-summary-card__actions').should('contain.text', 'Add a support need')

    // Click to edit 'End a tenancy' support need
    cy.get('tr td:first > a').should('have.attr', 'href')
    cy.get('tr td:first > a').should('contain.text', 'End a tenancy').click()

    // Update 'End a tenancy' fields
    cy.get('.govuk-heading-l').should('contain.text', 'End a tenancy')
    cy.get('[id="updateStatus-2"]').check()
    cy.get('[id="responsibleStaff-2"]').check()
    cy.get('.govuk-textarea[id="additionalDetails"]').type('Update')
    cy.get('.govuk-button[type="submit"]').first().click()

    // back to the accommodation overview page
    cy.get('.app-summary-card__title').should('contain.text', 'Support needs')
  })

  it('Viewing Accommodation support needs', () => {
    // Initialise support needs
    cy.task('stubJohnSmithGetAccommodationWithSupportNeeds')

    cy.signIn()

    cy.visit('/accommodation/?prisonerNumber=A8731DY')

    cy.get('.app-summary-card__title').should('contain.text', 'Support needs')

    cy.get('[id="support-needs-updates"]').within(() => {
      cy.get('.app-summary-card__title').should('contain.text', 'Accommodation updates')

      // Verify pagination
      cy.get('.govuk-pagination__list').as('Pagination')

      // Pagination shows 1 to 10 of 418 results
      verifyPaginationPageOne()
      verifyPageSelected(1)

      // Click on Page '2'
      cy.get('@Pagination').within(() => {
        cy.get('.govuk-pagination__item').eq(1).click()
      })
      verifyPageSelected(2)
      verifyPaginationPageTwo()
      verifyPageTwo()

      // Click on 'Previous'
      cy.get('.govuk-pagination__prev').click()
      verifyPageSelected(1)
      verifyPaginationPageOne()
      verifyPageOne()

      // Click on 'Next'
      cy.get('.govuk-pagination__next').click()
      verifyPageSelected(2)
      verifyPaginationPageTwo()
      verifyPageTwo()

      // Verify sorting
      cy.get('[id="supportNeedUpdateSort"]').select('createdDate,ASC')
      cy.get('[type="submit"]').click()

      verifySortedPage()
    })
  })
})

function verifyPageOne() {
  cy.get('[id="updates-container"] div:first > h3').should('contain.text', 'End a tenancy')
  cy.get('[id="updates-container"] div:first').within(() => {
    cy.get('.govuk-caption-m').should('contain.text', 'Updated: 6 May 2025 by Mary Ford')
  })
}

function verifyPageTwo() {
  cy.get('[id="updates-container"] div:first > h3').should('contain.text', 'End a tenancy')
  cy.get('[id="updates-container"] div:first').within(() => {
    cy.get('.govuk-caption-m').should('contain.text', 'Updated: 30 April 2025 by Zahid Khan')
  })
}

function verifySortedPage() {
  cy.get('[id="updates-container"] div:first > h3').should('contain.text', 'Accommodation (case note)')
  cy.get('[id="updates-container"] div:first').within(() => {
    cy.get('.govuk-caption-m').should('contain.text', 'Updated: 16 November 2023 by Akiva Moshecorn')
  })
}

function verifyPaginationPageOne() {
  cy.get('.pagination-results > b').first().should('contain.text', '1')
  cy.get('.pagination-results > b').eq(1).should('contain.text', '10')
  cy.get('.pagination-results > b').eq(2).should('contain.text', '418')
}

function verifyPaginationPageTwo() {
  cy.get('.pagination-results > b').first().should('contain.text', '11')
  cy.get('.pagination-results > b').eq(1).should('contain.text', '20')
  cy.get('.pagination-results > b').eq(2).should('contain.text', '418')
}

function verifyPageSelected(pageNumber) {
  cy.get('@Pagination').within(() => {
    cy.get('.govuk-pagination__item--current > a').should('contain.text', pageNumber)
  })
}
