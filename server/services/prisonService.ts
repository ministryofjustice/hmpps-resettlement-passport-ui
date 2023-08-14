import { RPClient } from '../data'
import Prison from '../data/model'

export default class PrisonService {
  constructor(private readonly rpClient: RPClient) {}

  async getListOfPrisons(token: string): Promise<Prison[]> {
    return this.rpClient.getPrisons(token)
  }
}
