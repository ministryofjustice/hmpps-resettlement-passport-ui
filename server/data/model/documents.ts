export type DocumentMeta = {
  id: number
  fileName?: string
  originalDocumentFileName?: string
  creationDate?: Date
  category: string
}

// eslint-disable-next-line no-shadow
export const enum DocumentMetaType {
  LICENCE_CONDITIONS = 'LICENCE_CONDITIONS',
}
