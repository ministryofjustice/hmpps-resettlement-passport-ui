import { Before, BeforeAll, AfterAll, After } from '@cucumber/cucumber'
import { Browser, BrowserContext, chromium, firefox, Page, webkit } from '@playwright/test'
import { pageFixture } from './pageFixtures'

require('dotenv').config()

let browser: Browser
// let page: Page;
let context: BrowserContext

BeforeAll(async function () {
  browser = await chromium.launch({ headless: true }) //launches a chrome instance and returns a browser
})

Before(async function () {
  //Before Each Scenario
  context = await browser.newContext() //sets up incognito mode returns a browser context
  const page = await context.newPage() //new page in the browser returns page
  pageFixture.page = page //map to global page variable
  await pageFixture.page.goto(process.env.BASEURL)
  console.log('This is the base URL ' + process.env.BASEURL)
})

After(async function () {
  //After each scenario
  await pageFixture.page.close()
  await context.close()
})

AfterAll(async function () {
  //After All Tests

  await browser.close()
})
