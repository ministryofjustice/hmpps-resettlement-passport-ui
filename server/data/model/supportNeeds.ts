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
