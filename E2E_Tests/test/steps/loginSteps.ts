import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { pageFixture } from '../../hooks/pageFixtures'
import CommonPage from '../../pageObjects/commonPage'
import LoginPage from '../../pageObjects/loginPageObject'
import { pageTitles } from '../../hooks/pageTitles'

let loginPage: LoginPage
let commonPage: CommonPage

setDefaultTimeout(100000)

Given('User navigates to the Resettlement Website', async function () {
  loginPage = new LoginPage(pageFixture.page)
})

Given('User enter the username as {string}', async function (username) {
  console.log('Entering Username')
  await loginPage.enterUserName(username)
})

Given('User enter the password as {string}', async function (password) {
  console.log('Entering Password')
  await loginPage.enterPassword(password)
})

When('User click on the login button', async function () {
  await loginPage.clickOnSubmitButton()
})

Given('User logs in as dev user', async function () {
  commonPage = new CommonPage(pageFixture.page)

  await commonPage.logIn()
})

Then('Login should be success', async function () {
  await pageFixture.page.waitForLoadState()
  const title = await pageFixture.page.title()
  console.log('This is the page Title =' + title)
  expect(title).toEqual(pageTitles.PrisonPageTitle)
  console.log('Login Successful')
})
