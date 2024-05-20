document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', e => {
    e.submitter.disabled = true
  })
})
