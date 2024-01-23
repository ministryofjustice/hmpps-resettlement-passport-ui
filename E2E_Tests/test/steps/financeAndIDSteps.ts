import { Given, setDefaultTimeout, When } from '@cucumber/cucumber'
import { pageFixture } from '../../hooks/pageFixtures'
import ResettlementOverviewPage from '../../pageObjects/resettlementOverviewPage'
import CommonPage from '../../pageObjects/commonPage'
import PrisonPage from '../../pageObjects/prisonPage'
import FinanceAndIDPage from '../../pageObjects/financeAndIDPage'
import { expect } from '@playwright/test'

setDefaultTimeout(50000)
let resettlementOverviewPage: ResettlementOverviewPage
let commonPage: CommonPage
let prisonPage: PrisonPage
let financeAndIDPage: FinanceAndIDPage
// await pageFixture.page.waitForTimeout(1000)
// console.log("here we dey now " + prisonerName)

Given(
  'The User navigates to the {string} Tab of the Resettlement Overview Page as Prisoner {string} in the Moorland Prison',
  async function (resettlementOverviewTab, prisonerName) {
    commonPage = new CommonPage(pageFixture.page)
    prisonPage = new PrisonPage(pageFixture.page)
    resettlementOverviewPage = new ResettlementOverviewPage(pageFixture.page)
    financeAndIDPage = new FinanceAndIDPage(pageFixture.page)
    await commonPage.logIn()
    await prisonPage.selectTimeToReleaseEntry('All prisoners')
    await prisonPage.clickOnApplyFilterButton()
    await prisonPage.enterPrisonerIntoPrisonerSearch(prisonerName)
    await prisonPage.clickOnApplyFilterButton()
    await prisonPage.clickAndViewAPrisoner(prisonerName)
    await resettlementOverviewPage.clickOnResettlementOverviewPathwayTab(resettlementOverviewTab)
  },
)

//Common

Given(
  'The submit button for the apply for bank account is selected and check your answers page is displayed',
  async function () {
    await financeAndIDPage.clickOnSubmitButton()
    await financeAndIDPage.verifyApplyForBankAccountCYAPageTitle()
  },
)

Given('The submit button is selected', async function () {
  await financeAndIDPage.clickOnSubmitButton()
})

Given(
  'The submit button for the assessment check page is selected and check your answers page is displayed',
  async function () {
    await financeAndIDPage.clickOnSubmitButton()
    await financeAndIDPage.verifyApplyForAssessmentCYAPageTitle()
  },
)
Given('The submit button for the assessment check page is selected', async function () {
  await financeAndIDPage.clickOnSubmitButton()
})

//Bank

Given(
  'the Application history of the Finance section of the Finance and ID Resettlement Overview page has the application re-submitted date of {string} and Application declined of {string} displayed',
  async function (applicationResubmittedDate, applicationRejectedDate) {
    await expect(
      await financeAndIDPage.getApplicationHistoryApplicationResubmittedEntryInFinanceSectionOfFinanceIDPage(),
    ).toEqual(applicationResubmittedDate)
    await expect(
      await financeAndIDPage.getApplicationHistoryApplicationResubmittedAccountRejectedDateEntryInFinanceSectionOfFinanceIDPage(),
    ).toEqual(applicationRejectedDate)
  },
)

Given(
  'the Application history of the Finance section of the Finance and ID Resettlement Overview page has the application re-submitted date of {string} and Application opened date of {string} displayed',
  async function (applicationResubmittedDate, applicationOpenedDate) {
    await expect(
      await financeAndIDPage.getApplicationHistoryApplicationResubmittedEntryInFinanceSectionOfFinanceIDPage(),
    ).toEqual(applicationResubmittedDate)
    await expect(
      await financeAndIDPage.getApplicationHistoryApplicationResubmittedAccountOpenedDateEntryInFinanceSectionOfFinanceIDPage(),
    ).toEqual(applicationOpenedDate)
  },
)

Given(
  'the Application history of the Finance section of the Finance and ID Resettlement Overview page has the application re-submitted date of {string} and Application status of {string} displayed',
  async function (applicationResubmittedDate, applicationOpenedDate) {
    await expect(
      await financeAndIDPage.getApplicationHistoryApplicationResubmittedEntryInFinanceSectionOfFinanceIDPage(),
    ).toEqual(applicationResubmittedDate)
    await expect(
      await financeAndIDPage.getApplicationHistoryApplicationResubmittedAccountRejectedDateEntryInFinanceSectionOfFinanceIDPage(),
    ).toEqual(applicationOpenedDate)
  },
)

Given(
  'The application resubmitted date of {string} status of {string} date account opened date of {string} and Added to personal items text of {string} is displayed in the resubmit bank account CYA page',
  async function (ApplicationResubmittedText, status, accountOpened, personalItems) {
    await expect(await financeAndIDPage.getBankApplicationReSubmittedCYAPageApplicationResubmittedText()).toEqual(
      ApplicationResubmittedText,
    )
    await expect(await financeAndIDPage.getBankApplicationReSubmittedCYAPageStatusText()).toEqual(status)
    await expect(await financeAndIDPage.getBankApplicationReSubmittedCYAPageDateAccountOpenedText()).toEqual(
      accountOpened,
    )
    await expect(await financeAndIDPage.getBankApplicationReSubmittedCYAPageAddedToPersonalItemsText()).toEqual(
      personalItems,
    )
  },
)

Given(
  'The application resubmitted date of {string} status of {string} date account rejected date of {string} is displayed in the resubmit bank account CYA page',
  async function (ApplicationResubmittedText, status, accountRejected) {
    await expect(await financeAndIDPage.getBankApplicationReSubmittedCYAPageApplicationResubmittedText()).toEqual(
      ApplicationResubmittedText,
    )
    await expect(await financeAndIDPage.getBankApplicationReSubmittedCYAPageStatusText()).toEqual(status)
    await expect(await financeAndIDPage.getBankApplicationReSubmittedCYAPageDateHeardBackText()).toEqual(
      accountRejected,
    )
  },
)

