export type PageType = 'next' | 'previous' | 'number' | 'ellipses'

export type PaginationPage = {
  displayName?: number
  pageType: PageType
  isCurrent: boolean
}

export type Pagination = {
  pages?: PaginationPage[]
}
