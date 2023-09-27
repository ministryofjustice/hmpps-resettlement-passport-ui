/***********************************
  SHOW/HIDE DELETE ASSESSMENT BUTTONS
************************************/
const deleteAssessmentBtnEl = document.querySelector('.delete-assessment-button')
const confirmDeleteAssessmentFormEl = document.querySelector('.confirm-delete-assessment-form')
const cancelDeleteAssessmentBtnEl = document.querySelector('.cancel-delete-assessment-button')

function showDeleteAssessmentConfirmation() {
  confirmDeleteAssessmentFormEl.hidden = false
  cancelDeleteAssessmentBtnEl.hidden = false
  deleteAssessmentBtnEl.hidden = true
}

function hideDeleteAssessmentConfirmation() {
  confirmDeleteAssessmentFormEl.hidden = true
  cancelDeleteAssessmentBtnEl.hidden = true
  deleteAssessmentBtnEl.hidden = false
}

deleteAssessmentBtnEl.addEventListener('click', showDeleteAssessmentConfirmation)
cancelDeleteAssessmentBtnEl.addEventListener('click', hideDeleteAssessmentConfirmation)

/***********************************
  SHOW/HIDE DELETE FINANCE BUTTONS
************************************/
const deleteFinanceBtnEl = document.querySelector('.delete-finance-button')
const confirmDeleteFinanceFormEl = document.querySelector('.confirm-delete-finance-form')
const cancelDeleteFinanceBtnEl = document.querySelector('.cancel-delete-finance-button')

function showDeleteFinanceConfirmation() {
  confirmDeleteFinanceFormEl.hidden = false
  cancelDeleteFinanceBtnEl.hidden = false
  deleteFinanceBtnEl.hidden = true
}

function hideDeleteFinanceConfirmation() {
  confirmDeleteFinanceFormEl.hidden = true
  cancelDeleteFinanceBtnEl.hidden = true
  deleteFinanceBtnEl.hidden = false
}

deleteFinanceBtnEl.addEventListener('click', showDeleteFinanceConfirmation)
cancelDeleteFinanceBtnEl.addEventListener('click', hideDeleteFinanceConfirmation)
