import { PrisonerData } from '../../@types/express'
import RpService from '../../services/rpService'

export function stubPrisonerDetails(rpService: RpService) {
  jest.spyOn(rpService, 'getPrisonerDetails').mockResolvedValue({
    personalDetails: {
      prisonerNumber: '123',
      facialImageId: '456',
      firstName: 'John',
      lastName: 'Smith',
    },
    pathways: [
      {
        pathway: 'ACCOMMODATION',
        status: 'IN_PROGRESS',
      },
    ],
  } as PrisonerData)
}

export function sanitiseStackTrace(html: string) {
  return html.replaceAll(/at .*/g, 'at /')
}
