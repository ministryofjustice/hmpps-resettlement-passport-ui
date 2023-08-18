import express from 'express'
import { RPClient } from '../../data'

const prisonerOverviewRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  try {
    const apiResponse = new RPClient()
    const licenceConditions = (await apiResponse.get(
      req.user.token,
      `resettlement-passport/prisoner/G4274GN/licence-condition`,
    )) as LicenceCondition

    console.log(licenceConditions)
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
