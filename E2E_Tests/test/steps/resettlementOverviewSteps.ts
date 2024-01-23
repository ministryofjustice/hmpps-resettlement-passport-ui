import { Given, Then, setDefaultTimeout, When } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { pageFixture } from '../../hooks/pageFixtures'
import ResettlementOverviewPage from '../../pageObjects/resettlementOverviewPage'
import CommonPage from '../../pageObjects/commonPage'
import PrisonPage from '../../pageObjects/prisonPage'
import { pageTitles } from '../../hooks/pageTitles'

setDefaultTimeout(50000)
let resettlementOverviewPage: ResettlementOverviewPage
let commonPage: CommonPage
let prisonPage: PrisonPage
// await pageFixture.page.waitForTimeout(1000)
// console.log("here we dey now " + prisonerName)

Given(
  'The User navigates to the Resettlement Overview Page as Prisoner {string} in the Moorland Prison',
  async function (prisonerName) {
    commonPage = new CommonPage(pageFixture.page)
    prisonPage = new PrisonPage(pageFixture.page)
    resettlementOverviewPage = new ResettlementOverviewPage(pageFixture.page)
    await commonPage.logIn()
    // await prisonPage.selectPrison(prisonName)
    // await prisonPage.acceptPrison ()
    await prisonPage.selectTimeToReleaseEntry('All prisoners')
    await prisonPage.clickOnApplyFilterButton()
    await prisonPage.enterPrisonerIntoPrisonerSearch(prisonerName)
    await prisonPage.clickOnApplyFilterButton()
    await prisonPage.clickAndViewAPrisoner(prisonerName)
  },
)

Given(
  'the first case note entry is populated with title {string} resettlement with status text as {string} and CaseNote Text {string}',
  async function (firstCaseNoteTitle, firstCaseNoteResettlementStatusText, firstCaseNoteText) {
    await expect(await resettlementOverviewPage.getFirstCaseNoteTitle()).toEqual(firstCaseNoteTitle)
    await expect(await resettlementOverviewPage.getFirstCaseNoteResettlementStatusText()).toEqual(
      firstCaseNoteResettlementStatusText,
    )
    await expect(await resettlementOverviewPage.getFirstCaseNoteText(firstCaseNoteText)).toContain(firstCaseNoteText)
  },
)

Given(
  'The happened and created text section populated with todays date and text {string}',
  async function (firstCaseNoteCreatedText) {
    await expect(await resettlementOverviewPage.verifyFirstCaseNoteHappenedText()).toEqual(
      await resettlementOverviewPage.createFirstCaseNoteHappenedText(),
    )
    await expect(await resettlementOverviewPage.verifyFirstCaseNoteCreatedText()).toEqual(
      await resettlementOverviewPage.createFirstCaseNoteCreatedText(firstCaseNoteCreatedText),
    )
  },
)

Given(
  'the first case note entry in the Resettlement Overview Tab is populated with title {string} resettlement with status text as {string} and CaseNote Text {string}',
  async function (firstCaseNoteTitle, firstCaseNoteResettlementStatusText, firstCaseNoteText) {
    await expect(await resettlementOverviewPage.getFirstCaseNoteTitleInResettlementOverviewTab()).toEqual(
      firstCaseNoteTitle,
    )
    await expect(
      await resettlementOverviewPage.getFirstCaseNoteResettlementStatusTextInResettlementOverviewTab(),
    ).toEqual(firstCaseNoteResettlementStatusText)
    await expect(await resettlementOverviewPage.getFirstCaseNoteTextInResettlementOverviewTab()).toContain(
      firstCaseNoteText,
    )
  },
)

