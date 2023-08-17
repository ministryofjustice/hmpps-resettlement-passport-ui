import express from 'express'

const prisonerOverviewRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  try {
    const token = res.locals?.user?.token
    const headers = {
      Authorization: `Bearer ${token}`,
    }

    const apiResponse = await fetch(
      `https://resettlement-passport-api-dev.hmpps.service.justice.gov.uk/resettlement-passport/prisoner/${prisonerData.prisonerId}/licence-condition`,
      { headers },
    )
    const licenceConditions = await apiResponse.json()

    if (!apiResponse.ok) {
      throw new Error(licenceConditions.userMessage)
    }
    res.render('pages/overview', { licenceConditions, prisonerData })
  } catch (error) {
    const errorMessage = error.message
    res.render('pages/overview', { errorMessage, prisonerData })
  }
})

export default prisonerOverviewRouter
