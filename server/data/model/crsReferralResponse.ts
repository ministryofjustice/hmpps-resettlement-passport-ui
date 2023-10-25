export type CrsReferralResponse = {
  error?: string
  results?: CrsReferralsWithPathway[]
}

type CrsReferralsWithPathway = {
  pathway: string
  referrals: CrsReferral[]
  message: string
}

export type CrsReferral = {
  serviceCategories?: string[]
  contractType: string
  referralCreatedAt?: string
  referralSentAt?: string
  interventionTitle?: string
  referringOfficer?: string
  responsibleOfficer?: string
  serviceProviderUser?: string
  serviceProviderLocation?: string
  serviceProviderName?: string
  draft?: boolean
}