Given(
  'The happened and created text section populated with todays date and text {string} for the first case note entry in the Resettlement Overview Tab',
  async function (firstCaseNoteCreatedText) {
    await expect(await resettlementOverviewPage.verifyFirstCaseNoteHappenedTextInResettlementOverviewTab()).toEqual(
      await resettlementOverviewPage.createFirstCaseNoteHappenedText(),
    )
    await expect(await resettlementOverviewPage.verifyFirstCaseNoteCreatedTextInResettlementOverviewTab()).toEqual(
      await resettlementOverviewPage.createFirstCaseNoteCreatedText(firstCaseNoteCreatedText),
    )
  },
)

Given(
  'the option {string} is selected in the created by dropdown menu and the apply filter button is selected',
  async function (dpsUserNameText) {
    await resettlementOverviewPage.selectCaseNoteUser(dpsUserNameText)
    await resettlementOverviewPage.clickOnApplyFiltersButtonForCreatedByCaseNotes()
  },
)

Given(
  'pathway status is changed to {string} with the text {string} with a timestamp and update applied.',
  async function (pathway, caseNoteText) {
    await resettlementOverviewPage.enterCaseNoteTextInPathwayStatus(pathway, caseNoteText)
  },
)

When('The user clicks on the add case note button and {string} page is displayed', async function (caseNotePageTitle) {
  await resettlementOverviewPage.clickOnAddANewCaseNoteButton()
  await expect(await resettlementOverviewPage.getAddACaseNotePageTitle()).toEqual(caseNotePageTitle)
})

When('the user selects the {string} option and clicks on continue', async function (resettlementTab) {
  await resettlementOverviewPage.selectPathwayInAddACaseNotePage(resettlementTab)
  await resettlementOverviewPage.clickOnContinueInAddANewCasePage()
})

When('the {string} Resettlement Overview tab is displayed', async function (resettlementTab) {
  expect(await resettlementOverviewPage.verifyPathwayResettlementOverviewPage(resettlementTab)).toEqual(resettlementTab)
  await pageFixture.page.waitForTimeout(2000)
})

When('I click through each page of the case notes till the last page of applied filter', async function () {
  await resettlementOverviewPage.clickThroughAllCaseNotesFilterPageTillTheLastPage()
})

When('clicks on the View History button and the {string} is displayed', async function (pathwayStatusTabCaseNoteTitle) {
  expect(await resettlementOverviewPage.getPathwayStatusTabCaseNoteTitle()).toEqual(pathwayStatusTabCaseNoteTitle)
})

When('The staff contact link is selected and staff contacts displayed', async function () {
  await resettlementOverviewPage.clickOnStaffContactsLink()
})

When('The appointment link is selected and appointments are displayed', async function () {
  await resettlementOverviewPage.clickOnAppointmentLink()
})

When(
  'The Key worker is {string}, Prison Offender Manager is {string} and the COM is {string}',
  async function (keyWorkStaffContact, POMStaffContact, COMStaffContact) {
    expect(await resettlementOverviewPage.getKeyWorkerStaffContact()).toEqual(keyWorkStaffContact)
    expect(await resettlementOverviewPage.getPOMStaffContact()).toEqual(POMStaffContact)
    expect(await resettlementOverviewPage.getCOMStaffContact()).toEqual(COMStaffContact)
  },
)

When('the first entry of the appointment section table is populated with {string}', async function (appointmentText) {
  expect(await resettlementOverviewPage.getAppointmentsSectionTitleRowContentOfResettlementOverviewTabText()).toEqual(
    appointmentText,
  )
})

When('the title row of the appointment section table is populated with {string}', async function (appointmentText) {
  expect(await resettlementOverviewPage.getFirstEntryInAppointmentsSectionOfResettlementOverviewTabText()).toEqual(
    appointmentText,
  )
})

When('I select the filter by pathway {string} case notes option', async function (pathwayStatusForCaseNotes) {
  await resettlementOverviewPage.selectFilterByPathwayForCaseNotes(pathwayStatusForCaseNotes)
})

When('I select the filter by date range {string} case notes option', async function (filterByDateRangeForCaseNotes) {
  await resettlementOverviewPage.selectFilterByDateRange(filterByDateRangeForCaseNotes)
})