Given(
  'The application date heard back from resubmission date of {string} in the bank application resubmitted page is displayed',
  async function (applicationDate) {
    await financeAndIDPage.enterBankApplicationReSubmittedHeardBackDate(applicationDate)
  },
)

Given(
  'The application account opened date of {string} is entered and {string} selected for Added to personal items is selected and Personal items date {string} in the bank application resubmitted page is displayed',
  async function (applicationDate, personalItemsOption, personalItemsDate) {
    await financeAndIDPage.enterBankApplicationReSubmittedAccountOpenedDate(applicationDate)
    await financeAndIDPage.selectBankApplicationReSubmittedPersonalItemsOption(personalItemsOption, personalItemsDate)
  },
)

Given(
  'the change link for {string} is selected in the bank application resubmitted CYA page and the bank application resubmitted page is displayed',
  async function (idEntry) {
    await financeAndIDPage.clickOnChangeLinkInTheResubmittedBankApplicationCYAPage(idEntry)
  },
)

Given(
  'The application resubmitted date of {string} is entered and resubmitted application status of {string} is selected and additional questions for bank application resubmitted page is displayed',
  async function (applicationDate, status) {
    await financeAndIDPage.enterBankApplicationReSubmittedDate(applicationDate)
    await financeAndIDPage.selectBankApplicationStatus(status)
  },
)

Given(
  'The application resubmitted application status of {string} is selected and additional questions for bank application resubmitted page is displayed',
  async function (applicationDate, status) {
    await financeAndIDPage.selectBankApplicationStatus(status)
  },
)

Given(
  'the resubmit application button is selected and the bank application resubmitted page is displayed',
  async function () {
    await financeAndIDPage.clickOnResubmitApplication()
  },
)

Given(
  'The status of {string} and the date account opened date of {string} and Added to personal items of {string} is displayed in the bank account update application CYA page',
  async function (applicationStatus, applicationDate, personalItems) {
    if (applicationStatus === 'Account opened') {
      await expect(await financeAndIDPage.getBankApplicationUpdateCYAPageStatusText()).toEqual(applicationStatus)
      await expect(await financeAndIDPage.getBankApplicationUpdateCYAPageDateHeardBackText()).toEqual(applicationDate)
      await expect(
        await financeAndIDPage.getBankApplicationUpdateCYAPageAddedToPersonalItemsText(personalItems),
      ).toEqual(personalItems)
    } else {
      await expect(await financeAndIDPage.getBankApplicationUpdateCYAPageStatusText()).toEqual(applicationStatus)
      await expect(await financeAndIDPage.getBankApplicationUpdateCYAPageDateHeardBackText()).toEqual(applicationDate)
      await expect(
        await financeAndIDPage.getBankApplicationUpdateCYAPageAddedToPersonalItemsText(personalItems),
      ).toEqual(personalItems)
    }
  },
)

Given(
  '{string} selected for Added to personal items with date {string}',
  async function (personalItemSelection, personalItemDate) {
    await financeAndIDPage.selectBankApplicationUpdateStatusPersonalItem(personalItemSelection)
    await financeAndIDPage.enterBankApplicationUpdateStatusPersonalItemDate(personalItemDate)
  },
)

Given(
  'the bank application details response date of {string} is entered for status {string}',
  async function (applicationDate, applicationStatus) {
    if (applicationStatus === 'Account opened') {
      await financeAndIDPage.enterBankApplicationReceivedDate(applicationDate)
    } else {
      await financeAndIDPage.enterBankApplicationHeardBackDate(applicationDate)
    }
  },
)

Given(
  'the Application history of the Finance section of the Finance and ID Resettlement Overview page has the application submitted date of {string} and Application returned incomplete or inaccurate of {string} displayed',
  async function (applicationDate, applicationRefusedDate) {
    await expect(
      await financeAndIDPage.getApplicationHistoryApplicationSubmittedEntryInFinanceSectionOfFinanceIDPage(),
    ).toEqual(applicationDate)
    await expect(
      await financeAndIDPage.getApplicationHistoryResponseDatedEntryInFinanceSectionOfFinanceIDPage(),
    ).toEqual(applicationRefusedDate)
  },
)

When('The application history dropdown menu is selected', async function () {
  await financeAndIDPage.clickOnApplicationHistoryLink()
})

Given('The bank {string} is selected', async function (bankName) {
  await financeAndIDPage.selectBank(bankName)
})

Given('application submitted date of {string} is added to the application form', async function (applicationDate) {
  await financeAndIDPage.enterApplicationSubmittedDate(applicationDate)
})

Given(
  'The Apply for Bank Account error dialog page title is displayed with an error message above the {string} question as {string}',
  async function (applyForBankAccountQuestion, applyForBankAccountQuestionErrorText) {
    // await financeAndIDPage.verifyApplyForBankAccountPageTitleErrorIsDisplayed()
    expect(await financeAndIDPage.getApplyForBankAccountErrorText(applyForBankAccountQuestion)).toEqual(
      applyForBankAccountQuestionErrorText,
    )
  },
)

When('The Finance and ID Tab selected', async function () {
  await financeAndIDPage.clickOnFinanceAndIDTabViaFinancePage()
})

Given('The Finance and ID page is displayed via the Finance Page', async function () {
  await financeAndIDPage.verifyFinanceAndIdPageIsDisplayed()
})

Given('The user clicks on the finance link and the finance section is displayed', async function () {
  await financeAndIDPage.clickOnFinanceLink()
})

