import express from 'express'

const prisonerOverviewRouter = express.Router().get('/:prisonerId', async (req, res, next) => {
  try {
    const token = res.locals?.user?.token
    const { prisonerId } = req.params
    const headers = {
      Authorization: `Bearer ${token}`,
    }

    const apiResponse = await fetch(
      `https://resettlement-passport-api-dev.hmpps.service.justice.gov.uk/resettlement-passport/prisoner/${prisonerId}/licence-condition`,
      { headers },
    )
    const licenceConditions = await apiResponse.json()

    if (!apiResponse.ok) {
      throw new Error(licenceConditions.userMessage)
    }
    res.render('pages/overview', { licenceConditions })
  } catch (error) {
    const errorMessage = error.message
    res.render('pages/overview', { errorMessage })
  }
})

export default prisonerOverviewRouter
