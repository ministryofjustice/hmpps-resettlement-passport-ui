import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { pageFixture } from '../../hooks/pageFixtures'
import CommonPage from '../../pageObjects/commonPage'
import PrisonPage from '../../pageObjects/prisonPage'
import { pageTitles } from '../../hooks/pageTitles'
import ResettlementOverviewPage from '../../pageObjects/resettlementOverviewPage'

setDefaultTimeout(50000)
let commonPage: CommonPage
let prisonPage: PrisonPage
let resettlementOverviewPage: ResettlementOverviewPage

Given(
  'The User navigates to the list of prisons page and the time to release filter of {string} has been applied with prisoner {string} entered as prisoner name',
  async function (timeToReleaseOption, prisonerName) {
    commonPage = new CommonPage(pageFixture.page)
    prisonPage = new PrisonPage(pageFixture.page)
    resettlementOverviewPage = new ResettlementOverviewPage(pageFixture.page)
    await commonPage.logIn()
    await prisonPage.selectTimeToReleaseEntry(timeToReleaseOption)
    await prisonPage.clickOnApplyFilterButton()
    await prisonPage.enterPrisonerIntoPrisonerSearch(prisonerName)
    await prisonPage.clickOnApplyFilterButton()
  },
)

Then('I select and apply the filter {string}', async function (timeToReleaseOption) {
  await prisonPage.selectTimeToReleaseEntry(timeToReleaseOption)
  await prisonPage.clickOnApplyFilterButton()
})

Then(
  'the first prisoner name in the prisoners list is {string} with release conditions {string}',
  async function (firstPrisonerInPrisonersList, releaseConditions) {
    expect(await prisonPage.defaultPrisonerInThePrisonersList()).toEqual(firstPrisonerInPrisonersList)
    expect(await prisonPage.defaultPrisonerReleaseConditionInThePrisonersList()).toEqual(releaseConditions)
  },
)

Given('The prison selection is empty', async function () {
  await prisonPage.checkDefaultPrisonSelectionIsEmpty()
})

Given('select prison {string}', async function (prisonName) {
  await prisonPage.selectPrison(prisonName)
})

When('the user accepts selection of the prison', async function () {
  console.log('Accepting selected Prison')
  await prisonPage.acceptPrison()
})

Then('the prison selection text is {string}', async function (prisonNameText) {
  const prisonText = await prisonPage.getSelectedPrisonText()
  expect(prisonText).toEqual(prisonNameText)
})

Then('the list of prisoners is displayed', async function () {
  const checkListOfPrisoners = await prisonPage.checkListOfPrisonersIsDisplayed()
  expect(checkListOfPrisoners).toBeTruthy()
})

Then(
  'the prisoner {string} is with a prisoner number of {string}, release date of {string}, release conditions of {string} and the friday release date is {string}',
  async function (prisonerName, prisonerNumber, prisonReleaseDate, releaseConditions, fridayRelease) {
    // console.log('The prison Number for the prisoner '+ (await prisonPage.getPrisonerNumber(prisonerName)))
    // console.log('The prisoner release date: '+ (await prisonPage.getPrisonerReleaseDate(prisonerName)))
    // console.log('The prisoner release condition: '+ (await prisonPage.getPrisonerReleaseConditions(prisonerName)))
    // console.log('The prisoner friday release condition: '+ (await prisonPage.checkFridayReleaseDate(prisonerName)))
    expect(await prisonPage.getPrisonerNumber(prisonerName)).toEqual(prisonerNumber)
    expect(await prisonPage.getPrisonerReleaseDate(prisonerName)).toEqual(prisonReleaseDate)
    expect(await prisonPage.getPrisonerReleaseConditions(prisonerName)).toEqual(releaseConditions)
    expect(await prisonPage.checkFridayReleaseDate(prisonerName)).toEqual(fridayRelease)
  },
)

Then('the prisoner {string} is selected', async function (prisonerName) {
  await prisonPage.clickAndViewAPrisoner(prisonerName)
})

Then('the resettlement overview page is displayed', async function () {
  await commonPage.verifyResettlementPage()
})

