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