When('I select the sort by {string} case notes option', async function (sortByForCaseNotes) {
  await resettlementOverviewPage.selectSortByForCaseNotes(sortByForCaseNotes)
})

When('I click on the Apply filters case notes button and the filter results are displayed', async function () {
  await resettlementOverviewPage.clickOnApplyFiltersForCaseNotes()
  // the next step is to check there is a results section
  expect(await resettlementOverviewPage.checkFiltersResultsForCaseNotesAreDisplayed()).toEqual(true)
})

When(
  'prisoner John Smith has a first name, last name, prisoner number, cell location and date of Birth',
  async function () {
    const a = await resettlementOverviewPage.getPrisonerProfileGridRowInformation()
    const b = a.split('Releasedate')
    const c = b[0]
    await expect(c).toEqual(pageTitles.PrisonerJohnSmithProfileHeader)
  },
)

When(
  'there is a case notes resettlement overview section for {string} with the {string}',
  async function (pathway, caseNoteCreatedByText) {
    expect(await resettlementOverviewPage.getCaseNoteCreatedByText(pathway)).toEqual(caseNoteCreatedByText)
  },
)

When('The case notes section for the prisoner is displayed', async function () {
  expect(await resettlementOverviewPage.checkCaseNoteSectionIsDisplayed()).toEqual(true)
})

When('the Risk of Serious Recidivism Last updated text is {string}', async function (recidivismValueUpdateText) {
  expect(await resettlementOverviewPage.getRiskOfSeriousRecidivismLastUpdateText()).toEqual(recidivismValueUpdateText)
})

When(
  'the Overall RoSH risk Last updated text is {string}',
  async function (overallRiskOfSeriousHarmRiskLevelUpdateText) {
    expect(await resettlementOverviewPage.getRoSHRiskLevelLastUpdateText()).toEqual(
      overallRiskOfSeriousHarmRiskLevelUpdateText,
    )
  },
)

When('the MAPPA Category Last updated text is {string}', async function (categoryLastUpdateText) {
  expect(await resettlementOverviewPage.getMAPPACategoryLastUpdateText()).toEqual(categoryLastUpdateText)
})

Given('Risk of Serious Recidivism is {string}', async function (RecidivismValue) {
  expect(await resettlementOverviewPage.getRiskOfSeriousRecidivism()).toEqual(RecidivismValue)
})

Given('Overall RoSH risk level is {string}', async function (OverallRiskOfSeriousHarmRiskLevel) {
  expect(await resettlementOverviewPage.getRoSHRiskLevel()).toEqual(OverallRiskOfSeriousHarmRiskLevel)
})

Given('the MAPPA Category is {string} and the Level is {string}', async function (category, level) {
  expect(await resettlementOverviewPage.getMAPPACategory()).toEqual(category)
  expect(await resettlementOverviewPage.getMAPPALevel()).toEqual(level)
})

Given(
  'the release date in the resettlement Overview page is {string} with a friday release information, number of days from now till the release and release type',
  async function (releaseDate) {
    console.log(`This is what i expected:${await resettlementOverviewPage.getPrisonerReleaseDate()}`)

    const today = new Date()
    const release_date = new Date(releaseDate)
    const timeInMilliSecond = today.getTime() - release_date.getTime()
    // console.log ('This is what i expected:'+ timeInMilliSecond)
    // console.log( -Math.floor(timeInMilliSecond / (1000 * 60 * 60 * 24)) );
    const a = pageTitles.PrisonerReleaseDateTextInResettlementOverview
    const b = -Math.floor(timeInMilliSecond / (1000 * 60 * 60 * 24))
    const c = 'days)Releasetype:CRD'
    const constructedReleaseDateText = `${a}${b}${c}`
    console.log(`This is the constructed Text:${constructedReleaseDateText}`)
    await expect(await resettlementOverviewPage.getPrisonerReleaseDate()).toEqual(constructedReleaseDateText)
  },
)

