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
    cy.get('[data-qa="documents-row-licence-conditions"] > td').eq(2).should('have.text', '16 Aug 2024')
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

  it('shows error message when document upload fails with bad file type', () => {
    cy.task('stubDocumentUploadFailure', { errorMessage: 'Unsupported document format, only .doc or pdf allowed' })
    cy.signIn()
    cy.visit('upload-documents?prisonerNumber=A8731DY')

    cy.get('#file').selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'file.dunno',
      mimeType: 'who-knows',
      lastModified: Date.now(),
    })
    cy.get('[data-cy="submit"]').click()

    cy.get('#file-error').should('contain.text', 'The selected file must be a PDF, DOCX or DOC')
  })

  it('shows error message when document upload fails with a virus found', () => {
    cy.task('stubDocumentUploadFailureWithVirus')
    cy.signIn()
    cy.visit('upload-documents?prisonerNumber=A8731DY')

    cy.get('#file').selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'file.pdf',
      mimeType: 'application/pdf',
      lastModified: Date.now(),
    })
    cy.get('[data-cy="submit"]').click()

    cy.get('#file-error').should('contain.text', 'The selected file contains a virus')
  })
})
