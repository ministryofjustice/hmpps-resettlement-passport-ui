import { Given, setDefaultTimeout } from '@cucumber/cucumber'
import { pageFixture } from '../../hooks/pageFixtures'
import ResettlementOverviewPage from '../../pageObjects/resettlementOverviewPage'
import CommonPage from '../../pageObjects/commonPage'
import PrisonPage from '../../pageObjects/prisonPage'
import FinanceAndIDPage from '../../pageObjects/financeAndIDPage'
import AccommodationPage from '../../pageObjects/accommodationPage'
import { expect } from '@playwright/test'

setDefaultTimeout(50000)
let resettlementOverviewPage: ResettlementOverviewPage
let commonPage: CommonPage
let prisonPage: PrisonPage
let financeAndIDPage: FinanceAndIDPage
let accommodationPage: AccommodationPage
// await pageFixture.page.waitForTimeout(1000)
// console.log("here we dey now " + prisonerName)

Given(
  'The User navigates to the {string} Tab of Resettlement Overview Page as Prisoner {string} in the Moorland Prison',
  async function (resettlementTab, prisonerName) {
    commonPage = new CommonPage(pageFixture.page)
    prisonPage = new PrisonPage(pageFixture.page)
    resettlementOverviewPage = new ResettlementOverviewPage(pageFixture.page)
    financeAndIDPage = new FinanceAndIDPage(pageFixture.page)
    accommodationPage = new AccommodationPage(pageFixture.page)

    await commonPage.logIn()
    await prisonPage.selectTimeToReleaseEntry('All prisoners')
    await prisonPage.clickOnApplyFilterButton()
    await prisonPage.enterPrisonerIntoPrisonerSearch(prisonerName)
    await prisonPage.clickOnApplyFilterButton()
    await prisonPage.clickAndViewAPrisoner(prisonerName)
    await resettlementOverviewPage.clickOnResettlementOverviewPathwayTab(resettlementTab)
  },
)

Given('The {string} link of the accommodation tab is selected', async function (accommodationTabTreeLink) {
  await accommodationPage.clickOnAccommodationTreeLink(accommodationTabTreeLink)
})

Given(
  'The Main address section of the accommodation tab displays Address as {string}',
  async function (prisonerAddress) {
    await expect(await accommodationPage.getMainAddress()).toEqual(prisonerAddress)
  },
)

Given(
  'The note of abode in the address section of the accommodation tab displays Address as {string}',
  async function (prisonerAddress) {
    await expect(await accommodationPage.getAddressNote()).toEqual(prisonerAddress)
  },
)

Given(
  'The Duty to refer section of the accommodation tab displays Referral date as {string} Status as {string}',
  async function (dutyToReferReferralDate, dutyToReferReferralStatus) {
    await expect(await accommodationPage.getDutyToReferReferralDate()).toEqual(dutyToReferReferralDate)
    await expect(await accommodationPage.getDutyToReferStatus()).toEqual(dutyToReferReferralStatus)
  },
)
