import express from 'express'

const confirmIdStatusRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query

  const { updatedStatus, refundAmount } = params

  if (updatedStatus === 'Rejected' && !refundAmount) {
    const message = 'Enter a refund amount'
    const errorMsg = {
      refundAmount: refundAmount ? null : `${message}`,
    }
    res.render('pages/add-id-update-status', { prisonerData, params, req, errorMsg })
    return
  }
  res.render('pages/add-id-update-status-confirm', { prisonerData, params, req })
})

export default confirmIdStatusRouter
