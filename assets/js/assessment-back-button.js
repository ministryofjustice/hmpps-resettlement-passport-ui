// if JS is enabled, show back button
// onClick go back to previous page in browser history

const backButton = document.querySelector('.assessment-back-button')

if (backButton) {
  backButton.style.display = 'block'
  backButton.addEventListener('click', function () {
    window.history.back()
  })
}