Given(
  'The user clicks on the Add a bank account application button and the Add bank accounts Page is displayed',
  async function () {
    await financeAndIDPage.clickOnAddABankAccountButton()
    await financeAndIDPage.verifyAddABankAccountPageIsDisplayed()
  },
)

Given('There are no existing {string} applications.', async function (financeApplication) {
  await financeAndIDPage.deleteAnyExistingApplication(financeApplication)
})

Given(
  'The bank {string} is selected and the application date of {string} is added to the application form',
  async function (bankName, applicationDate) {
    await financeAndIDPage.selectBank(bankName)
    await financeAndIDPage.enterApplicationSubmittedDate(applicationDate)
  },
)

Given(
  'the change link for the {string} is selected in the CYA page and the apply for bank account page is displayed',
  async function (changeLink) {
    await financeAndIDPage.clickOnBankChangeCYAPageLink(changeLink)
    await financeAndIDPage.verifyAddABankAccountPageIsDisplayed()
  },
)

Given(
  'The bank of {string} and the application submitted date of {string} are displayed in the Add Bank account CYA Page',
  async function (bankName, applicationDate) {
    expect(await financeAndIDPage.getBankDetailsEntryInCYABankAccountApplyPage()).toEqual(bankName)
    expect(await financeAndIDPage.getApplicationSubmittedEntryInCYABankAccountApplyPage()).toEqual(applicationDate)
  },
)

Given(
  'The confirm button for the apply for bank account is selected and the Finance tab of the resettlement Overview is displayed',
  async function () {
    await financeAndIDPage.clickOnConfirmBankAccountApplyButton()
    await financeAndIDPage.verifyFinanceAndIdPageIsDisplayed()
  },
)

Given('The Add a bank account application button is not present', async function () {
  await expect(await financeAndIDPage.checkAddBankAccountApplicationButtonIsPresent()).toEqual(false)
})

Given(
  'the Finance section of the Finance and ID Resettlement Overview page is populated with bank as {string} and the application submitted as of {string} and the status of {string} displayed',
  async function (bankName, applicationDate, bankApplicationStatus) {
    await expect(await financeAndIDPage.getBankDetailsEntryInFinanceSectionOfFinanceIDPage()).toEqual(bankName)
    await expect(await financeAndIDPage.getApplicationSubmittedEntryInFinanceSectionOfFinanceIDPage()).toEqual(
      applicationDate,
    )
    await expect(await financeAndIDPage.getStatusInFinanceSectionOfFinanceIDPage()).toEqual(bankApplicationStatus)
  },
)

Given(
  'the additional questions of the Finance section of the Finance and ID Resettlement Overview page is populated with Date account opened as {string} and date added to personal items of {string} is displayed',
  async function (applicationUpdateStatusDate, personalItemsDate) {
    await expect(await financeAndIDPage.getApplicationReturnedEntryInFinanceSectionOfFinanceIDPage()).toEqual(
      applicationUpdateStatusDate,
    )
    await expect(await financeAndIDPage.getPersonalItemsEntryInFinanceSectionOfFinanceIDPage('Yes')).toEqual(
      personalItemsDate,
    )
  },
)

Given(
  'the additional questions of the Finance section of the Finance and ID Resettlement Overview page is populated with Date account heard back as {string} and {string} selected for Added to personal items',
  async function (applicationUpdateStatusDate, personalItems) {
    await expect(await financeAndIDPage.getApplicationReturnedEntryInFinanceSectionOfFinanceIDPage()).toEqual(
      applicationUpdateStatusDate,
    )
    await expect(await financeAndIDPage.getPersonalItemsEntryInFinanceSectionOfFinanceIDPage(personalItems)).toEqual(
      personalItems,
    )
  },
)

Given('The bank application is deleted', async function () {
  await financeAndIDPage.deleteBankAccountApplication()
  // await expect(await financeAndIDPage.checkAddBankAccountApplicationButtonIsPresent()).toEqual(true);
})

Given(
  'The Finance and ID Tab with a bank application for bank {string} with application submitted date of {string} and status pending',
  async function (bank, applicationDate) {
    await financeAndIDPage.createABankAccountApplication(bank, applicationDate)
  },
)

Given(
  'The Finance and ID Tab with a bank application for bank {string} with application submitted date of {string} and the application has been returned as {string} on date heard back as {string}',
  async function (bank, applicationDate, applicationStatus, applicationReturnedDate) {
    await financeAndIDPage.deleteAnyExistingApplication('bank account')
    await financeAndIDPage.createABankAccountApplication(bank, applicationDate)
    await financeAndIDPage.clickOnUpdateApplicationButtonFinanceSection()
    await financeAndIDPage.selectApplicationStatus(applicationStatus)
    await financeAndIDPage.enterBankApplicationHeardBackDate(applicationReturnedDate)
    await financeAndIDPage.clickOnSubmitButton()
    await financeAndIDPage.clickOnConfirmBankAccountApplyButton()
    await financeAndIDPage.verifyFinanceAndIdPageIsDisplayed()
  },
)

Given(
  'the user clicks on the Update application button in the Finance section and the Apply for bank account update application status page is displayed',
  async function () {
    await financeAndIDPage.clickOnUpdateApplicationButtonFinanceSection()
  },
)

Given(
  'The bank application status of {string} is selected and additional fields are then displayed in the application status page',
  async function (applicationStatus) {
    await financeAndIDPage.selectApplicationStatus(applicationStatus)
  },
)

Given(
  'the bank application received response date of {string} is entered and {string} selected for Added to personal items with date {string} for Account Opened Status only',
  async function (applicationDate, personalItemSelection, personalItemDate) {
    await financeAndIDPage.enterBankApplicationReceivedDate(applicationDate)
    await financeAndIDPage.selectBankApplicationUpdateStatusPersonalItem(personalItemSelection)
    await financeAndIDPage.enterBankApplicationUpdateStatusPersonalItemDate(personalItemDate)
  },
)

