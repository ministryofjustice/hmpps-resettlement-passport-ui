export class Overview {
  constructor(page) {
    this.page = page

    this.enterUserNameField = page.locator('//*[@id="username"]')
    this.enterPasswordField = page.locator('//*[@id="password"]')
    this.submit = page.locator('//*[@id="submit"]')
    this.generateFirstTimeID = page.locator('//*[@id="generate-otp-task-btn"]')
    this.otpCode = page.locator('//*[@id="main-content"]/div/div/div/h1')

    this.dashboardHeader = page.locator('h1')
    this.prisonerHeader = page.locator('[data-qa="page-heading"]')

    this.header2Title = page.locator('[data-qa="page-title-h2"]')

    this.statusSummaryTitle = page.locator('//*[@id="status"]/header/h3')
    this.caseNotesSummaryTitle = page.locator('//*[@id="case-notes"]/header')
  }

  async gotoLogin() {
    await this.page.goto('https://resettlement-passport-ui-dev.hmpps.service.justice.gov.uk/')
  }

  async submitLogin() {
    await this.enterUserNameField.type(__ENV.PT_USERNAME)
    await this.enterPasswordField.type(__ENV.PT_PASSWORD)
    await this.submit.click()
  }

  async gotoPrisoner() {
    await this.page.goto(
      'https://resettlement-passport-ui-dev.hmpps.service.justice.gov.uk/prisoner-overview/?prisonerNumber=A8731DY',
    )
  }
}
