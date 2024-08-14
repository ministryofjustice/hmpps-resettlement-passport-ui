context('Document upload', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubJohnSmithDefaults')
  })

  it('Can view uploaded documents in the overview page', () => {
    cy.task('stubListDocumentsSuccess')
    cy.signIn()
    cy.visit('prisoner-overview?prisonerNumber=A8731DY#documents')

    cy.get('#documents h3').should('contain.text', 'Uploaded documents')
    cy.get('#documents .govuk-button').should('have.attr', 'href', '/upload-documents?prisonerNumber=A8731DY')

    cy.get('[data-qa="documents-row-licence-conditions"] > td').eq(0).should('have.text', 'conditions.pdf')
    cy.get('[data-qa="documents-row-licence-conditions"] > td').eq(1).should('have.text', 'Licence conditions')
    cy.get('[data-qa="documents-row-licence-conditions"] > td').eq(3).should('contain.text', 'View document')
    cy.get('[data-qa="documents-row-licence-conditions"] a').should(
      'have.attr',
      'href',
      '/document/A8731DY/licence-conditions',
    )
  })

  it('Can upload a document', () => {
    cy.task('stubDocumentUploadSuccess')
    cy.signIn()
    cy.visit('upload-documents?prisonerNumber=A8731DY')

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
    cy.visit('upload-documents?prisonerNumber=A8731DY')

    cy.get('#file').selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'file.dunno',
      mimeType: 'who-knows',
      lastModified: Date.now(),
    })
    cy.get('[data-cy="submit"]').click()
  })
})
