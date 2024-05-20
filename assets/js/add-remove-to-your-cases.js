const casesButton = document.querySelector('button#add-to-your-cases-btn')
const casesForm = document.querySelector('#add-to-cases-form')
const addedToYourCases = document.currentScript.getAttribute('data-added-to-cases')

const removeText = 'Remove from your cases'
const addText = 'Add to your cases'
const removeAction = '/removeFromYourCases/'
const addAction = '/addToYourCases/'

function updateButtonTextAndAction() {
  if (casesButton && casesForm) {
    if (addedToYourCases === 'true') {
      casesButton.textContent = removeText
      casesForm.setAttribute('action', removeAction)
    } else {
      casesButton.textContent = addText
      casesForm.setAttribute('action', addAction)
    }
  }
}

window.onload = function () {
  updateButtonTextAndAction()
}
