export type BankApplicationResponse = {
  error?: boolean
  id?: number
  logs?: BankApplicationLog[]
  applicationSubmittedDate?: string
  currentStatus?: string
  bankName?: string
  bankResponseDate?: string
  isAddedToPersonalItems?: boolean
  addedToPersonalItemsDate?: string
}

type BankApplicationLog = {
  status: string
  changeDate: string
}

export type IdApplicationResponse = {
  error?: boolean
  results?: IdApplication[]
}

export type IdApplication = {
  id: number
  idType: IdType
  applicationSubmittedDate: string
  isPriorityApplication: boolean
  costOfApplication: number
  refundAmount: number
  haveGro: boolean
  isUkNationalBornOverseas: boolean
  countryBornIn: string
  caseNumber: string
  courtDetails: string
  driversLicenceType: string
  driversLicenceApplicationMadeAt: string
  isAddedToPersonalItems: boolean
  addedToPersonalItemsDate: string
  status: string
  dateIdReceived: string
}

type IdType = {
  name: string
}
