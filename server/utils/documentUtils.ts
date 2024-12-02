import { DocumentMeta, DocumentMetaType } from '../data/model/documents'

const categoryNames: Record<DocumentMetaType, string> = {
  LICENCE_CONDITIONS: 'Licence conditions',
}

export function formatDocumentCategory(category: DocumentMetaType): string {
  return categoryNames[category] ?? 'Unknown category'
}

export function latestByCategory(documents: DocumentMeta[]): DocumentMeta[] {
  // Note: results coming back from API are ordered, so we don't need to sort
  const seenCategories = new Set<string>()

  return documents.filter(doc => {
    if (seenCategories.has(doc.category)) {
      return false
    }
    seenCategories.add(doc.category)
    return true
  })
}
