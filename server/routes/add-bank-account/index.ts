import { Router } from 'express'
import AddBankAccountController from './addBankAccountController'

export default (router: Router) => {
  const addBankAccountController = new AddBankAccountController()
  router.get('pages/add-bank-account')
}
