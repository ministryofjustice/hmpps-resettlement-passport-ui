import { FEATURE_FLAGS } from '../../server/utils/constants'

context('Staff Capacity', () => {
  beforeEach(() => {
    cy.task('reset')
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

  context('when read only mode is disabled', () => {
    beforeEach(() => {
      cy.task('overwriteFlag', { feature: FEATURE_FLAGS.READ_ONLY_MODE, enabled: false })
      cy.signIn()
    })

    it('should show the staff capacity tab on the staff dashboard', () => {
      cy.visit('/')
      cy.get('#tabs').should('contain.text', 'Staff capacity')
    })

    it('should show the staff capacity page', () => {
      cy.visit('/staff-capacity')
      cy.get('[data-qa="page-heading"]').should('contain.text', 'All pathways overview')
    })
  })

  context('when read only mode is enabled', () => {
    beforeEach(() => {
      cy.task('overwriteFlag', { feature: FEATURE_FLAGS.READ_ONLY_MODE, enabled: true })
      cy.signIn()
    })

    it('should hide the staff capacity tab on the staff dashboard', () => {
      cy.visit('/')
      cy.get('#tabs').should('not.exist')
    })

    it('should show the 404 page unavailable page on the staff capacity URL', () => {
      cy.request({ url: '/staff-capacity', failOnStatusCode: false }).then(resp => {
        expect(resp.status).to.eq(404)
      })

      cy.visit('/staff-capacity', { failOnStatusCode: false })
      cy.get('[data-qa="page-heading"]').should('contain.text', 'Sorry, this page is unavailable')
    })
  })
})
