export type PaginationPage = {
  pageNumber?: number
  pageType: 'next' | 'previous' | 'number' | 'ellipses'
  isCurrent: boolean
}

export type Pagination = {
  pages?: PaginationPage[]
  startItem?: number
  endItem?: number
}
