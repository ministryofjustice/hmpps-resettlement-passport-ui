export type SupportNeedCache = {
  id: number
  otherSupportNeedText: string | null
  status: string
  isPrisonResponsible: boolean
  isProbationResponsible: boolean
  updateText: string | null
}

export type SupportNeedsCache = {
  needs: SupportNeedCache[]
}

export type SupportNeedsSummary = {
  needs: {
    pathway: string
    reviewed: boolean
    notStarted: number
    inProgress: number
    met: number
    declined: number
    lastUpdated: string | null
    needsNotSet?: boolean
    isPrisonResponsible: boolean
    isProbationResponsible: boolean
  }[]
}

export type PathwaySupportNeedsSummary = {
  supportNeedsSet: boolean
  prisonerNeeds: {
    id: string
    title: string
    isPrisonResponsible: boolean
    isProbationResponsible: boolean
    status: string
    numberOfUpdates: number
    lastUpdated: string
  }[]
}

export type PathwaySupportNeedsUpdates = {
  updates: {
    id: number
    title: string
    status: string
    isPrisonResponsible: boolean
    isProbationResponsible: boolean
    text: string
    createdBy: string
    createdAt: string
  }[]
  allPrisonerNeeds: {
    id: number
    title: string
  }[]
  size: number
  page: number
  sortName: string
  totalElements: number
  last: boolean
}
