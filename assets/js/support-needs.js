const removeSupportNeedBtnEl = document.querySelector('.remove-support-need-button')
const confirmRemoveSupportNeedFormEl = document.querySelector('.confirm-remove-support-need')
const cancelRemoveSupportNeedBtnEl = document.querySelector('.cancel-remove-support-need-button')

function showRemoveSupportNeedConfirmation() {
  confirmRemoveSupportNeedFormEl.hidden = false
  cancelRemoveSupportNeedBtnEl.hidden = false
  removeSupportNeedBtnEl.hidden = true
}

function hideRemoveSupportNeedConfirmation() {
  confirmRemoveSupportNeedFormEl.hidden = true
  cancelRemoveSupportNeedBtnEl.hidden = true
  removeSupportNeedBtnEl.hidden = false
}

if (removeSupportNeedBtnEl) {
  removeSupportNeedBtnEl.addEventListener('click', showRemoveSupportNeedConfirmation)
}
if (cancelRemoveSupportNeedBtnEl) {
  cancelRemoveSupportNeedBtnEl.addEventListener('click', hideRemoveSupportNeedConfirmation)
}
