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

if (deleteAssessmentBtnEl) {
  deleteAssessmentBtnEl.addEventListener('click', showDeleteAssessmentConfirmation)
}
if (cancelDeleteAssessmentBtnEl) {
  cancelDeleteAssessmentBtnEl.addEventListener('click', hideDeleteAssessmentConfirmation)
}

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

if (deleteFinanceBtnEl) {
  deleteFinanceBtnEl.addEventListener('click', showDeleteFinanceConfirmation)
}
if (cancelDeleteFinanceBtnEl) {
  cancelDeleteFinanceBtnEl.addEventListener('click', hideDeleteFinanceConfirmation)
}

/***********************************
  SHOW/HIDE DELETE ID BUTTONS
************************************/
document.querySelectorAll('.delete-id-button').forEach(btn =>
  btn.addEventListener('click', () => {
    btn.nextElementSibling.hidden = false
    btn.nextElementSibling.querySelector('.cancel-delete-id-button').hidden = false
    btn.hidden = true
  }),
)

document.querySelectorAll('.cancel-delete-id-button').forEach(btn =>
  btn.addEventListener('click', () => {
    btn.closest('.confirm-delete-id-form').hidden = true
    btn.hidden = true
    btn.closest('.confirm-delete-id-form').previousElementSibling.hidden = false
  }),
)
