import { DocumentMeta, formatDocumentCategory, latestByCategory } from './documentService'

describe('documentService', () => {
  describe('formatDocumentCategory', () => {
    it.each([
      ['LICENCE_CONDITIONS', 'Licence conditions'],
      ['DUNNO', 'Unknown category'],
      [null, 'Unknown category'],
      [undefined, 'Unknown category'],
    ])('%s converts to %s', (input, expected) => {
      expect(formatDocumentCategory(input)).toEqual(expected)
    })
  })

  describe('latestByCategory', () => {
    it('Chooses the latest document in each category', () => {
      const docs: DocumentMeta[] = [
        {
          id: 3,
          originalDocumentFileName: 'licence-conds-new',
          creationDate: new Date(),
          category: 'LICENCE_CONDITIONS',
        },
        {
          id: 2,
          originalDocumentFileName: 'licence-conds-old',
          creationDate: new Date(),
          category: 'LICENCE_CONDITIONS',
        },
        {
          id: 1,
          originalDocumentFileName: 'other-doc',
          creationDate: new Date(),
          category: 'OTHER',
        },
      ]

      const result = latestByCategory(docs)

      expect(result).toHaveLength(2)
      expect(result[0].id).toEqual(3)
      expect(result[1].id).toEqual(1)
    })

    it('Should handle empty array', () => {
      expect(latestByCategory([])).toEqual([])
    })
  })
})