Then('the prisoner {string} has a pathway status section displayed', async function (prisonerName) {
  expect(await prisonPage.getAllPathwayStatusTextForAPrisoner(prisonerName)).toEqual(
    pageTitles.PrisonersPagePathwayStatusTextForJohnSmith,
  )
})

When(
  'I click on the resettlement status link to see the various pathway statuses for {string}',
  async function (prisonerName) {
    await prisonPage.clickOnResettlementStatusLink(prisonerName)
  },
)

When(
  'I see the accommodation pathway status displayed for {string} in the prisoners page pathway status is the same as that displayed in the prisoners page',
  async function (prisonerName) {
    const a = await prisonPage.getAccommodationPathwayStatusAndClickViaPrisonerListPage(prisonerName)
    expect(a).toEqual(await resettlementOverviewPage.getResettlementPathwayStatus())
    const b = await resettlementOverviewPage.getPrisonerNameInResettlementOverviewPage()
    expect(b).toContain(prisonerName)
  },
)

When(
  'I see the Attitudes, thinking and behaviour pathway status displayed for {string} in the prisoners page pathway status is the same as that displayed in the prisoners page',
  async function (prisonerName) {
    const a = await prisonPage.getATBPathwayStatusAndClickViaPrisonerListPage(prisonerName)
    expect(a).toEqual(await resettlementOverviewPage.getResettlementPathwayStatus())
    // await pageFixture.page.waitForTimeout(3000)
    const b = await resettlementOverviewPage.getPrisonerNameInResettlementOverviewPage()
    expect(b).toContain(prisonerName)
  },
)

When(
  'I see the Children, families and communities pathway status displayed for {string} in the prisoners page pathway status is the same as that displayed in the prisoners page',
  async function (prisonerName) {
    const a = await prisonPage.getCTCPathwayStatusAndClickViaPrisonerListPage(prisonerName)
    expect(a).toEqual(await resettlementOverviewPage.getResettlementPathwayStatus())
    // await pageFixture.page.waitForTimeout(3000)
    const b = await resettlementOverviewPage.getPrisonerNameInResettlementOverviewPage()
    expect(b).toContain(prisonerName)
  },
)

When(
  'I see the Drugs and alcohol pathway status displayed for {string} in the prisoners page pathway status is the same as that displayed in the prisoners page',
  async function (prisonerName) {
    const a = await prisonPage.getDACPathwayStatusAndClickViaPrisonerListPage(prisonerName)
    expect(a).toEqual(await resettlementOverviewPage.getResettlementPathwayStatus())
    // await pageFixture.page.waitForTimeout(3000)
    const b = await resettlementOverviewPage.getPrisonerNameInResettlementOverviewPage()
    expect(b).toContain(prisonerName)
  },
)

When(
  'I see the Education, skills and work pathway status displayed for {string} in the prisoners page pathway status is the same as that displayed in the prisoners page',
  async function (prisonerName) {
    const a = await prisonPage.getESWPathwayStatusAndClickViaPrisonerListPage(prisonerName)
    expect(a).toEqual(await resettlementOverviewPage.getResettlementPathwayStatus())
    // await pageFixture.page.waitForTimeout(3000)
    const b = await resettlementOverviewPage.getPrisonerNameInResettlementOverviewPage()
    expect(b).toContain(prisonerName)
  },
)

When(
  'I see the Finance and ID pathway status displayed for {string} in the prisoners page pathway status is the same as that displayed in the prisoners page',
  async function (prisonerName) {
    const a = await prisonPage.getFinanceIDPathwayStatusAndClickViaPrisonerListPage(prisonerName)
    expect(a).toEqual(await resettlementOverviewPage.getResettlementPathwayStatus())
    const b = await resettlementOverviewPage.getPrisonerNameInResettlementOverviewPage()
    expect(b).toContain(prisonerName)
  },
)

When(
  'I see the Health pathway status displayed for {string} in the prisoners page pathway status is the same as that displayed in the prisoners page',
  async function (prisonerName) {
    const a = await prisonPage.getHealthPathwayStatusAndClickViaPrisonerListPage(prisonerName)
    expect(a).toEqual(await resettlementOverviewPage.getResettlementPathwayStatus())
    const b = await resettlementOverviewPage.getPrisonerNameInResettlementOverviewPage()
    expect(b).toContain(prisonerName)
  },
)
