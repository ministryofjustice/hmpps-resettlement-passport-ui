const selectOptionsEl = document.querySelector('.status-options')
const inputFieldsSectionEl = document.querySelector('.input-fields')
const dateAccountOpenedEl = document.querySelector('.date-account-opened')
const dateHeardFromApplicationEl = document.querySelector('.date-heard-from-application')

function handleChangeStatus(e) {
  if (e.target.value === '') {
    inputFieldsSectionEl.hidden = true
  } else {
    inputFieldsSectionEl.hidden = false
  }

  if (e.target.value === 'Account opened') {
    dateAccountOpenedEl.hidden = false
    dateHeardFromApplicationEl.hidden = true
  } else {
    dateHeardFromApplicationEl.hidden = false
    dateAccountOpenedEl.hidden = true
  }
}

if (selectOptionsEl) {
  selectOptionsEl.addEventListener('change', handleChangeStatus)
}
