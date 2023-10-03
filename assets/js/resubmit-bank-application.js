const statusSelectEl = document.querySelector('.status-select')
const conditionalFieldsEl = document.querySelector('.conditional-form-fields')
const accountDeclinedFormEl = document.querySelector('.account-declined-form')
const accountOpenedFormEl = document.querySelector('.account-opened-form')

function handleChangeStatus(e) {
  if (e.target.value === '') {
    conditionalFieldsEl.hidden = true
  } else {
    conditionalFieldsEl.hidden = false
  }

  if (e.target.value === 'Account opened') {
    accountDeclinedFormEl.hidden = true
  } else {
    accountDeclinedFormEl.hidden = false
  }

  if (e.target.value === 'Account declined') {
    accountOpenedFormEl.hidden = true
  } else {
    accountOpenedFormEl.hidden = false
  }
}

if (statusSelectEl) {
  statusSelectEl.addEventListener('change', handleChangeStatus)
}
