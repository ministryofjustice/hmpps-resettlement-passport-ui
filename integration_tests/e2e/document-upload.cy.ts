context('Document upload', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubJohnSmithDefaults')
  })

  it('Can upload a document', () => {
    cy.task('stubDocumentUploadSuccess')
    cy.signIn()
    cy.visit('prisoner-overview?prisonerNumber=A8731DY')

    cy.get('.govuk-grid-column-three-quarters > .govuk-heading-xl').should('contain.text', 'Smith, John')

    cy.get('#file').selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'file.docx',
      mimeType: 'officedocument.wordprocessingml.document',
      lastModified: Date.now(),
    })
    cy.get('[data-cy="submit"]').click()

    cy.request({
      url: 'http://localhost:9091/__admin/requests/find',
      method: 'POST',
      body: JSON.stringify({
        method: 'POST',
        url: '/rpApi/resettlement-passport/prisoner/A8731DY/documents/upload?category=LICENCE_CONDITIONS',
      }),
    }).should(res => {
      expect(res.status).to.eq(200)
      const { requests } = res.body
      expect(requests).to.have.length(1)
      expect(requests[0].body).to.contain('file contents')
    })
  })

  it('shows error page when document upload fails', () => {
    cy.task('stubDocumentUploadFailure')
    cy.signIn()
    cy.visit('prisoner-overview?prisonerNumber=A8731DY')

    cy.get('#file').selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'file.dunno',
      mimeType: 'who-knows',
      lastModified: Date.now(),
    })
    cy.get('[data-cy="submit"]').click()
  })
})
