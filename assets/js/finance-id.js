// SHOW/HIDE DELETE ASSESSMENT BUTTONS
const deleteBtnEl = document.querySelector('.delete-button')
const confirmDeleteFormEl = document.querySelector('.confirm-delete-form')
const cancelDeleteBtnEl = document.querySelector('.cancel-delete-button')

function showDeleteConfirmation() {
  confirmDeleteFormEl.hidden = false
  cancelDeleteBtnEl.hidden = false
  deleteBtnEl.hidden = true
}

function hideDeleteConfirmation() {
  confirmDeleteFormEl.hidden = true
  cancelDeleteBtnEl.hidden = true
  deleteBtnEl.hidden = false
}

deleteBtnEl.addEventListener('click', showDeleteConfirmation)
cancelDeleteBtnEl.addEventListener('click', hideDeleteConfirmation)
