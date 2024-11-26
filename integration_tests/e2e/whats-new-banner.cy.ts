import { differenceInMonths } from 'date-fns'

context(`What's new banner`, () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubSignIn')
    cy.task('stubAuthUser', { name: 'john smith', nomis: true })
  })

  it(`Shows what's new banner on dashboard page, it can be dismissed`, () => {
    cy.task('stubDefaultSearchResults')
    cy.signIn()

    cy.visit('/')
    cy.get('[data-qa="page-heading"]').should('contain.text', 'All pathways overview')

    cy.get('#whats-new-banner').should('be.visible')
    cy.get('#whats-new-dismiss').click()

    cy.get('[data-qa="page-heading"]').should('contain.text', 'All pathways overview')
    cy.get('#whats-new-banner').should('not.exist')

    // Should persist banner dismiss after reloading page
    cy.visit('/')
    cy.get('[data-qa="page-heading"]').should('contain.text', 'All pathways overview')
    cy.get('#whats-new-banner').should('not.exist')
    cy.getCookie('whatsnew-USER1').should(cookie => {
      expect(cookie.sameSite).to.equal('lax')
      const now = new Date()
      const expiry = new Date()
      expiry.setTime(cookie.expiry * 1000)
      expect(differenceInMonths(expiry, now)).to.be.gte(11)
    })
  })
})
