export type PrisonersList = {
  content: Prisoners[]
  page: number
  last: boolean
}

type Prisoners = {
  firstName: string
  lastName: string
}
