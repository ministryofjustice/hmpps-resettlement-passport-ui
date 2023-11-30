export type PrisonerCountMetrics = {
  error?: string
  twelveWeeks?: PrisonerCountMetric
  twentyFourWeeks?: PrisonerCountMetric
  allFuture?: PrisonerCountMetric
}

export type PrisonerCountMetric = {
  totalPopulation: number
  notStarted: string
  inProgress: string
  done: string
}
