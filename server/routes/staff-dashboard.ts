import express from 'express'
import logger from '../../logger'

interface PrisonItem {
  name: string
  id: string
  active: boolean
}

const staffDashboardRouterGet = express.Router().get('/', async (req, res, next) => {
  try {
    const token = res.locals?.user?.token
    const headers = {
      Authorization: `Bearer ${token}`,
    }

    const prisonApiResponse = await fetch(
      `${process.env.RESETTLEMENT_PASSPORT_API_URL}/resettlement-passport/prisons/active`,
      { headers },
    )

    if (prisonApiResponse.status !== 200) {
      const errorDetail = await prisonApiResponse.text()
      throw Error(
        `Call to ${prisonApiResponse.url} failed with status code ${prisonApiResponse.status} and body \n${errorDetail}`,
      )
    }

    const prisons = await prisonApiResponse.json()

    const prisonSelectList = prisons.map((prison: PrisonItem) => {
      return {
        text: prison.name,
        value: prison.id,
      }
    })

    prisonSelectList.unshift({
      text: '',
      value: 'unset',
    })

    res.render('pages/staff-dashboard', { prisonSelectList })
  } catch (error) {
    const errorMessage = 'Unexpected error'
    logger.error(error, errorMessage)
    res.render('pages/staff-dashboard', { errorMessage })
  }
})

export default staffDashboardRouterGet
