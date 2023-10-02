const selectOptionsEl = document.querySelector('.status-options')
const selectOptionsIdEl = document.querySelector('.status-options-id')
const inputFieldsSectionEl = document.querySelector('.input-fields')
const dateAccountOpenedEl = document.querySelector('.date-account-opened')
const dateHeardFromApplicationEl = document.querySelector('.date-heard-from-application')
const acceptedApplicationEl = document.querySelector('.id-accepted-application')
const rejectedApplicationEl = document.querySelector('.id-rejected-application')

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

function handleIDChangeStatus(e) {
  if (e.target.value === '') {
    acceptedApplicationEl.hidden = true
    rejectedApplicationEl.hidden = true
  }
  if (e.target.value === 'Accepted') {
    acceptedApplicationEl.hidden = false
    rejectedApplicationEl.hidden = true
  } else if (e.target.value === 'Rejected') {
    acceptedApplicationEl.hidden = true
    rejectedApplicationEl.hidden = false
  }
}

if (selectOptionsEl) {
  selectOptionsEl.addEventListener('change', handleChangeStatus)
}

if (selectOptionsIdEl) {
  selectOptionsIdEl.addEventListener('change', handleIDChangeStatus)
}
