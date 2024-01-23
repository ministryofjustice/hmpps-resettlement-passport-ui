import { Page } from '@playwright/test'

export default class LoginPage {
  constructor(private page: Page) {}

  private LoginPageElements = {
    userInput: "//input[@id='username']",
    passwordInput: "//input[@id='password']",
    submitButton: "//button[@id='submit']",
  }

  async enterUserName(user: string) {
    await this.page.locator(this.LoginPageElements.userInput).type(user)
  }

  async enterPassword(Password: string) {
    await this.page.locator(this.LoginPageElements.passwordInput).type(Password)
  }

  async clickOnSubmitButton() {
    await this.page.locator(this.LoginPageElements.submitButton).click()
  }
}
