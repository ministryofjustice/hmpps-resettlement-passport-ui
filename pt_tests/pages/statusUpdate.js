export class StatusUpdate {
  constructor(page) {
    this.page = page
    this.update = page.locator('[data-qa="update-status-submit"]')
    this.updateStatus = page.locator('[data-qa="update-pathway-status-button"]')
  }
}