Given(
  '{string} selected for Added to personal items with date {string}',
  async function (personalItemSelection, personalItemDate) {
    await financeAndIDPage.selectBankApplicationUpdateStatusPersonalItem(personalItemSelection)
    await financeAndIDPage.enterBankApplicationUpdateStatusPersonalItemDate(personalItemDate)
  },
)

Given(
  'the bank application rejected response date of {string} is entered for Non Account Opened Statuses',
  async function (applicationDate) {
    await financeAndIDPage.enterBankApplicationHeardBackDate(applicationDate)
  },
)

Given(
  'The application status of {string} is selected and the bank details response date of {string} is entered and {string} selected for Added to personal items with date {string}',
  async function (applicationStatus, applicationDate, personalItemSelection, personalItemDate) {
    if (applicationStatus === 'Account opened') {
      await financeAndIDPage.enterBankApplicationReceivedDate(applicationDate)
      await financeAndIDPage.selectBankApplicationUpdateStatusPersonalItem(personalItemSelection)
      await financeAndIDPage.enterBankApplicationUpdateStatusPersonalItemDate(personalItemDate)
    } else {
      await financeAndIDPage.enterBankApplicationHeardBackDate(applicationDate)
      await financeAndIDPage.selectBankApplicationUpdateStatusPersonalItem(personalItemSelection)
      await financeAndIDPage.enterBankApplicationUpdateStatusPersonalItemDate(personalItemDate)
    }
  },
)

Given('The submit button for the apply for bank account is selected', async function () {
  await financeAndIDPage.clickOnSubmitButton()
})

Given(
  'the change link for the {string} is selected in the apply for bank account update application status CYA page and the apply for bank account update application status page is displayed',
  async function (changeLink) {
    await financeAndIDPage.clickOnBankAccountApplicationStatusCYAPageChangeLink(changeLink)
  },
)

//ID Tests

Given('The user clicks on the ID Documents link and the ID documents section is displayed', async function () {
  await financeAndIDPage.clickOnIdDocumentLink()
})

Given(
  'The user clicks on the Add an ID application button and the Add ID Documents Page is displayed',
  async function () {
    await financeAndIDPage.clickOnAddAnIdButton()
    await financeAndIDPage.verifyAddAnIdApplicationPageIsDisplayed()
  },
)

Given(
  'The ID type {string} is selected and the application submitted date of {string} is added to the application form',
  async function (idType, applicationDate) {
    await financeAndIDPage.selectIDType(idType)
    await financeAndIDPage.enterApplicationRequestedDate(applicationDate)
  },
)

Given('The ID type {string} is selected in the apply for ID page', async function (idType) {
  await financeAndIDPage.selectIDType(idType)
})

Given(
  'The submit button for the apply for ID page is selected and the additional ID questions page is displayed',
  async function () {
    await financeAndIDPage.clickOnSubmitButton()
    await financeAndIDPage.verifyAdditionalIDInformationPageTitle()
  },
)

Given(
  'In the additional ID questions page the user enters {string} to GRO number {string} to UK national born overseas born in {string} country {string} to priority application and {string} to cost of application',
  async function (groNumber, ukNational, country, priorityApplication, applicationCost) {
    await financeAndIDPage.selectHaveGROOption(groNumber)
    await financeAndIDPage.selectUkNationalBornOverseas(ukNational)
    await financeAndIDPage.enterUKNationalBornOverseasCountry(country)
    await financeAndIDPage.selectApplicationPriority(priorityApplication)
    await financeAndIDPage.enterApplicationCost(applicationCost)
  },
)

Given(
  'A {string} ID application with application submitted date of {string} GRO number {string} UK National {string} UK National BornOverseas Country {string} Priority application {string} cost of {string}',
  async function (idType, applicationDate, groNumber, ukNational, country, priorityApplication, applicationCost) {
    if (
      idType === 'Birth certificate' ||
      idType === 'Replacement marriage certificate' ||
      idType === 'Replacement civil partnership certificate' ||
      idType === 'Adoption certificate'
    ) {
      await financeAndIDPage.selectIDType(idType)
      await financeAndIDPage.enterApplicationRequestedDate(applicationDate)
      await financeAndIDPage.clickOnSubmitButton()
      await financeAndIDPage.enterBirthCertificateSpecificQuestionAnswer(
        groNumber,
        ukNational,
        country,
        priorityApplication,
        applicationCost,
      )
    }
    if (idType === 'Biometric residence permit' || idType === 'Deed poll certificate') {
      await financeAndIDPage.selectIDType(idType)
      await financeAndIDPage.enterApplicationRequestedDate(applicationDate)
      await financeAndIDPage.clickOnSubmitButton()
      await financeAndIDPage.enterApplicationCost(applicationCost)
      await financeAndIDPage.clickOnSubmitButton()
      await financeAndIDPage.clickOnConfirmBankAccountApplyButton()
    }
    if (idType === 'National Insurance Number letter') {
      await financeAndIDPage.selectIDType(idType)
      await financeAndIDPage.enterApplicationRequestedDate(applicationDate)
      await financeAndIDPage.clickOnSubmitButton()
      await financeAndIDPage.clickOnConfirmBankAccountApplyButton()
    }
  },
)

Given('In the additional ID questions page the user enters {string} to GRO number', async function (groNumber) {
  await financeAndIDPage.selectHaveGROOption(groNumber)
})

Given(
  'In the additional ID questions page the user enters {string} to UK national born overseas with country {string}',
  async function (ukNational, country) {
    await financeAndIDPage.selectUkNationalBornOverseas(ukNational)
    await financeAndIDPage.enterUKNationalBornOverseasCountry(country)
  },
)

