import { SupportNeedStatus } from './supportNeedStatus'

export type SupportNeedCache = {
  uuid: string
  supportNeedId: number
  existingPrisonerSupportNeedId: number
  title: string
  otherSupportNeedText: string
  status: string
  isPrisonResponsible: boolean
  isProbationResponsible: boolean
  updateText: string
  category: string
  allowUserDesc: boolean
  isUpdatable: boolean
  isSelected: boolean
  isPreSelected: boolean
}

export type SupportNeedCheckbox = {
  uuid: string
  supportNeedId: number
  title: string
  otherSupportNeedText: string
  category: string
  allowUserDesc: boolean
  isSelected: boolean
  isPreSelected: boolean
  error?: string
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
    id: number
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

export type PathwaySupportNeeds = {
  supportNeeds: PathwaySupportNeed[]
}

export type PathwaySupportNeed = {
  id: number
  title: string
  category: string
  allowUserDesc: boolean
  isUpdatable: boolean
  isPreSelected: boolean
  existingPrisonerSupportNeedId: number
}

export type GroupedSupportNeeds = {
  category: string
  id: string
  supportNeeds: SupportNeedCheckbox[]
  exclusiveOption: SupportNeedCheckbox
  error?: string
}[]

export type PrisonerSupportNeedDetails = {
  title: string
  isPrisonResponsible: boolean
  isProbationResponsible: boolean
  status: string
  previousUpdates: {
    id: number
    title: string
    status: string
    isPrisonResponsible: boolean
    isProbationResponsible: boolean
    text: string
    createdBy: string
    createdAt: string
  }[]
}

export type PrisonerSupportNeedsPatch = {
  text: string
  status: SupportNeedStatus
  isPrisonResponsible: boolean
  isProbationResponsible: boolean
}

export type PrisonerSupportNeedsPost = {
  needs: {
    needId: number
    prisonerSupportNeedId: number
    otherDesc: string
    status: string
    isPrisonResponsible: boolean
    isProbationResponsible: boolean
    text: string
  }[]
}

export type SupportNeedsCategoryGroup = {
  categoryName: string
  supportNeeds: SupportNeedCache[]
  noNeeds?: boolean
}