Given(
  'I click on the {string} readiness status link is selected and the tab is displayed',
  async function (pathwayReadinessStatusLink) {
    await resettlementOverviewPage.clickOnResettlementOverviewReadinessPathwayLink(pathwayReadinessStatusLink)
  },
)

Given("the last update text for each pathway is set to today's date", async function () {
  console.log('Checking all the updated Text for all 7 Pathway Statuses')
  console.log(
    `The date text for received${await resettlementOverviewPage.getPrisonerPathwayReadinessLastUpdateText(
      'Accommodation',
    )}`,
  )
  console.log(`The date text for expected${await resettlementOverviewPage.createLastUpdatedDate()}`)
  expect(await resettlementOverviewPage.getPrisonerPathwayReadinessLastUpdateText('Accommodation')).toEqual(
    await resettlementOverviewPage.createLastUpdatedDate(),
  )
  expect(
    await resettlementOverviewPage.getPrisonerPathwayReadinessLastUpdateText('Attitudes, thinking and behaviour'),
  ).toEqual(await resettlementOverviewPage.createLastUpdatedDate())
  expect(
    await resettlementOverviewPage.getPrisonerPathwayReadinessLastUpdateText('Children, families and communities'),
  ).toEqual(await resettlementOverviewPage.createLastUpdatedDate())
  expect(await resettlementOverviewPage.getPrisonerPathwayReadinessLastUpdateText('Drugs and alcohol')).toEqual(
    await resettlementOverviewPage.createLastUpdatedDate(),
  )
  expect(
    await resettlementOverviewPage.getPrisonerPathwayReadinessLastUpdateText('Education, skills and work'),
  ).toEqual(await resettlementOverviewPage.createLastUpdatedDate())
  expect(await resettlementOverviewPage.getPrisonerPathwayReadinessLastUpdateText('Finance and ID')).toEqual(
    await resettlementOverviewPage.createLastUpdatedDate(),
  )
  expect(await resettlementOverviewPage.getPrisonerPathwayReadinessLastUpdateText('Health')).toEqual(
    await resettlementOverviewPage.createLastUpdatedDate(),
  )
})

Given('All pathway statuses are set to {string}', async function (pathwayStatus) {
  console.log(`Setting All Pathways to ${pathwayStatus}`)
  await resettlementOverviewPage.clickOnResettlementOverviewPathwayTab('Accommodation')
  await resettlementOverviewPage.changePathwayStatus(pathwayStatus)
  await resettlementOverviewPage.clickOnResettlementOverviewPathwayTab('Attitudes, thinking and behaviour')
  await resettlementOverviewPage.changePathwayStatus(pathwayStatus)
  await resettlementOverviewPage.clickOnResettlementOverviewPathwayTab('Children, families and communities')
  await resettlementOverviewPage.changePathwayStatus(pathwayStatus)
  await resettlementOverviewPage.clickOnResettlementOverviewPathwayTab('Drugs and alcohol')
  await resettlementOverviewPage.changePathwayStatus(pathwayStatus)
  await resettlementOverviewPage.clickOnResettlementOverviewPathwayTab('Education, skills and work')
  await resettlementOverviewPage.changePathwayStatus(pathwayStatus)
  await resettlementOverviewPage.clickOnResettlementOverviewPathwayTab('Finance and ID')
  await resettlementOverviewPage.changePathwayStatus(pathwayStatus)
  await resettlementOverviewPage.clickOnResettlementOverviewPathwayTab('Health')
  await resettlementOverviewPage.changePathwayStatus(pathwayStatus)
  await resettlementOverviewPage.clickOnResettlementOverviewPathwayTab('Resettlement Overview')
  console.log(`All Pathways set to ${pathwayStatus}`)
})