Given(
  'In the additional ID questions page the user enters {string} to priority application',
  async function (priorityApplication) {
    await financeAndIDPage.selectApplicationPriority(priorityApplication)
  },
)

Given(
  'In the additional ID questions page the user enters {string} to UK national born overseas',
  async function (ukNational) {
    await financeAndIDPage.selectUkNationalBornOverseas(ukNational)
  },
)

Given(
  'In the additional ID questions page the user enters {string} to cost of application',
  async function (applicationCost) {
    await financeAndIDPage.enterApplicationCost(applicationCost)
  },
)

Given(
  'The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed',
  async function () {
    await financeAndIDPage.clickOnSubmitButton()
  },
)

Given('The submit button for the apply for ID documents Additional Question page is selected', async function () {
  await financeAndIDPage.clickOnSubmitButton()
})

Given(
  'The type of {string} application submitted date of {string} GRO number {string} UK National {string} Priority application {string} cost of {string} are displayed in the ID CYA Page',
  async function (idType, applicationSubmitted, groNumber, ukNational, priorityNumber, applicationCost) {
    await expect(await financeAndIDPage.getIDTypeTextInIdCYAPage()).toEqual(idType)
    await expect(await financeAndIDPage.getApplicationSubmittedTextInIdCYAPage()).toEqual(applicationSubmitted)
    await expect(await financeAndIDPage.getGroNumberTextInIdCYAPage()).toEqual(groNumber)
    await expect(await financeAndIDPage.getUkNationalTextInIdCYAPage()).toEqual(ukNational)
    await expect(await financeAndIDPage.getPriorityNumberTextInIdCYAPage()).toEqual(priorityNumber)
    await expect(await financeAndIDPage.getApplicationCostTextInIdCYAPage()).toEqual(applicationCost)
  },
)

Given(
  'The type of {string} application submitted date of {string} GRO number {string} Priority application {string} cost of {string} are displayed in the ID CYA Page',
  async function (idType, applicationSubmitted, groNumber, priorityNumber, applicationCost) {
    await expect(await financeAndIDPage.getIDTypeTextInIdCYAPage()).toEqual(idType)
    await expect(await financeAndIDPage.getApplicationSubmittedTextInIdCYAPage()).toEqual(applicationSubmitted)
    await expect(await financeAndIDPage.getGroNumberTextInIdCYAPage()).toEqual(groNumber)
    await expect(await financeAndIDPage.getPriorityNumberTextInIdCYAPage()).toEqual(priorityNumber)
    await expect(await financeAndIDPage.getApplicationCostTextInIdCYAPage()).toEqual(applicationCost)
  },
)

Given(
  'The type of {string} application submitted date of {string} Case Number {string} Court Details {string} and cost of {string} are displayed in the ID CYA Page',
  async function (idType, applicationSubmitted, caseNumber, courtDetails, applicationCost) {
    await expect(await financeAndIDPage.getIDTypeTextInIdCYAPage()).toEqual(idType)
    await expect(await financeAndIDPage.getApplicationSubmittedTextInIdCYAPage()).toEqual(applicationSubmitted)
    await expect(await financeAndIDPage.getApplicationDivorceCaseNumberTextInIdCYAPage()).toEqual(caseNumber)
    await expect(await financeAndIDPage.getApplicationDivorceCourtDetailsTextInIdCYAPage()).toEqual(courtDetails)
    await expect(await financeAndIDPage.getApplicationCostTextInIdCYAPage()).toEqual(applicationCost)
  },
)

Given(
  'The confirm button for the apply for ID application is selected and the Finance tab of the resettlement Overview is displayed',
  async function () {
    await financeAndIDPage.clickOnConfirmBankAccountApplyButton()
  },
)

Given(
  'The type of {string} application submitted date of {string} GRO number {string} UK National {string} Priority application {string} cost of {string} are displayed in the ID section of the Finance and ID Resettlement Overview Page',
  async function (idType, applicationSubmitted, groNumber, ukNational, priorityNumber, applicationCost) {
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Type')).toEqual(idType)
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Application submitted')).toEqual(
      applicationSubmitted,
    )
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('GRO number')).toEqual(groNumber)
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('UK national')).toEqual(ukNational)
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Priority application')).toEqual(
      priorityNumber,
    )
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Cost')).toEqual(applicationCost)
  },
)

Given(
  'The type of {string} application submitted date of {string} GRO number {string} Priority application {string} cost of {string} are displayed in the ID section of the Finance and ID Resettlement Overview Page',
  async function (idType, applicationSubmitted, groNumber, priorityNumber, applicationCost) {
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Type')).toEqual(idType)
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Application submitted')).toEqual(
      applicationSubmitted,
    )
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('GRO number')).toEqual(groNumber)
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Priority application')).toEqual(
      priorityNumber,
    )
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Cost')).toEqual(applicationCost)
  },
)

Given(
  'The type of {string} application submitted date of {string} are displayed in the ID section of the Finance and ID Resettlement Overview Page',
  async function (idType, applicationSubmitted) {
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Type')).toEqual(idType)
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Application submitted')).toEqual(
      applicationSubmitted,
    )
  },
)

Given(
  'In the additional ID Divorce decree questions page the user enters {string} to Case Number {string} to Court Details and {string} to cost of application',
  async function (caseNumber, courtDetails, applicationCost) {
    await financeAndIDPage.enterDivorceCaseNumber(caseNumber)
    await financeAndIDPage.enterDivorceCourtDetails(courtDetails)
    await financeAndIDPage.enterApplicationCost(applicationCost)
  },
)

Given(
  'In the additional ID Divorce decree questions page the user enters {string} to Case Number',
  async function (caseNumber) {
    await financeAndIDPage.enterDivorceCaseNumber(caseNumber)
  },
)

