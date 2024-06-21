async function track(name, customTags) {
  try {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    const payload = JSON.stringify({
      eventName: 'PSFR_' + name,
      customTags: customTags,
    })
    console.log(payload)
    const response = await window.fetch('/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: payload,
    })
    if (response.ok) {
      console.log('Analytics sent: ', payload)
    }
  } catch (error) {
    console.error('Failed to submit analytics tracking request:', error)
  }
}

document.addEventListener('click', function (event) {
  const clickedElement = event.target
  const trackEventName = clickedElement.getAttribute('track-event-name')
  const prisonerId = clickedElement.getAttribute('track-event-prisoner-id')

  if (trackEventName) {
    const customTags = {
      type: clickedElement.tagName,
      path: window.location.pathname,
      prisonerId: prisonerId,
    }
    console.log(customTags)
    track(trackEventName, customTags)
  }
})
