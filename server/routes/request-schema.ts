import { check } from 'express-validator'

const regExp = /^[A-Za-z0-9]*$/
const schema = [
  check('prisonerNumber').not().isEmpty({ ignore_whitespace: true }),
  check('prisonerNumber').isLength({ min: 1 }),
  check('prisonerNumber').not().isNumeric(),
  check('prisonerNumber').not().isAlpha(),
  check('prisonerNumber').custom(value => {
    return regExp.test(value.trim())
  }),
]

export { schema as requestSchema }
