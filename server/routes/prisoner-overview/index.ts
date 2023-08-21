import { Router } from 'express'
import { RPClient } from '../../data'

const prisonerOverviewRouter = Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  try {
    const rpClient = new RPClient()
    const licenceConditions = (await rpClient.get(
      req.user.token,
      `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/licence-condition`,
    )) as LicenceCondition

    res.render('pages/overview', { licenceConditions, prisonerData })
  } catch (error) {
    const errorMessage = error.message
    res.render('pages/overview', { errorMessage, prisonerData })
  }
})

export default prisonerOverviewRouter

interface LicenceCondition {
  id: number
  image: boolean
  text?: string
}