Given(
  'In the additional ID Divorce decree questions page the user enters {string} to Court Details',
  async function (courtDetails) {
    await financeAndIDPage.enterDivorceCourtDetails(courtDetails)
  },
)

Given(
  'In the additional ID Divorce decree questions page the user enters {string} to cost of application',
  async function (applicationCost) {
    await financeAndIDPage.enterApplicationCost(applicationCost)
  },
)

Given(
  'The type of {string} application submitted date of {string} Case Number {string} Court Details {string} and cost of {string} are displayed in the ID section of the Finance and ID Resettlement Overview Page',
  async function (idType, applicationSubmitted, caseNumber, courtDetails, applicationCost) {
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Type')).toEqual(idType)
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Application submitted')).toEqual(
      applicationSubmitted,
    )
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Case number')).toEqual(caseNumber)
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Court details')).toEqual(courtDetails)
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Cost')).toEqual(applicationCost)
  },
)

Given(
  'In the additional ID Driving license questions page the user selects {string} to Driving license type {string} to Application made and {string} to cost of application',
  async function (drivingLicenseType, drivingLicenseLocation, applicationCost) {
    await financeAndIDPage.selectDrivingLicenseType(drivingLicenseType)
    await financeAndIDPage.selectApplicationMadeLocation(drivingLicenseLocation)
    await financeAndIDPage.enterApplicationCost(applicationCost)
  },
)

Given(
  'In the additional ID Driving license questions page the user selects {string} to Driving license type',
  async function (drivingLicenseType) {
    await financeAndIDPage.selectDrivingLicenseType(drivingLicenseType)
  },
)
Given(
  'In the additional ID Driving license questions page the user selects {string} to Application made',
  async function (drivingLicenseLocation) {
    await financeAndIDPage.selectApplicationMadeLocation(drivingLicenseLocation)
  },
)
Given(
  'In the additional ID Driving license questions page the user selects {string} to cost of application',
  async function (applicationCost) {
    await financeAndIDPage.enterApplicationCost(applicationCost)
  },
)

Given(
  'The type of {string} application submitted date of {string} Driving license type {string} to Driving license Application {string} and cost of {string} are displayed in the ID CYA Page',
  async function (idType, applicationSubmitted, drivingLicenseType, drivingLicenseLocation, applicationCost) {
    await expect(await financeAndIDPage.getIDTypeTextInIdCYAPage()).toEqual(idType)
    await expect(await financeAndIDPage.getApplicationSubmittedTextInIdCYAPage()).toEqual(applicationSubmitted)
    await expect(await financeAndIDPage.getApplicationDrivingLicenseTypeTextInIdCYAPage()).toEqual(drivingLicenseType)
    await expect(await financeAndIDPage.getApplicationDrivingLicenseApplicationLocationInIdCYAPage()).toEqual(
      drivingLicenseLocation,
    )
    await expect(await financeAndIDPage.getApplicationCostTextInIdCYAPage()).toEqual(applicationCost)
  },
)

Given(
  'The type of {string} application submitted date of {string} Driving license type {string} to Driving license Application {string} and cost of {string} are displayed in the ID section of the Finance and ID Resettlement Overview Page',
  async function (idType, applicationSubmitted, drivingLicenseType, drivingLicenseLocation, applicationCost) {
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Type')).toEqual(idType)
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Application submitted')).toEqual(
      applicationSubmitted,
    )
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('License type')).toEqual(
      drivingLicenseType,
    )
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('License location')).toEqual(
      drivingLicenseLocation,
    )
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Cost')).toEqual(applicationCost)
  },
)

// Given('In the additional ID questions page the user enters {string} to cost of application', async function (applicationCost) {
//     await financeAndIDPage.enterApplicationCost(applicationCost)
// });

Given(
  'The type of {string} application submitted date of {string} and cost of {string} are displayed in the ID CYA Page',
  async function (idType, applicationSubmitted, applicationCost) {
    await expect(await financeAndIDPage.getIDTypeTextInIdCYAPage()).toEqual(idType)
    await expect(await financeAndIDPage.getApplicationSubmittedTextInIdCYAPage()).toEqual(applicationSubmitted)
    await expect(await financeAndIDPage.getApplicationCostTextInIdCYAPage()).toEqual(applicationCost)
  },
)

Given(
  'The type of {string} application submitted date of {string} are displayed in the ID CYA Page',
  async function (idType, applicationSubmitted) {
    await expect(await financeAndIDPage.getIDTypeTextInIdCYAPage()).toEqual(idType)
    await expect(await financeAndIDPage.getApplicationSubmittedTextInIdCYAPage()).toEqual(applicationSubmitted)
  },
)

Given(
  'The type of {string} application submitted date of {string} and cost of {string} are displayed in the ID section of the Finance and ID Resettlement Overview Page',
  async function (idType, applicationSubmitted, applicationCost) {
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Type')).toEqual(idType)
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Application submitted')).toEqual(
      applicationSubmitted,
    )
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Cost')).toEqual(applicationCost)
  },
)

Given(
  'The type of {string} application submitted date of {string} and application status of {string} are displayed in the ID section of the Finance and ID Resettlement Overview Page',
  async function (idType, applicationSubmitted, applicationStatus) {
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Type')).toEqual(idType)
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Application submitted')).toEqual(
      applicationSubmitted,
    )
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Application status')).toEqual(
      applicationStatus,
    )
  },
)

Given(
  'the change link for {string} is selected in the check your answers page and the Apply for ID application status page is displayed',
  async function (changeLink) {
    await financeAndIDPage.clickOnChangeLinkInIDCYAPage(changeLink)
  },
)

//Assessment Tests

Given(
  'The user clicks on the finance and ID assessment link and the finance and id assessment section is displayed',
  async function () {
    await financeAndIDPage.clickOnFinanceAndIDAssessmentLink()
  },
)

