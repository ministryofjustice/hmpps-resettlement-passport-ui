import { Page, expect } from '@playwright/test'
import { pageTitles } from '../hooks/pageTitles'

export default class CommonPage {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  private CommonPageElements = {
    userInput: "//input[@id='username']",
    passwordInput: "//input[@id='password']",
    submitButton: "//button[@id='submit']",
  }

  public async enterLoginDetails() {
    await this.page.locator(this.CommonPageElements.userInput).type(process.env.USERNAME)
    await this.page.locator(this.CommonPageElements.passwordInput).type(process.env.PASSWORD)
    await this.page.locator(this.CommonPageElements.submitButton).click()
    await this.page.waitForLoadState()
  }

  public async logIn() {
    await this.enterLoginDetails()
    console.log('Logging into the HMPPS Reducing Re-offending Webpage')
    const loginPageTitle = await this.page.title()
    console.log(`This is the Login Page Title =${loginPageTitle}`)
    expect(loginPageTitle).toEqual(pageTitles.PrisonPageTitle)
    console.log('Logged in Successfully')
  }

  public async verifyResettlementPage() {
    const resettlementOverviewPageTitle = await this.page.title()
    console.log(`This is the Page Title =${resettlementOverviewPageTitle}`)
    expect(resettlementOverviewPageTitle).toEqual(pageTitles.ResettlementOverviewPageTitle)
    console.log('This is the resettlement Overview Page ')
  }
}
