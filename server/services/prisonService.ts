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
  ) {
    return (await this.rpClient.get(
      token,
      `/resettlement-passport/prison/${prisonSelected}/prisoners?page=${page}&size=${pageSize}&sort=${sortField},${sortDirection}`,
    )) as Promise<PrisonersList>
  }
}