Given(
  'The text {string} is displayed in the Assessment section of the finance and ID Tab',
  async function (assessmentText) {
    await expect(await financeAndIDPage.getAssessmentText()).toEqual(assessmentText)
  },
)

Given(
  'The user clicks on the complete assessment now link and the Finance and ID Assessment Page is displayed',
  async function () {
    await financeAndIDPage.clickOnCompleteAssessmentNowLink()
  },
)

Given(
  'assessment date of {string} Required Bank Account {string} Require ID {string} and Current ID of type of {string} is selected',
  async function (assessmentDate, assessmentHaveBankAccount, assessmentHaveID, assessmentID) {
    await financeAndIDPage.enterAssessmentDate(assessmentDate)
    await financeAndIDPage.selectAssessmentRequireABankAccountOption(assessmentHaveBankAccount)
    await financeAndIDPage.selectAssessmentRequireAnID(assessmentHaveID)
    await financeAndIDPage.AssessmentSelectID(assessmentID)
  },
)

Given('The ID of type of {string} is selected', async function (assessmentID) {
  await financeAndIDPage.AssessmentSelectID(assessmentID)
})

Given(
  'assessment date of {string} Required Bank Account {string} Require ID {string} and Existing ID of {string} are displayed in the Assessment CYA page',
  async function (assessmentDate, assessmentHaveBankAccount, assessmentHaveID, assessmentID) {
    expect(await financeAndIDPage.verifyAssessmentDateTextInCYAPage()).toEqual(assessmentDate)
    expect(await financeAndIDPage.verifyAssessmentRequireABankAccountOptionTextInCYAPage()).toEqual(
      assessmentHaveBankAccount,
    )
    expect(await financeAndIDPage.verifyAssessmentRequireAnIDTextInCYAPage()).toEqual(assessmentHaveID)
    expect(await financeAndIDPage.verifyAssessmentSelectIDTextInCYAPage()).toContain(assessmentID)
  },
)

Given(
  'the change link for the {string} is selected in the Assessment CYA page and the Apply for Finance and ID Assessment Page is displayed',
  async function (changeLink) {
    await financeAndIDPage.selectingAssessmentCYAPageChangeLink(changeLink)
  },
)

Given(
  'The Finance and ID assessment section of the Finance and ID Tab has assessment date of {string} Required Bank Account {string} Require ID {string} and Existing ID of {string} displayed',
  async function (assessmentDate, assessmentRequireABankAccount, assessmentRequireAnID, assessmentExistingID) {
    expect(await financeAndIDPage.verifyAssessmentEntriesInFinanceAndIDAssessmentPage('Date of assessment')).toEqual(
      assessmentDate,
    )
    expect(
      await financeAndIDPage.verifyAssessmentEntriesInFinanceAndIDAssessmentPage('Requires a bank account application'),
    ).toEqual(assessmentRequireABankAccount)
    expect(
      await financeAndIDPage.verifyAssessmentEntriesInFinanceAndIDAssessmentPage('Requires an ID application'),
    ).toEqual(assessmentRequireAnID)
    expect(await financeAndIDPage.verifyAssessmentEntriesInFinanceAndIDAssessmentPage('Existing ID')).toEqual(
      assessmentExistingID,
    )
  },
)

Given('The finance and ID assessment is deleted', async function () {
  await financeAndIDPage.deleteAssessment()
})

Given('all ID types except Birth certificate is selected', async function () {
  await financeAndIDPage.AssessmentSelectID('Marriage Certificate')
  await financeAndIDPage.AssessmentSelectID('Civil Partnership')
  await financeAndIDPage.AssessmentSelectID('Adoption certificate')
  await financeAndIDPage.AssessmentSelectID('Divorce')
  await financeAndIDPage.AssessmentSelectID('Driving License')
  await financeAndIDPage.AssessmentSelectID('BRP')
  await financeAndIDPage.AssessmentSelectID('Deed Poll')
})

Given('the date of assessment date of {string} is entered', async function (assessmentDate) {
  await financeAndIDPage.enterAssessmentDate(assessmentDate)
})

Given('the bank account application of {string} is selected', async function (assessmentHaveBankAccount) {
  await financeAndIDPage.selectAssessmentRequireABankAccountOption(assessmentHaveBankAccount)
})

Given('the require an ID application of {string} is selected', async function (assessmentHaveID) {
  await financeAndIDPage.selectAssessmentRequireAnID(assessmentHaveID)
})

Given('all ID selection options are selected', async function () {
  await financeAndIDPage.AssessmentSelectID('All')
})

Given(
  'an error dialog page title is displayed with an error message above the {string} question as {string}',
  async function (assessmentQuestion, assessmentQuestionErrorMessage) {
    // await financeAndIDPage.verifyFinanceAndIDAssessmentErrorIsDisplayed()
    expect(await financeAndIDPage.verifyFinanceAndIDAssessmentQuestionErrorTitle(assessmentQuestion)).toEqual(
      assessmentQuestionErrorMessage,
    )
  },
)

Given(
  'an ID error dialog page title is displayed with an error message above the {string} question as {string}',
  async function (assessmentQuestion, assessmentQuestionErrorMessage) {
    // await financeAndIDPage.verifyFinanceAndIDAssessmentErrorIsDisplayed()
    expect(await financeAndIDPage.verifyIDRouteQuestionsErrorTitles(assessmentQuestion)).toEqual(
      assessmentQuestionErrorMessage,
    )
  },
)

