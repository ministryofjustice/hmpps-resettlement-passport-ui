import { check } from 'express-validator'

const schema = [check('prisonerNumber').isAlphanumeric()]

export { schema as prisonerNumberSchema }
