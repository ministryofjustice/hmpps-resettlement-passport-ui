import { RPClient } from '../data'
import { PrisonersList } from '../data/model/prisoners'

export default class PrisonService {
  constructor(private readonly rpClient: RPClient) {}

  async getListOfPrisoners(
    token: string,
    prisonSelected: string,
    page: number,
    pageSize: number,
    sortField: string,
    sortDirection: string,
    searchInput: string,
    releaseTime: string,
  ) {
    await this.rpClient.setToken(token)
    return (await this.rpClient.get(
      `/resettlement-passport/prison/${prisonSelected}/prisoners?page=${page}&size=${pageSize}&sort=${sortField},${sortDirection}&term=${searchInput}&days=${releaseTime}`,
    )) as Promise<PrisonersList>
  }
}