Given(
  'A birth certificate ID application with application submitted date of {string} GRO number {string} UK National {string} with country {string} Priority application {string} cost of {string}',
  async function (applicationDate, groNumber, ukNational, country, priorityApplication, applicationCost) {
    await financeAndIDPage.deleteAnyExistingApplication('ID')
    await financeAndIDPage.clickOnAddAnIdButton()
    await financeAndIDPage.verifyAddAnIdApplicationPageIsDisplayed()
    await financeAndIDPage.selectIDType('birth-certificate')
    await financeAndIDPage.enterApplicationRequestedDate(applicationDate)
    await financeAndIDPage.clickOnSubmitButton()
    await financeAndIDPage.verifyAdditionalIDInformationPageTitle()
    await financeAndIDPage.enterBirthCertificateSpecificQuestionAnswer(
      groNumber,
      ukNational,
      country,
      priorityApplication,
      applicationCost,
    )
  },
)

Given('the Id application is deleted', async function () {
  await financeAndIDPage.deleteAnyExistingApplication('ID')
})

Given('the update application button is selected and the update ID Application page is displayed', async function () {
  await pageFixture.page.waitForTimeout(2000)
  await financeAndIDPage.selectUpdateApplicationButton()
})

Given('the application status of {string} is selected', async function (applicationStatus) {
  await financeAndIDPage.selectUpdateApplicationStatus(applicationStatus)
})

Given(
  'The application ID received date of {string} is entered and personal item of {string} and date added to personal items {string} in the update ID Application page',
  async function (idReceivedDate, personalItemOption, personalItemsDate) {
    await financeAndIDPage.enterUpdateApplicationDateIdReceivedDate(idReceivedDate)
    await financeAndIDPage.selectUpdateApplicationPersonalItem(personalItemOption)
    await financeAndIDPage.enterUpdateApplicationPersonalItemDate(personalItemsDate)
  },
)

Given(
  'The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed',
  async function () {
    await financeAndIDPage.clickOnSubmitButton()
  },
)

Given(
  'the change link for {string} is selected in the update application CYA page and the Update ID application status page is displayed',
  async function (changeLink) {
    await financeAndIDPage.clickOnChangeLinkInUpdateIDApplicationCYAPage(changeLink)
  },
)

Given(
  'The application status of {string} date ID received of {string} and the date added to personal item of {string} are displayed in the updated ID CYA Page',
  async function (applicationStatus, applicationDateIdReceived, personalItems) {
    await pageFixture.page.waitForTimeout(1000)
    await expect(await financeAndIDPage.getApplicationStatusTextInIdCYAPage()).toEqual(applicationStatus)
    await expect(await financeAndIDPage.getDateIdReceivedTextInIdCYAPage()).toEqual(applicationDateIdReceived)
    //This personal item needs a unique id done by the dev hence commented out
    // await expect(await financeAndIDPage.getAddedToPersonalItemTextInIdCYAPage(personalItems)).toEqual(personalItems);
  },
)

Given(
  'The application status of {string} and application refund amount of date ID received of {string} are displayed in the updated ID CYA Page',
  async function (applicationStatus, applicationRefundAmount) {
    await expect(await financeAndIDPage.getApplicationStatusTextInIdCYAPage()).toEqual(applicationStatus)
    await expect(await financeAndIDPage.getApplicationRefundTextInIdCYAPage()).toEqual(applicationRefundAmount)
  },
)

Given('The application status of {string} is displayed in the updated ID CYA Page', async function (applicationStatus) {
  await expect(await financeAndIDPage.getApplicationStatusTextInIdCYAPage()).toEqual(applicationStatus)
})

Given(
  'application status of {string} date ID received date of {string} and Added to Personal Items {string} are also displayed in the ID section of the Finance and ID Resettlement Overview Page',
  async function (applicationStatus, applicationDateIdReceived, personalItems) {
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Application status')).toEqual(
      applicationStatus,
    )
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Date ID received')).toEqual(
      applicationDateIdReceived,
    )
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Added to personal items')).toEqual(
      personalItems,
    )
  },
)

Given(
  'application status of {string} date ID received date of {string} are also displayed in the ID section of the Finance and ID Resettlement Overview Page',
  async function (applicationStatus, applicationDateIdReceived) {
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Application status')).toEqual(
      applicationStatus,
    )
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Date ID received')).toEqual(
      applicationDateIdReceived,
    )
  },
)

Given(
  'application status of {string} and application refund of {string} are also displayed in the ID section of the Finance and ID Resettlement Overview Page',
  async function (applicationStatus, applicationRefundAmount) {
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Application status')).toEqual(
      applicationStatus,
    )
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Refund Amount')).toEqual(
      applicationRefundAmount,
    )
  },
)

Given(
  'application status of {string} is also displayed in the ID section of the Finance and ID Resettlement Overview Page',
  async function (applicationStatus) {
    expect(await financeAndIDPage.verifyIdEntriesInFinanceAndIDAssessmentPage('Application status')).toEqual(
      applicationStatus,
    )
  },
)

Given(
  'The application refund amount of {string} is entered in the update ID Application page',
  async function (refundAmount) {
    await financeAndIDPage.enterUpdateApplicationRefundAmount(refundAmount)
  },
)

Given(
  'The total number of ID applications in the ID section of the Finance and ID tab is {string}',
  async function (totalNumberOfIDApplications) {
    expect(await financeAndIDPage.getTotalNumberOfIdApplicationsInFinanceOverviewTab()).toEqual(
      parseInt(totalNumberOfIDApplications),
    )
  },
)

Given(
  'For ID entry {string} with name {string} has ID application type of {string} is displayed in the ID section of the Finance and ID Resettlement Overview Page',
  async function (entryNumber, idEntryName, idtype) {
    expect(await financeAndIDPage.returnIdNumberTextForIdEntryInFinanceIDTab(entryNumber)).toEqual(idEntryName)
    expect(await financeAndIDPage.returnTypeForIdEntryInFinanceIDTab(entryNumber)).toEqual(idtype)
  },
)
