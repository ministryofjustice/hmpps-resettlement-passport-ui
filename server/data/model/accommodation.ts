export type Accommodation = {
  referralDate?: string
  provider?: string
  team?: string
  officer?: OfficerInfo
  status?: string
  startDateTime?: string
  notes?: string
  mainAddress?: string
  message?: string
  error?: string
}

type OfficerInfo = {
  forename?: string
  surname?: string
  middlename?: string
}
