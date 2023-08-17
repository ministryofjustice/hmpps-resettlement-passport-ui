import express from 'express'
import { RPClient } from '../data'

const prisonerOverviewRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  try {
    const apiResponse = new RPClient()
    const licenceConditions = (await apiResponse.get(
      req.user.token,
      `/resettlement-passport/prisoner/${prisonerData.prisonerId}/licence-condition`,
    )) as LicenceCondition

    console.log(licenceConditions)

    const imageBase64 = await apiResponse.getImageAsBase64String(
      req.user.token,
      `/resettlement-passport/prisoner/${prisonerData.prisonerId}/licence-condition/id/101/condition/1008/image`,
    )

    res.render('pages/overview', { licenceConditions, imageBase64, prisonerData })
  } catch (error) {
    const errorMessage = error.message
    res.render('pages/overview', { errorMessage, prisonerData })
  }
})

export default prisonerOverviewRouter

interface LicenceConditions {
  licenceId?: number
  status?: string

  standardLicenceConditions?: LicenceCondition[]
  otherLicenseConditions?: LicenceCondition[]
}
interface LicenceCondition {
  id: number
  image: boolean
  text?: string
}
