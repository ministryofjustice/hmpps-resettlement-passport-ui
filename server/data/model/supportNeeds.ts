export type SupportNeed = {
  id: number
  title: string
  category: string | null
  allowUserDesc: boolean
  addedToPrisoner: boolean
}

export type SupportNeeds = {
  needs: SupportNeed[]
}