Given(
  'the Resettlement Status Summary for prisoner {string} is displayed as Two Not Started Two In Progress and Three Done',
  async function (prisonerName) {
    // Note this step only works in resettlement overview page feature file tests
    console.log(`The List of Prisoners is displayed and now finding the pathway section for prisoner ${prisonerName}`)
    const a = await prisonPage.getAllPathwayStatusTextForAPrisoner(prisonerName)
    await expect(a).toEqual(pageTitles.PrisonersPagePathwayStatusTextForJohnSmithTwo)
  },
)

Given(
  'the Resettlement Status Summary for prisoner {string} is displayed as One Not Started Three In Progress and Three Done',
  async function (prisonerName) {
    // Note this step only works in resettlement overview page feature file tests
    console.log(`The List of Prisoners is displayed and now finding the pathway section for prisoner ${prisonerName}`)
    const a = await prisonPage.getAllPathwayStatusTextForAPrisoner(prisonerName)
    await expect(a).toEqual(pageTitles.PrisonersPagePathwayStatusTextForJohnSmith)
  },
)

Given(
  'from the Resettlement Overview Page, Navigate back to the List of Prisoners and search for prisoner {string} within Moorland prison',
  async function (prisonerName) {
    // Note this step only works in resettlement overview page feature file tests
    console.log('Clicking on License conditions link')
    await resettlementOverviewPage.clickOnPreparePrisonerForReleaseBreadcrumb()
    await prisonPage.selectTimeToReleaseEntry('All prisoners')
    await prisonPage.clickOnApplyFilterButton()
    await prisonPage.enterPrisonerIntoPrisonerSearch(prisonerName)
    await prisonPage.clickOnApplyFilterButton()
    // await prisonPage.selectPrison(prisonName)
    // await prisonPage.acceptPrison()
  },
)

Given("the last updated text for the prisoner {string} is today's date", async function (prisonerName) {
  // Note this step only works in resettlement overview page feature file tests
  const date = await resettlementOverviewPage.getTodayDateShortMonth()
  await expect(await prisonPage.getLastUpdatedTextForPrisoner(prisonerName)).toEqual(date)
})

Given(
  'The Resettlement statuses link in the Resettlement Overview Tab of the Resettlement Overview Page',
  async function () {
    console.log('Clicking on License conditions link')
  },
)

Given(
  'the Resettlement overview Pathway Readiness status for {string} tab is {string}',
  async function (prisonerReadinessPathway, prisonerReadinessPathwayStatus) {
    const status = await resettlementOverviewPage.getPrisonerReadinessOverviewPathwayStatus(prisonerReadinessPathway)
    await expect(status).toEqual(prisonerReadinessPathwayStatus)
  },
)

Then('The {string} tab is selected', async function (resettlementTab) {
  await resettlementOverviewPage.clickOnResettlementOverviewPathwayTab(resettlementTab)
  await expect(await resettlementOverviewPage.verifyResettlementOverviewPathwayTabName()).toEqual(resettlementTab)
})

Then('pathway status is changed to {string}', async function (pathwayStatus) {
  await resettlementOverviewPage.changePathwayStatus(pathwayStatus)
  // await pageFixture.page.waitForTimeout(1000)
})

Then('clicks on the License conditions link and the license conditions are displayed', async function () {
  console.log('Clicking on License conditions link')
  await resettlementOverviewPage.clickOnLicenseConditions()
})

Given(
  'clicks on the License conditions map and the license conditions map is displayed in a new tab',
  async function () {
    await resettlementOverviewPage.clickOnLicenseConditionsMapLink()
  },
)

Given('clicks on the standard licence condition link', async function () {
  await resettlementOverviewPage.clickOnStandardLicenceLink()
})

When(
  'I see the pathway status as {string} in the resettlement overview page for prisoner {string}',
  async function checkPathStatusAndPrisonerName(PathwayStatus, prisonerName) {
    const a = await resettlementOverviewPage.getPrisonerNameInResettlementOverviewPage()
    expect(a).toContain(prisonerName)
    const b = await resettlementOverviewPage.getResettlementPathwayStatus()
    expect(b).toEqual(PathwayStatus)
  },
)
