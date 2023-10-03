import express from 'express'

const confirmIdRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query

  const {
    haveGro,
    isUkNationalBornOverseas,
    countryBornIn,
    isPriorityApplication,
    costOfApplication,
    idType,
    caseNumber,
    courtDetails,
    driversLicenceType,
    driversLicenceApplicationMadeAt,
  } = params

  let selectACountry = false
  if (isUkNationalBornOverseas && countryBornIn === '') {
    selectACountry = true
  }

  if (
    (idType === 'Birth certificate' ||
      idType === 'Marriage certificate' ||
      idType === 'Civil partnership certificate') &&
    (!haveGro || !isUkNationalBornOverseas || !isPriorityApplication || !costOfApplication || selectACountry)
  ) {
    const message = 'Select an option'
    const countryBornMessage = 'Select a country'
    const costMessage = 'Enter the cost of application'
    const errorMsg = {
      haveGro: haveGro ? null : `${message}`,
      isUkNationalBornOverseas: isUkNationalBornOverseas ? null : `${message}`,
      isPriorityApplication: isPriorityApplication ? null : `${message}`,
      costOfApplication: costOfApplication ? null : `${costMessage}`,
      countryBornIn: selectACountry === false ? null : `${countryBornMessage}`,
    }
    res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
    return
  }
  if (idType === 'Adoption certificate' && (!haveGro || !isPriorityApplication || !costOfApplication)) {
    const message = 'Select an option'
    const costMessage = 'Enter the cost of application'
    const errorMsg = {
      haveGro: haveGro ? null : `${message}`,
      isPriorityApplication: isPriorityApplication ? null : `${message}`,
      costOfApplication: costOfApplication ? null : `${costMessage}`,
    }
    res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
    return
  }
  if (idType === 'Divorce decree absolute certificate' && (!costOfApplication || !caseNumber || !courtDetails)) {
    const caseNumberMessage = 'Enter a case number'
    const courtDetailMessage = 'Enter court details'
    const costMessage = 'Enter the cost of application'
    const errorMsg = {
      costOfApplication: costOfApplication ? null : `${costMessage}`,
      caseNumber: caseNumber ? null : `${caseNumberMessage}`,
      courtDetails: courtDetails ? null : `${courtDetailMessage}`,
    }
    res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
    return
  }
  if ((idType === 'Deed poll certificate' || idType === 'Biometric residence certificate') && !costOfApplication) {
    const costMessage = 'Enter the cost of application'
    const errorMsg = {
      costOfApplication: costOfApplication ? null : `${costMessage}`,
    }
    res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
    return
  }
  if (idType === 'Driving licence' && (!costOfApplication || !driversLicenceApplicationMadeAt || !driversLicenceType)) {
    const costMessage = 'Enter the cost of application'
    const errorMsg = {
      costOfApplication: costOfApplication ? null : `${costMessage}`,
      driversLicenceType: driversLicenceType === '' ? 'Choose a driving licence type' : null,
      driversLicenceApplicationMadeAt:
        driversLicenceApplicationMadeAt !== '' ? null : 'Choose where application was made',
    }
    res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
    return
  }
  res.render('pages/add-id-confirm', { prisonerData, params, req })
})

export default confirmIdRouter
