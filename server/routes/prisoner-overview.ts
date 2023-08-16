import express from 'express'
import { RPClient } from '../data'

const prisonerOverviewRouter = express.Router().get('/:prisonerId', async (req, res, next) => {
  try {
    const { prisonerId } = req.params

    const apiResponse = new RPClient()
    const licenceConditions = await apiResponse.get(
      req.user.token,
      `/resettlement-passport/prisoner/${prisonerId}/licence-condition`,
    )
    const licenceConditionsLink = licenceConditions.map()

    const imageBase64 = await apiResponse.getImageAsBase64String(
      req.user.token,
      `/resettlement-passport/prisoner/${prisonerId}/licence-condition/id/101/condition/1008/image`,
    )

    res.render('pages/overview', { licenceConditions, imageBase64 })
  } catch (error) {
    const errorMessage = error.message
    res.render('pages/overview', { errorMessage })
  }
})

export default prisonerOverviewRouter
