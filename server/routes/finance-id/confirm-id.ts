import express from 'express'

const confirmIdRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query

  const {
    haveGro,
    isUkNationalBornOverseas,
    countryBornIn,
    isPriorityApplication,
    idType,
    caseNumber,
    courtDetails,
    driversLicenceType,
    driversLicenceApplicationMadeAt,
    costOfApplication,
  } = params

  function checkIsValidCurrency(str: string): boolean {
    const regex = /^[0-9]+(\.[0-9]{2})?$/
    return regex.test(str)
  }

  const costIsValid: boolean = checkIsValidCurrency(<string>costOfApplication)

  if (!costOfApplication || !costIsValid) {
    const costMessage = 'Enter the cost of application'
    const costIsNotValidMessage = 'Application cost can only include pounds and pence'
    const errorMsg = {
      costOfApplication: costOfApplication ? null : `${costMessage}`,
      costIsValid: costIsValid ? null : `${costIsNotValidMessage}`,
    }
    res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
    return
  }
  if (
    (idType === 'Birth certificate' ||
      idType === 'Marriage certificate' ||
      idType === 'Civil partnership certificate') &&
    (!haveGro || !isUkNationalBornOverseas || !isPriorityApplication)
  ) {
    const message = 'Select an option'
    const errorMsg = {
      haveGro: haveGro ? null : `${message}`,
      isUkNationalBornOverseas: isUkNationalBornOverseas ? null : `${message}`,
      isPriorityApplication: isPriorityApplication ? null : `${message}`,
    }
    res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
    return
  }
  if (
    (idType === 'Birth certificate' ||
      idType === 'Marriage certificate' ||
      idType === 'Civil partnership certificate') &&
    isUkNationalBornOverseas === 'true' &&
    countryBornIn === ''
  ) {
    const countryBornMessage = 'Select a country'
    const errorMsg = {
      countryBornIn: countryBornIn ? null : `${countryBornMessage}`,
    }
    res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
    return
  }
  if (idType === 'Adoption certificate' && (!haveGro || !isPriorityApplication)) {
    const message = 'Select an option'
    const errorMsg = {
      haveGro: haveGro ? null : `${message}`,
      isPriorityApplication: isPriorityApplication ? null : `${message}`,
    }
    res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
    return
  }
  if (idType === 'Divorce decree absolute certificate' && (!caseNumber || !courtDetails)) {
    const caseNumberMessage = 'Enter a case number'
    const courtDetailMessage = 'Enter court details'
    const errorMsg = {
      caseNumber: caseNumber ? null : `${caseNumberMessage}`,
      courtDetails: courtDetails ? null : `${courtDetailMessage}`,
    }
    res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
    return
  }
  if (idType === 'Driving licence' && (!driversLicenceApplicationMadeAt || !driversLicenceType)) {
    const errorMsg = {
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
