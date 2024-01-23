import { expect, Page } from '@playwright/test'
import { pageFixture } from '../hooks/pageFixtures'

export default class FinanceAndIDTab {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  private FinanceAndIDPageTitleElements = {
    FinanceAndIDAssessmentQuestionPageTitle: 'Prepare someone for release - Finance and ID',
    FinanceAndIDAssessmentQuestionPageErrorTitle: 'Prepare someone for release - Finance and ID',
    AssessmentCheckCYAPageTitle: 'Prepare someone for release - Finance and ID',

    FinanceAndIDPageTitle: 'Prepare someone for release - Finance and ID',
    AddABankAccountPageTitle: 'Prepare someone for release - Finance and ID - Add a bank account application',
    AddABankAccountCYAPageTitle: 'Prepare someone for release - Finance and ID - Add a bank account application',
    ApplyForABankAccountPageErrorTitle: 'Prepare someone for release - Finance and ID - Add a bank account application',

    ApplyForAnIDPageTitle: 'Prepare someone for release - Finance and ID - Add an ID application',
    AdditionalIDInformationPageTitle: 'Prepare someone for release - Finance and ID - Add an ID application',
  }

  private FinancePageElements = {
    FinanceAndIDResettlementOverviewTabViaFinancePage: "//a[normalize-space()='Finance and ID']",
    FinanceAndIDAssessmentTreeLink: "//a[normalize-space()='Finance and ID assessment']",
    IDDocumentsTreeLink: "//a[normalize-space()='ID']",
    FinanceTreeLink: "//a[normalize-space()='Finance']",

    // Assessment Elements
    FinanceAndIDCompleteAssessmentImportantText: "//p[@class='govuk-notification-banner__heading']",
    FinanceAndIDCompleteAssessmentLink: "//a[normalize-space()='Complete assessment now']",
    financeAssessmentDate: "//input[@id='dateAssessmentDay']",
    financeAssessmentMonth: "//input[@id='dateAssessmentMonth']",
    financeAssessmentYear: "//input[@id='dateAssessmentYear']",
    financeAssessmentRequireBankAccountYes: "//input[@id='bankRequiredYes']",
    financeAssessmentRequireBankAccountNo: "//input[@id='bankRequiredNo']",
    financeAssessmentRequireIDYes: "//input[@id='idRequiredYes']",
    financeAssessmentRequireIDNo: "//input[@id='idRequiredNo']",
    financeAssessmentBirthCertificateOption: "//input[@id='existingIdBirthCertificate']",
    financeAssessmentMarriageCertificateOption: "//input[@id='existingIdMarriageCertificate']",
    financeAssessmentCivilPartnershipOption: "//input[@id='existingIdCivilPartnershipCertificate']",
    financeAssessmentAdoptionOption: "//input[@id='existingIdAdoptionCertificate']",
    financeAssessmentDivorceOption: "//input[@id='existingIdDivorceDecreeAbsoluteCertificate']",
    financeAssessmentDrivingLicenseOption: "//input[@id='existingIdDrivingLicence']",
    financeAssessmentBRPOption: "//input[@id='existingIdBiometricResidencePermit']",
    financeAssessmentDeedPollOption: "//input[@id='existingIdDeedPollCertificate']",

    assessmentApplicationSubmittedQuestionErrorText:
      "//label[normalize-space()='Application submitted']/parent::div/div",
    assessmentDateOfAssessmentQuestionErrorText: "//label[@for='type']/parent::div/div[1]",
    assessmentRequiresBankAccountQuestionErrorText:
      "//h3[normalize-space()='Finance and ID assessment']/parent::div/form/div[2]/fieldset/p",
    assessmentRequiresAnIDQuestionErrorText:
      "//h3[normalize-space()='Finance and ID assessment']/parent::div/form/div[3]/fieldset/p",

    assessmentDateOfAssessmentCYAChangeLink: "//dt[normalize-space()='Date of assessment']/parent::div/dd/a",
    assessmentRequiresBankAccountCYAChangeLink:
      "//dt[normalize-space()='Requires a bank account application']/parent::div/dd/a",
    assessmentRequiresAnIDCYAChangeLink: "//dt[normalize-space()='Requires an ID application']/parent::div/dd/a",
    assessmentExistingIDCYAChangeLink: "//dt[normalize-space()='Existing ID']/parent::div/dd/a",

    assessmentDateOfAssessmentCYAPageText: "//dt[normalize-space()='Date of assessment']/parent::div/dd[1]",
    assessmentRequiresBankAccountCYAPageText:
      "//dt[normalize-space()='Requires a bank account application']/parent::div/dd[1]",
    assessmentRequiresAnIDCYAPageText: "//dt[normalize-space()='Requires an ID application']/parent::div/dd[1]",
    assessmentExistingIDCYAPageText: "//dt[normalize-space()='Existing ID']/parent::div/dd[1]",

    assessmentDateOfAssessmentInFinanceAndIDAssessmentSectionText:
      "//th[normalize-space()='Date of assessment']/parent::tr/td[1]",
    assessmentRequiresBankAccountInFinanceAndIDAssessmentSectionText:
      "//th[normalize-space()='Requires a bank account application']/parent::tr/td[1]",
    assessmentRequiresAnIDInFinanceAndIDAssessmentSectionText:
      "//th[normalize-space()='Requires an ID application']/parent::tr/td[1]",
    assessmentExistingIDInFinanceAndIDAssessmentSectionText: "//th[normalize-space()='Existing ID']/parent::tr/td[1]",

    deleteAssessmentInFinanceAndIDAssessmentSection:
      "//h3[normalize-space()='Finance and ID assessment']/parent::header/parent::section/div/button",
    confirmDeleteAssessmentInFinanceAndIDAssessmentSection: "//button[normalize-space()='Confirm delete assessment']",

    // Bank Elements
    addABankAccountApplicationButton: "//section[@id='finance']/header/span/a",

    selectBank: "//select[@id='bank']",
    applicationSubmittedDate: "//input[@id='applicationSubmittedDay']",
    applicationSubmittedMonth: "//input[@id='applicationSubmittedMonth']",
    applicationSubmittedYear: "//input[@id='applicationSubmittedYear']",
    submitBankAccountButton: "//button[normalize-space()='Submit']",
    selectApplyForBankAccountPageBankErrorText: "//label[normalize-space()='Bank']/parent::div/p",
    applicationSubmittedDateApplyForBankAccountPageBankErrorText:
      "//label[normalize-space()='Application submitted']/parent::div/div[1]",

    bankCYAChangeLink: "//dt[normalize-space()='Bank']/parent::div/dd/a",
    bankApplicationSubmittedCYAChangeLink: "//dt[normalize-space()='Application submitted']/parent::div/dd/a",

    bankCYAEntry: "//div[@class='govuk-grid-column-three-quarters']//div[1]/dd[1]",
    bankApplicationSubmittedCYAEntry: "//div[@class='govuk-grid-column-three-quarters']//div[2]/dd[1]",

    confirmBankAccountCYAButton: "//button[normalize-space()='Confirm']",

    // Bank Section of the Resettlement Overview Page
    bankFinanceSectionEntry: "//section[@id='finance']/div/div/div/table/tbody/tr[1]/td",
    bankApplicationSubmittedFinanceSectionEntry: "//section[@id='finance']/div/div/div/table/tbody/tr[2]/td",
    bankStatusFinanceSectionEntry: "//section[@id='finance']/div/div/div/table/tbody/tr[3]/td",

    // Update Bank Application
    bankApplicationUpdateApplicationButton: "//section[@id='finance']/div/div/div/a/button",
    bankApplicationStatus: "//select[@id='status']",
    bankAccountReceivedDay: "//input[@id='accountOpenedDay']",
    bankApplicationReceivedMonth: "//input[@id='accountOpenedMonth']",
    bankApplicationReceivedYear: "//input[@id='accountOpenedYear']",
    bankApplicationHeardBackDay: "//input[@id='heardBackDay']",
    bankApplicationHeardBackMonth: "//input[@id='heardBackMonth']",
    bankApplicationHeardBackYear: "//input[@id='heardBackYear']",
    yesPersonalItemOption: "//input[@id='added-to-items-yes']",
    noPersonalItemOption: "//input[@id='added-to-items-no']",
    personalItemDate: "//input[@id='day']",
    personalItemMonth: "//input[@id='month']",
    personalItemYear: "//input[@id='year']",

    dateAccountOpenedUpdateBankAccountPageBankErrorText:
      "//label[normalize-space()='Date account opened']/parent::div/div[1]",
    dateHeardBackUpdateBankAccountPageBankErrorText:
      "//label[normalize-space()='Date heard back from application']/parent::div/div[1]",
    addedToPersonalItemsUpdateBankAccountPageBankErrorText:
      "//label[normalize-space()='Added to personal items']/parent::fieldset/p",
    yesOptionOfAddedToPersonalItemsUpdateBankAccountPageBankErrorText:
      "//label[normalize-space()='Date added']/parent::div/div[1]",

    bankApplicationUpdateStatusCYAChangeLink:
      "//dl[@class='govuk-summary-list govuk-!-margin-bottom-9']/div[1]/dd[2]/a[1]",
    bankApplicationUpdateStatusCYADateOpenedChangeLink:
      "//dl[@class='govuk-summary-list govuk-!-margin-bottom-9']/div[2]/dd[2]/a[1]",
    bankApplicationUpdateStatusCYAPersonalItemsChangeLink:
      "//dl[@class='govuk-summary-list govuk-!-margin-bottom-9']/div[3]/dd[2]/a[1]",

    bankApplicationUpdateCYAPageStatusText: "//dl[@class='govuk-summary-list govuk-!-margin-bottom-9']/div[1]/dd[1]",
    bankApplicationUpdateCYAPageDateHeardBackText:
      "//dl[@class='govuk-summary-list govuk-!-margin-bottom-9']/div[2]/dd[1]",
    bankApplicationUpdateCYAPageAddedToPersonalItemsText:
      "//dl[@class='govuk-summary-list govuk-!-margin-bottom-9']/div[3]/dd[1]",

    bankApplicationUpdateApplicationReturnedDateFinanceSectionEntry:
      "//section[@id='finance']/div/div/div/table/tbody/tr[4]/td",
    bankApplicationUpdateAddedToPersonalItemsFinanceSectionEntry:
      "//section[@id='finance']/div/div/div/table/tbody/tr[5]/td",

    applicationHistoryLink: "//div[@class='app-summary-card__body']//div[@class='govuk-grid-row']/div/details",
    bankApplicationHistoryApplicationSubmittedFinanceSectionEntry:
      "//section[@id='finance']/div/div/div/details/div/table/tbody/tr[1]/td",
    bankApplicationHistoryApplicationReturnedFinanceSectionEntry:
      "//section[@id='finance']/div/div/div/details/div/table/tbody/tr[2]/td",

    // Resubmit Bank Application
    bankApplicationResubmitApplicationButton: "//button[normalize-space()='Resubmit application']",
    bankApplicationResubmittedDay: "//input[@id='applicationResubmittedDay']",
    bankApplicationResubmittedMonth: "//input[@id='applicationResubmittedMonth']",
    bankApplicationResubmittedYear: "//input[@id='applicationResubmittedYear']",
    bankApplicationResubmittedStatus: "//select[@id='bank-account-application-status']",
    bankApplicationResubmittedReceivedDay: "//input[@id='account-opened-day']",
    bankApplicationResubmittedReceivedMonth:
      "//div[@id='date-account-opened']//input[@id='date-resubmiited-resubmitted-bank-details-heard-month']",
    bankApplicationResubmittedReceivedYear: "//input[@id='account-opened-year']",
    bankApplicationResubmittedPersonalItemYesOption: "//input[@id='added-to-items-yes']",
    bankApplicationResubmittedPersonalItemNoOption: "//input[@id='added-to-items-no']",
    bankApplicationResubmittedPersonalItemDate: "//input[@id='day']",
    bankApplicationResubmittedPersonalItemMonth: "//input[@id='month']",
    bankApplicationResubmittedPersonalItemYear: "//input[@id='year']",

    bankApplicationResubmittedHeardDay: "//input[@id='date-resubmitted-bank-details-heard-day']",
    bankApplicationResubmittedHeardMonth:
      "//div[@id='date-resubmitted-bank-details-received']//input[@id='date-resubmiited-resubmitted-bank-details-heard-month']",
    bankApplicationResubmittedHeardYear: "//input[@id='date-resubmitted-bank-details-heard-year']",

    dateApplicationResubmittedBankAccountResubmittedPageBankErrorText:
      "//label[normalize-space()='Date application resubmitted']/parent::div/div[1]",
    statusBackApplicationBankAccountResubmittedPageBankErrorText:
      "//label[normalize-space()='Resubmitted application status']/parent::div/p",
    addedToPersonalItemsBankAccountResubmittedPageBankErrorText:
      "//label[normalize-space()='Added to personal items']/parent::fieldset/div/div[2]/div/div[1]",
    dateHeardBackBankAccountResubmittedPageBankErrorText:
      "//label[normalize-space()='Date heard back from resubmission']/parent::div/div[1]",

    // dateAccountOpenedBankAccountResubmittedPageBankErrorText:"//label[normalize-space()='Date account opened']/parent::div/div[1]",
    // yesOptionOfAddedToPersonalItemsBankAccountResubmittedPageBankErrorText:"//label[normalize-space()='Date added']/parent::div/div[1]",

    bankApplicationResubmittedCYAPageApplicationResubmittedChangeLink:
      "//dt[normalize-space()='Application resubmitted']/parent::div/dd/a",
    bankApplicationResubmittedCYAPageApplicationStatusChangeLink: "//dt[normalize-space()='Status']/parent::div/dd/a",
    bankApplicationResubmittedCYAPageDateAccountOpenedChangeLink:
      "//dt[normalize-space()='Date account opened']/parent::div/dd/a",
    bankApplicationResubmittedCYAPageAddedToPersonalItemsChangeLink:
      "//dt[normalize-space()='Added to personal items']/parent::div/dd/a",
    bankApplicationResubmittedCYAPageDateHeardBackChangeLink:
      "//dt[normalize-space()='Date heard back from resubmission']/parent::div/dd/a",

    bankApplicationResubmittedCYAPageApplicationResubmittedText:
      "//dt[normalize-space()='Application resubmitted']/parent::div/dd[1]",
    bankApplicationResubmittedCYAPageApplicationStatusText: "//dt[normalize-space()='Status']/parent::div/dd[1]",
    bankApplicationResubmittedCYAPageDateAccountOpenedText:
      "//dt[normalize-space()='Date account opened']/parent::div/dd[1]",
    bankApplicationResubmittedCYAPageAddedToPersonalItemsText:
      "//dt[normalize-space()='Added to personal items']/parent::div/dd[1]",
    bankApplicationResubmittedCYAPageDateHeardBackText:
      "//dt[normalize-space()='Date heard back from resubmission']/parent::div/dd[1]",

    bankApplicationResubmittedApplicationResubmittedFinanceSectionEntry:
      "//th[normalize-space()='Application resubmitted']/parent::tr/td",
    bankApplicationResubmittedDateAccountOpenedFinanceSectionEntry:
      "//th[normalize-space()='Date account opened']/parent::tr/td",
    bankApplicationResubmittedDateHeardBackFinanceSectionEntry:
      "//th[normalize-space()='Application declined']/parent::tr/td",

    deleteBankAccountApplicationLink: "//section[@id='finance']/div/div/div/button",
    confirmDeleteBankAccountApplicationButton: "//section[@id='finance']/div/div/div/div/div/form/button",

    // ID ELEMENTS
    addAnIDApplicationButton: "//a[normalize-space()='Add an ID application']",

    selectIDType: "//select[@id='idType']",
    applicationRequestedDate: "//input[@id='applicationSubmittedDay']",
    applicationRequestedMonth: "//input[@id='applicationSubmittedMonth']",
    applicationRequestedYear: "//input[@id='applicationSubmittedYear']",
    groNumberYes: "//input[@id='haveGroYes']",
    groNumberNo: "//input[@id='haveGroNo']",
    ukNationalBornOverseasYes: "//input[@id='isUkNationalBornOverseasYes']",
    ukNationalBornOverseasYesSelectCountry: "//select[@id='countryBornIn']",
    ukNationalBornOverseasNo: "//input[@id='isUkNationalBornOverseasNo']",
    priorityApplicationYes: "//input[@id='isPriorityApplicationYes']",
    priorityApplicationNo: "//input[@id='isPriorityApplicationNo']",
    costOfApplication: "//input[@id='costOfApplication']",
    caseNumber: "//input[@id='caseNumber']",
    courtDetails: "//input[@id='courtDetails']",
    drivingLicenseType: "//select[@id='driversLicenceType']",
    drivingLicenseApplicationMade: "//select[@id='driversLicenceApplicationMadeAt']",

    idApplicationSubmittedQuestionErrorText: "//label[normalize-space()='Application submitted']/parent::div/div[1]",
    idTypeErrorText: "//label[normalize-space()='Type']/parent::div/div[1]",
    costOfApplicationBirthCertificateErrorText: "//label[normalize-space()='Cost of application']/parent::div/p",
    groNumberErrorText: "//span[normalize-space()='Do you have the GRO number?']/parent::legend/parent::fieldset/p",
    ukNationalBornOverseasErrorText:
      "//span[normalize-space()='Was a UK national born overseas?']/parent::legend/parent::div/p",
    selectACountryErrorText: "//label[normalize-space()='Which country were they born in?']/parent::div/p",
    priorityApplicationErrorText:
      "//span[normalize-space()='Is this a priority application?']/parent::legend/parent::fieldset/p",
    caseNumberErrorText: "//label[normalize-space()='Case number']/parent::div/p",
    courtDetailsErrorText: "//label[normalize-space()='Court details']/parent::div/p",
    drivingLicenseTypeErrorText: "//label[normalize-space()='Driving licence type']/parent::div/p",
    drivingLicenseWhenApplicationMadeErrorText:
      "//label[normalize-space()='Where was the application made?']/parent::div/p",
    costOfApplicationBRPRouteErrorText: "//label[normalize-space()='Cost of application']/parent::div/p",

    idApplicationCYAPageTypeChangeLink: "//dt[normalize-space()='Type']/parent::div/dd/a",
    idApplicationCYAPageApplicationSubmittedChangeLink:
      "//dt[normalize-space()='Application submitted']/parent::div/dd/a",
    idApplicationCYAPageGRONumberChangeLink: "//dt[normalize-space()='Has the GRO number?']/parent::div/dd/a",
    idApplicationCYAPageUkNationalChangeLink:
      "//dt[normalize-space()='Was a UK national born overseas?']/parent::div/dd/a",
    idApplicationCYAPagePriorityApplicationChangeLink:
      "//dt[normalize-space()='Priority application']/parent::div/dd/a",
    idApplicationCYAPageCostOfApplicationChangeLink: "//dt[normalize-space()='Cost of application']/parent::div/dd/a",
    idApplicationCYAPageCaseNumberChangeLink: "//dt[normalize-space()='Case number']/parent::div/dd/a",
    idApplicationCYAPageCourtDetailsChangeLink: "//dt[normalize-space()='Court details']/parent::div/dd/a",
    idApplicationCYAPageDrivingLicenseTypeChangeLink: "//dt[normalize-space()='Driving licence type']/parent::div/dd/a",
    idApplicationCYAPageDrivingLicenseApplicationLocationChangeLink:
      "//dt[normalize-space()='Driving licence application location']/parent::div/dd/a",

    idApplicationCYAPageTypeText: "//dt[normalize-space()='Type']/parent::div/dd[1]",
    idApplicationCYAPageApplicationSubmittedText: "//dt[normalize-space()='Application submitted']/parent::div/dd[1]",
    idApplicationCYAPageGRONumberText: "//dt[normalize-space()='Has the GRO number?']/parent::div/dd[1]",
    idApplicationCYAPageUkNationalText: "//dt[normalize-space()='Was a UK national born overseas?']/parent::div/dd[1]",
    idApplicationCYAPagePriorityApplicationText: "//dt[normalize-space()='Priority application']/parent::div/dd[1]",
    idApplicationCYAPageCostOfApplicationText: "//dt[normalize-space()='Cost of application']/parent::div/dd[1]",
    idApplicationCYAPageCaseNumberApplicationText: "//dt[normalize-space()='Case number']/parent::div/dd[1]",
    idApplicationCYAPageCourtDetailsApplicationText: "//dt[normalize-space()='Court details']/parent::div/dd[1]",
    idApplicationCYAPageDrivingLicenseTypeApplicationText:
      "//dt[normalize-space()='Driving licence type']/parent::div/dd[1]",
    idApplicationCYAPageDrivingLicenseApplicationLocationApplicationText:
      "//dt[normalize-space()='Driving licence application location']/parent::div/dd[1]",

    idTypeFinanceSectionText: "//th[normalize-space()='Type']/parent::tr/td",
    idApplicationSubmittedIDSectionText: "//section[@id='id']/div/div/div/div/table/tbody/tr[2]/td[1]",
    idGRONumberIDSectionText: "//th[normalize-space()='Has the GRO number?']/parent::tr/td",
    idUkNationalIDSectionText: "//th[normalize-space()='Was a UK national born overseas?']/parent::tr/td",
    idPriorityApplicationIDSectionText: "//th[normalize-space()='Priority application']/parent::tr/td",
    idCostOfApplicationIDSectionText: "//th[normalize-space()='Cost of application']/parent::tr/td",
    idCaseNumberIDSectionText: "//th[normalize-space()='Case number']/parent::tr/td",
    idCourtDetailsIDSectionText: "//th[normalize-space()='Court details']/parent::tr/td",
    idDrivingLicenseTypeIDSectionText: "//th[normalize-space()='Driving licence type']/parent::tr/td",
    idDrivingLicenseApplicationLocationIDSectionText:
      "//th[normalize-space()='Driving licence application location']/parent::tr/td",

    // Update Id Application
    updateIDApplicationButton: "//button[normalize-space()='Update application']",
    updateIDApplicationSelectApplicationStatus: "//select[@id='updatedStatus']",
    updateIDApplicationReceivedDate: "//input[@id='dateIdReceivedDay']",
    updateIDApplicationReceivedMonth: "//input[@id='dateIdReceivedMonth']",
    updateIDApplicationReceivedDYear: "//input[@id='dateIdReceivedYear']",
    updateIDPersonalItemYesOption: "//input[@id='isAddedToPersonalItemsYes']",
    updateIDPersonalItemNoOption: "//input[@id='isAddedToPersonalItemsNo']",
    updateIDPersonalItemDate: "//input[@id='addedToPersonalItemsDateDay']",
    updateIDPersonalItemMonth: "//input[@id='addedToPersonalItemsDateMonth']",
    updateIDPersonalItemYear: "//input[@id='addedToPersonalItemsDateYear']",
    updateApplicationRefundAmount: "//input[@id='refundAmount']",

    applicationStatusIDErrorText: "//label[normalize-space()='Application status']/parent::div/p",
    dateIdReceivedUpdateIDErrorText: "//label[normalize-space()='Date ID received']/parent::div/div[1]",
    addedToPersonalItemsUpdateIDErrorText:
      "//span[@class='govuk-fieldset__heading']/parent::legend//parent::fieldset/p",
    dateAddedWithinTheYesOptionOfAddedToPersonalItemsUpdateIDErrorText:
      "//label[normalize-space()='Date added']/parent::div/div[1]",
    enterRefundAmountUpdateIDErrorText: "//label[normalize-space()='Application refund amount']/parent::div/p",

    updateIDApplicationCYAPageStatusChangeLink: "//dt[normalize-space()='Application status']/parent::div/dd/a",
    updateIDApplicationCYAPageApplicationDateIdReceivedLink:
      "//dt[normalize-space()='Date ID received']/parent::div/dd/a",
    updateIDApplicationCYAPageAddedToPersonalItemsChangeLink:
      "//dt[normalize-space()='Added to personal items']/parent::div/dd/a",
    updateIDApplicationCYAPageApplicationRefundChangeLink:
      "//dt[normalize-space()='Application Refund']/parent::div/dd/a",

    updateIDApplicationCYAPageStatusText: "//dt[normalize-space()='Application status']/parent::div/dd[1]",
    updateIDApplicationCYAApplicationDateIdReceivedText: "//dt[normalize-space()='Date ID received']/parent::div/dd[1]",
    updateIDApplicationCYAPageAddedToPersonalItemsText:
      "//dt[normalize-space()='Added to personal items']/parent::div/dd[1]",
    updateIDApplicationCYAPageApplicationRefundText: "//dt[normalize-space()='Application Refund']/parent::div/dd[1]",

    idApplicationStatusIDSectionText: "//th[normalize-space()='Application status']/parent::tr/td",
    idDateIDReceivedIDSectionText: "//th[normalize-space()='Date ID received']/parent::tr/td",
    idAddedToPersonalItemsIDSectionText: "//th[normalize-space()='Added to personal items']/parent::tr/td",
    idApplicationRefundIDSectionText: "//th[normalize-space()='Application refund']/parent::tr/td",

    deleteIDApplicationLink: "//section[@id='id']/div/div/div/div/button",
    confirmDeleteIdApplicationButton: "//section[@id='id']/div/div/div/div/div/div/form/button",
    allIDApplications: "//section[@id='id']/div/div/div/div/h3",
  }

  public async returnTypeForIdEntryInFinanceIDTab(idEntryNumber: string) {
    // Since all the types are in an array, The string is converted to an int and then subtract by 1 to find the right entry in the array
    const i = parseInt(idEntryNumber, 10) - 1

    const idTypeLocator = await this.page.locator(this.FinancePageElements.idTypeFinanceSectionText)
    const uniqueIdTypeLocator = (await idTypeLocator.nth(i)).textContent() // Adds a square bracket to the locator and populates it with a value 0
    console.log(`This is the id type for the ${idEntryNumber}th entry is: ${await uniqueIdTypeLocator}`)
    return uniqueIdTypeLocator
  }

  public async returnIdNumberTextForIdEntryInFinanceIDTab(idEntryNumber: string) {
    // Since all the types are in an array, The string is converted to an int and then subtract by 1 to find the right entry in the array
    const i = parseInt(idEntryNumber, 10) - 1

    const idEntryNameLocator = await this.page.locator(this.FinancePageElements.allIDApplications)
    const uniqueIdEntryNameLocator = (await idEntryNameLocator.nth(i)).textContent() // Adds a square bracket to the locator and populates it with a value 0
    console.log(`This is the id number: ${await uniqueIdEntryNameLocator}`)
    return uniqueIdEntryNameLocator
  }

  public async clickOnChangeLinkInUpdateIDApplicationCYAPage(idEntry: string) {
    console.log(`getting the ${idEntry} text`)
    if (idEntry === 'Application status') {
      await this.page.locator(this.FinancePageElements.updateIDApplicationCYAPageStatusChangeLink).click()
    } else if (idEntry === 'Date ID received') {
      await this.page.locator(this.FinancePageElements.updateIDApplicationCYAPageApplicationDateIdReceivedLink).click()
    } else if (idEntry === 'Added to personal items') {
      await this.page.locator(this.FinancePageElements.updateIDApplicationCYAPageAddedToPersonalItemsChangeLink).click()
    } else {
      console.log('check link spelling')
      expect(idEntry).toBeFalsy()
    }
  }

  public async clickOnChangeLinkInIDCYAPage(idEntry: string): Promise<string> {
    console.log(`getting the ${idEntry} text`)
    if (idEntry === 'Type') {
      await this.page.locator(this.FinancePageElements.idApplicationCYAPageTypeChangeLink).click()
    } else if (idEntry === 'Application submitted') {
      await this.page.locator(this.FinancePageElements.idApplicationCYAPageTypeChangeLink).click()
    } else if (idEntry === 'GRO number') {
      await this.page.locator(this.FinancePageElements.idApplicationCYAPageGRONumberChangeLink).click()
    } else if (idEntry === 'UK national') {
      await this.page.locator(this.FinancePageElements.idApplicationCYAPageUkNationalChangeLink).click()
    } else if (idEntry === 'Priority application') {
      await this.page.locator(this.FinancePageElements.idApplicationCYAPagePriorityApplicationChangeLink).click()
    } else if (idEntry === 'Cost') {
      await this.page.locator(this.FinancePageElements.idApplicationCYAPageCostOfApplicationChangeLink).click()
    } else if (idEntry === 'Case number') {
      await this.page.locator(this.FinancePageElements.idApplicationCYAPageCaseNumberChangeLink).click()
    } else if (idEntry === 'Court details') {
      await this.page.locator(this.FinancePageElements.idApplicationCYAPageCourtDetailsChangeLink).click()
    } else if (idEntry === 'License type') {
      await this.page.locator(this.FinancePageElements.idApplicationCYAPageCourtDetailsChangeLink).click()
    } else if (idEntry === 'License location') {
      await this.page
        .locator(this.FinancePageElements.idApplicationCYAPageDrivingLicenseApplicationLocationChangeLink)
        .click()
    } else {
      console.log('check link spelling')
      expect(idEntry).toBeFalsy()
    }
    return null
  }

  public async verifyIdEntriesInFinanceAndIDAssessmentPage(idEntry: string): Promise<string> {
    console.log(`getting the ${idEntry} text`)
    if (idEntry === 'Type') {
      return this.page.locator(this.FinancePageElements.idTypeFinanceSectionText).textContent()
    }
    if (idEntry === 'Application submitted') {
      return this.page.locator(this.FinancePageElements.idApplicationSubmittedIDSectionText).textContent()
    }
    if (idEntry === 'GRO number') {
      return (await this.page.locator(this.FinancePageElements.idGRONumberIDSectionText).textContent()).trim()
    }
    if (idEntry === 'UK national') {
      return (await this.page.locator(this.FinancePageElements.idUkNationalIDSectionText).textContent()).trim()
    }
    if (idEntry === 'Priority application') {
      return (await this.page.locator(this.FinancePageElements.idPriorityApplicationIDSectionText).textContent()).trim()
    }
    if (idEntry === 'Cost') {
      return (await this.page.locator(this.FinancePageElements.idCostOfApplicationIDSectionText).textContent()).trim()
    }
    if (idEntry === 'Case number') {
      return this.page.locator(this.FinancePageElements.idCaseNumberIDSectionText).textContent()
    }
    if (idEntry === 'Court details') {
      return this.page.locator(this.FinancePageElements.idCourtDetailsIDSectionText).textContent()
    }
    if (idEntry === 'License type') {
      return this.page.locator(this.FinancePageElements.idDrivingLicenseTypeIDSectionText).textContent()
    }
    if (idEntry === 'License location') {
      return this.page.locator(this.FinancePageElements.idDrivingLicenseApplicationLocationIDSectionText).textContent()
    }
    if (idEntry === 'Application status') {
      return this.page.locator(this.FinancePageElements.idApplicationStatusIDSectionText).textContent()
    }
    if (idEntry === 'Date ID received') {
      return this.page.locator(this.FinancePageElements.idDateIDReceivedIDSectionText).textContent()
    }
    if (idEntry === 'Added to personal items') {
      return (
        await this.page.locator(this.FinancePageElements.idAddedToPersonalItemsIDSectionText).textContent()
      ).trim()
    }
    if (idEntry === 'Refund Amount') {
      return this.page.locator(this.FinancePageElements.idApplicationRefundIDSectionText).textContent()
    }
    console.log('check link spelling')
    expect(idEntry).toBeFalsy()

    return null
  }

  public async getApplicationStatusTextInIdCYAPage() {
    return (await this.page.locator(this.FinancePageElements.updateIDApplicationCYAPageStatusText).textContent()).trim()
  }

  public async getDateIdReceivedTextInIdCYAPage() {
    return (
      await this.page
        .locator(this.FinancePageElements.updateIDApplicationCYAApplicationDateIdReceivedText)
        .textContent()
    ).trim()
  }

  public async getApplicationRefundTextInIdCYAPage() {
    return (
      await this.page.locator(this.FinancePageElements.updateIDApplicationCYAPageApplicationRefundText).textContent()
    ).trim()
  }

  public async getAddedToPersonalItemTextInIdCYAPage(personalItems: string) {
    if (personalItems === 'N/A') {
      return 'N/A'
    }
    await pageFixture.page.waitForTimeout(1000)
    return (
      await this.page.locator(this.FinancePageElements.updateIDApplicationCYAPageAddedToPersonalItemsText).textContent()
    ).trim()
  }

  public async getIDTypeTextInIdCYAPage() {
    return (await this.page.locator(this.FinancePageElements.idApplicationCYAPageTypeText).textContent()).trim()
  }

  public async getApplicationSubmittedTextInIdCYAPage() {
    return this.page.locator(this.FinancePageElements.idApplicationCYAPageApplicationSubmittedText).textContent()
  }

  public async getGroNumberTextInIdCYAPage() {
    return (await this.page.locator(this.FinancePageElements.idApplicationCYAPageGRONumberText).textContent()).trim()
  }

  public async getUkNationalTextInIdCYAPage() {
    return (await this.page.locator(this.FinancePageElements.idApplicationCYAPageUkNationalText).textContent()).trim()
  }

  public async getPriorityNumberTextInIdCYAPage() {
    return (
      await this.page.locator(this.FinancePageElements.idApplicationCYAPagePriorityApplicationText).textContent()
    ).trim()
  }

  public async getApplicationCostTextInIdCYAPage() {
    return (
      await this.page.locator(this.FinancePageElements.idApplicationCYAPageCostOfApplicationText).textContent()
    ).trim()
  }

  public async getApplicationDivorceCaseNumberTextInIdCYAPage() {
    return (
      await this.page.locator(this.FinancePageElements.idApplicationCYAPageCaseNumberApplicationText).textContent()
    ).trim()
  }

  public async getApplicationDivorceCourtDetailsTextInIdCYAPage() {
    return (
      await this.page.locator(this.FinancePageElements.idApplicationCYAPageCourtDetailsApplicationText).textContent()
    ).trim()
  }

  public async getApplicationDrivingLicenseTypeTextInIdCYAPage() {
    return (
      await this.page
        .locator(this.FinancePageElements.idApplicationCYAPageDrivingLicenseTypeApplicationText)
        .textContent()
    ).trim()
  }

  public async getApplicationDrivingLicenseApplicationLocationInIdCYAPage() {
    return (
      await this.page
        .locator(this.FinancePageElements.idApplicationCYAPageDrivingLicenseApplicationLocationApplicationText)
        .textContent()
    ).trim()
  }

  public async enterBirthCertificateSpecificQuestionAnswer(
    groNumber: string,
    ukNational: string,
    country: string,
    priorityApplication: string,
    applicationCost: string,
  ) {
    await this.selectHaveGROOption(groNumber)
    await this.selectUkNationalBornOverseas(ukNational)
    await this.enterUKNationalBornOverseasCountry(country)
    await this.selectApplicationPriority(priorityApplication)
    await this.enterApplicationCost(applicationCost)
    await this.clickOnSubmitButton()
    await this.clickOnConfirmBankAccountApplyButton()
  }

  public async selectHaveGROOption(groNumber: string) {
    if (groNumber === 'Yes') {
      await this.page.locator(this.FinancePageElements.groNumberYes).click()
    } else if (groNumber === 'No') {
      await this.page.locator(this.FinancePageElements.groNumberNo).click()
    } else if (groNumber === 'N/A') {
      console.log('Nothing to select')
    } else {
      console.log('check personal item option spelling')
      expect(groNumber).toBeFalsy()
    }
  }

  public async selectUkNationalBornOverseas(ukNational: string) {
    if (ukNational === 'Yes') {
      await this.page.locator(this.FinancePageElements.ukNationalBornOverseasYes).click()
    } else if (ukNational === 'No') {
      await this.page.locator(this.FinancePageElements.ukNationalBornOverseasNo).click()
    } else if (ukNational === 'N/A') {
      console.log('Nothing available')
    } else {
      console.log('check personal item option spelling')
      expect(ukNational).toBeFalsy()
    }
  }

  public async enterUKNationalBornOverseasCountry(country: string) {
    if (country === 'N/A') {
      return 'N/A'
    }
    await this.page
      .locator(this.FinancePageElements.ukNationalBornOverseasYesSelectCountry)
      .waitFor({ state: 'visible' })
    await this.page.locator(this.FinancePageElements.ukNationalBornOverseasYesSelectCountry).selectOption(country)
    return null
  }

  public async selectApplicationPriority(priorityApplication: string) {
    if (priorityApplication === 'Yes') {
      await this.page.locator(this.FinancePageElements.priorityApplicationYes).click()
    } else if (priorityApplication === 'No') {
      await this.page.locator(this.FinancePageElements.priorityApplicationNo).click()
    } else {
      console.log('check personal item option spelling')
      expect(priorityApplication).toBeFalsy()
    }
  }

  public async enterApplicationCost(applicationCost: string) {
    await this.page.locator(this.FinancePageElements.costOfApplication).fill(applicationCost)
  }

  public async enterDivorceCaseNumber(caseNumberText: string) {
    await this.page.locator(this.FinancePageElements.caseNumber).fill(caseNumberText)
  }

  public async enterDivorceCourtDetails(courtDetailsText: string) {
    await this.page.locator(this.FinancePageElements.courtDetails).fill(courtDetailsText)
  }

  public async selectDrivingLicenseType(courtDetailsText: string) {
    await this.page.locator(this.FinancePageElements.drivingLicenseType).selectOption(courtDetailsText)
  }

  public async selectApplicationMadeLocation(drivingLicenseLocation: string) {
    await this.page.locator(this.FinancePageElements.drivingLicenseApplicationMade).selectOption(drivingLicenseLocation)
  }

  // bank
  public async clickOnApplicationHistoryLink() {
    await this.page.locator(this.FinancePageElements.applicationHistoryLink).click()
  }

  public async clickOnBankAccountApplicationStatusCYAPageChangeLink(changeLink: string) {
    console.log(`selecting the ${changeLink} in the CYA page`)
    if (changeLink === 'Status') {
      await this.page.locator(this.FinancePageElements.bankApplicationUpdateStatusCYAChangeLink).click()
    } else if (changeLink === 'Date account opened') {
      await this.page.locator(this.FinancePageElements.bankApplicationUpdateStatusCYADateOpenedChangeLink).click()
    } else if (changeLink === 'Date heard back from application') {
      await this.page.locator(this.FinancePageElements.bankApplicationUpdateStatusCYADateOpenedChangeLink).click()
    } else if (changeLink === 'Added to personal items') {
      await this.page.locator(this.FinancePageElements.bankApplicationUpdateStatusCYAPersonalItemsChangeLink).click()
    } else if (changeLink === 'Date heard back') {
      await this.page.locator(this.FinancePageElements.bankApplicationUpdateStatusCYAPersonalItemsChangeLink).click()
    } else {
      console.log('check question spelling')
      expect(changeLink).toBeFalsy()
    }
  }

  public async verifyApplyForBankAccountPageTitleErrorIsDisplayed() {
    await expect(this.page).toHaveTitle(this.FinanceAndIDPageTitleElements.ApplyForABankAccountPageErrorTitle)
  }

  public async getApplyForBankAccountErrorText(applyForBankAccountQuestionErrorText: string) {
    console.log(`getting the ${applyForBankAccountQuestionErrorText} error message`)
    if (applyForBankAccountQuestionErrorText === 'select Bank') {
      return (
        await this.page.locator(this.FinancePageElements.selectApplyForBankAccountPageBankErrorText).textContent()
      ).trim()
    }
    if (applyForBankAccountQuestionErrorText === 'application submitted') {
      return (
        await this.page
          .locator(this.FinancePageElements.applicationSubmittedDateApplyForBankAccountPageBankErrorText)
          .textContent()
      ).replace(/\s+/g, '')
    }
    if (applyForBankAccountQuestionErrorText === 'Date account opened') {
      return (
        await this.page
          .locator(this.FinancePageElements.dateAccountOpenedUpdateBankAccountPageBankErrorText)
          .textContent()
      ).replace(/\s+/g, '')
    }
    if (applyForBankAccountQuestionErrorText === 'Added to personal items') {
      return (
        await this.page
          .locator(this.FinancePageElements.addedToPersonalItemsUpdateBankAccountPageBankErrorText)
          .textContent()
      ).trim()
    }
    if (applyForBankAccountQuestionErrorText === 'Yes in the Added to personal items') {
      return (
        await this.page
          .locator(this.FinancePageElements.yesOptionOfAddedToPersonalItemsUpdateBankAccountPageBankErrorText)
          .textContent()
      ).replace(/\s+/g, '')
    }
    if (applyForBankAccountQuestionErrorText === 'Date heard back') {
      return (
        await this.page.locator(this.FinancePageElements.dateHeardBackUpdateBankAccountPageBankErrorText).textContent()
      ).replace(/\s+/g, '')
    }
    if (applyForBankAccountQuestionErrorText === 'Date application resubmitted') {
      return (
        await this.page
          .locator(this.FinancePageElements.dateApplicationResubmittedBankAccountResubmittedPageBankErrorText)
          .textContent()
      ).replace(/\s+/g, '')
    }
    if (applyForBankAccountQuestionErrorText === 'Resubmitted application status') {
      return (
        await this.page
          .locator(this.FinancePageElements.statusBackApplicationBankAccountResubmittedPageBankErrorText)
          .textContent()
      ).trim()
    }
    if (applyForBankAccountQuestionErrorText === 'Yes in the Added to personal items for Resubmitted Application') {
      return (
        await this.page
          .locator(this.FinancePageElements.addedToPersonalItemsBankAccountResubmittedPageBankErrorText)
          .textContent()
      ).replace(/\s+/g, '')
    }
    if (applyForBankAccountQuestionErrorText === 'Date heard back for Resubmitted bank Application') {
      return (
        await this.page
          .locator(this.FinancePageElements.dateHeardBackBankAccountResubmittedPageBankErrorText)
          .textContent()
      ).replace(/\s+/g, '')
    }
    console.log('check question spelling')
    expect(applyForBankAccountQuestionErrorText).toBeFalsy()
    return null
  }

  // Assessment Tests

  public async verifyFinanceAndIDAssessmentQuestionErrorTitle(assessmentQuestion: string) {
    console.log(`getting the ${assessmentQuestion} error message`)
    if (assessmentQuestion === 'Date of assessment') {
      return (
        await this.page.locator(this.FinancePageElements.assessmentDateOfAssessmentQuestionErrorText).textContent()
      ).replace(/\s+/g, '')
    }
    if (assessmentQuestion === 'bank account question') {
      return (
        await this.page.locator(this.FinancePageElements.assessmentRequiresBankAccountQuestionErrorText).textContent()
      ).replace(/\s+/g, '')
    }
    if (assessmentQuestion === 'require an ID application') {
      return (
        await this.page.locator(this.FinancePageElements.assessmentRequiresAnIDQuestionErrorText).textContent()
      ).replace(/\s+/g, '')
    }
    if (assessmentQuestion === 'application submitted') {
      return (
        await this.page.locator(this.FinancePageElements.assessmentApplicationSubmittedQuestionErrorText).textContent()
      ).replace(/\s+/g, '')
    }
    console.log('check question spelling')
    expect(assessmentQuestion).toBeFalsy()
    return null
  }

  public async verifyIDRouteQuestionsErrorTitles(iDQuestion: string) {
    console.log(`getting the ${iDQuestion} error message`)
    if (iDQuestion === 'application submitted') {
      return (
        await this.page.locator(this.FinancePageElements.idApplicationSubmittedQuestionErrorText).textContent()
      ).replace(/\s+/g, '')
    }
    if (iDQuestion === 'type') {
      return (await this.page.locator(this.FinancePageElements.idTypeErrorText).textContent()).trim()
    }
    if (iDQuestion === 'Cost for Birth Certificate Route') {
      return (
        await this.page.locator(this.FinancePageElements.costOfApplicationBirthCertificateErrorText).textContent()
      ).trim()
    }
    if (iDQuestion === 'GRO Number') {
      return (await this.page.locator(this.FinancePageElements.groNumberErrorText).textContent()).trim()
    }
    if (iDQuestion === 'UK National Overseas') {
      return (await this.page.locator(this.FinancePageElements.ukNationalBornOverseasErrorText).textContent()).trim()
    }
    if (iDQuestion === 'Priority Application') {
      return (await this.page.locator(this.FinancePageElements.priorityApplicationErrorText).textContent()).trim()
    }
    if (iDQuestion === 'Driving Licence type') {
      return (await this.page.locator(this.FinancePageElements.drivingLicenseTypeErrorText).textContent()).trim()
    }
    if (iDQuestion === 'Driving Licence Where Application Is Made') {
      return (
        await this.page.locator(this.FinancePageElements.drivingLicenseWhenApplicationMadeErrorText).textContent()
      ).trim()
    }
    if (iDQuestion === 'Cost for BRP Route') {
      return (await this.page.locator(this.FinancePageElements.costOfApplicationBRPRouteErrorText).textContent()).trim()
    }
    if (iDQuestion === 'Select a country') {
      return (await this.page.locator(this.FinancePageElements.selectACountryErrorText).textContent()).trim()
    }
    if (iDQuestion === 'Case number') {
      return (await this.page.locator(this.FinancePageElements.caseNumberErrorText).textContent()).trim()
    }
    if (iDQuestion === 'Court details') {
      return (await this.page.locator(this.FinancePageElements.courtDetailsErrorText).textContent()).trim()
    }
    if (iDQuestion === 'ID Application Status') {
      return (await this.page.locator(this.FinancePageElements.applicationStatusIDErrorText).textContent()).trim()
    }
    if (iDQuestion === 'Date ID received') {
      return (await this.page.locator(this.FinancePageElements.dateIdReceivedUpdateIDErrorText).textContent()).replace(
        /\s+/g,
        '',
      )
    }
    if (iDQuestion === 'Added to personal items') {
      return (
        await this.page.locator(this.FinancePageElements.addedToPersonalItemsUpdateIDErrorText).textContent()
      ).trim()
    }
    if (iDQuestion === 'Yes in the Added to personal items') {
      return (
        await this.page
          .locator(this.FinancePageElements.dateAddedWithinTheYesOptionOfAddedToPersonalItemsUpdateIDErrorText)
          .textContent()
      ).replace(/\s+/g, '')
    }
    if (iDQuestion === 'Application refund amount') {
      return (await this.page.locator(this.FinancePageElements.enterRefundAmountUpdateIDErrorText).textContent()).trim()
    }
    console.log('check question spelling')
    expect(iDQuestion).toBeFalsy()
    return null
  }

  public async verifyFinanceAndIDAssessmentErrorIsDisplayed() {
    await expect(this.page).toHaveTitle(this.FinanceAndIDPageTitleElements.FinanceAndIDAssessmentQuestionPageErrorTitle)
  }

  public async deleteAssessment() {
    await this.page.locator(this.FinancePageElements.deleteAssessmentInFinanceAndIDAssessmentSection).click()
    await this.page
      .locator(this.FinancePageElements.confirmDeleteAssessmentInFinanceAndIDAssessmentSection)
      .waitFor({ state: 'visible' })
    await this.page.locator(this.FinancePageElements.confirmDeleteAssessmentInFinanceAndIDAssessmentSection).click()
    expect(await this.getAssessmentText()).toContain('Completeassessmentnow')
  }

  public async verifyAssessmentEntriesInFinanceAndIDAssessmentPage(AssessmentEntry: string) {
    console.log(`getting the ${AssessmentEntry} change link`)
    if (AssessmentEntry === 'Date of assessment') {
      return (
        await this.page
          .locator(this.FinancePageElements.assessmentDateOfAssessmentInFinanceAndIDAssessmentSectionText)
          .textContent()
      ).trim()
    }
    if (AssessmentEntry === 'Requires a bank account application') {
      return (
        await this.page
          .locator(this.FinancePageElements.assessmentRequiresBankAccountInFinanceAndIDAssessmentSectionText)
          .textContent()
      ).trim()
    }
    if (AssessmentEntry === 'Requires an ID application') {
      return (
        await this.page
          .locator(this.FinancePageElements.assessmentRequiresAnIDInFinanceAndIDAssessmentSectionText)
          .textContent()
      ).trim()
    }
    if (AssessmentEntry === 'Existing ID') {
      return (
        await this.page
          .locator(this.FinancePageElements.assessmentExistingIDInFinanceAndIDAssessmentSectionText)
          .textContent()
      ).replace(/\s+/g, '')
      // return (await this.page.locator(this.FinancePageElements.assessmentExistingIDInFinanceAndIDAssessmentSectionText).textContent()).trim()
    }
    console.log('check link spelling')
    expect(AssessmentEntry).toBeFalsy()
    return null
  }

  public async selectingAssessmentCYAPageChangeLink(changeLink: string) {
    console.log(`getting the ${changeLink} change link`)
    if (changeLink === 'Date of assessment') {
      await this.page.locator(this.FinancePageElements.assessmentDateOfAssessmentCYAChangeLink).click()
    } else if (changeLink === 'Requires a bank account application') {
      await this.page.locator(this.FinancePageElements.assessmentRequiresBankAccountCYAChangeLink).click()
    } else if (changeLink === 'Requires an ID application') {
      await this.page.locator(this.FinancePageElements.assessmentRequiresAnIDCYAChangeLink).click()
    } else if (changeLink === 'Existing ID') {
      await this.page.locator(this.FinancePageElements.assessmentExistingIDCYAChangeLink).click()
    } else {
      console.log('check link spelling')
      expect(changeLink).toBeFalsy()
    }
  }

  public async verifyAssessmentDateTextInCYAPage() {
    return this.page.locator(this.FinancePageElements.assessmentDateOfAssessmentCYAPageText).textContent()
  }

  public async verifyAssessmentRequireABankAccountOptionTextInCYAPage() {
    return (
      await this.page.locator(this.FinancePageElements.assessmentRequiresBankAccountCYAPageText).textContent()
    ).trim()
  }

  public async verifyAssessmentRequireAnIDTextInCYAPage() {
    return (await this.page.locator(this.FinancePageElements.assessmentRequiresAnIDCYAPageText).textContent()).trim()
  }

  public async verifyAssessmentSelectIDTextInCYAPage() {
    // return ((await this.page.locator(this.FinancePageElements.assessmentExistingIDCYAPageText).textContent()).trimEnd()).trimStart();
    return (await this.page.locator(this.FinancePageElements.assessmentExistingIDCYAPageText).textContent()).replace(
      /\s+/g,
      '',
    )
  }

  public async enterAssessmentDate(assessmentDate: any) {
    console.log(`Entering the requested date  ${assessmentDate}`)
    const splitApplicationDate = assessmentDate.split('/')
    const date = splitApplicationDate[0]
    const month = splitApplicationDate[1]
    const year = splitApplicationDate[2]
    await this.page.locator(this.FinancePageElements.financeAssessmentDate).fill(date)
    await this.page.locator(this.FinancePageElements.financeAssessmentMonth).fill(month)
    await this.page.locator(this.FinancePageElements.financeAssessmentYear).fill(year)
  }

  public async AssessmentSelectID(assessmentID: string) {
    console.log(`Selecting the ${assessmentID} bank`)
    if (assessmentID === 'Birth Certificate') {
      await this.page.locator(this.FinancePageElements.financeAssessmentBirthCertificateOption).click()
    } else if (assessmentID === 'Marriage Certificate') {
      await this.page.locator(this.FinancePageElements.financeAssessmentMarriageCertificateOption).click()
    } else if (assessmentID === 'Civil Partnership') {
      await this.page.locator(this.FinancePageElements.financeAssessmentCivilPartnershipOption).click()
    } else if (assessmentID === 'Adoption certificate') {
      await this.page.locator(this.FinancePageElements.financeAssessmentAdoptionOption).click()
    } else if (assessmentID === 'Divorce') {
      await this.page.locator(this.FinancePageElements.financeAssessmentDivorceOption).click()
    } else if (assessmentID === 'Driving License') {
      await this.page.locator(this.FinancePageElements.financeAssessmentDrivingLicenseOption).click()
    } else if (assessmentID === 'BRP') {
      await this.page.locator(this.FinancePageElements.financeAssessmentBRPOption).click()
    } else if (assessmentID === 'Deed Poll') {
      await this.page.locator(this.FinancePageElements.financeAssessmentDeedPollOption).click()
    } else if (assessmentID === 'All') {
      await this.page.locator(this.FinancePageElements.financeAssessmentBirthCertificateOption).click()
      await this.page.locator(this.FinancePageElements.financeAssessmentMarriageCertificateOption).click()
      await this.page.locator(this.FinancePageElements.financeAssessmentCivilPartnershipOption).click()
      await this.page.locator(this.FinancePageElements.financeAssessmentAdoptionOption).click()
      await this.page.locator(this.FinancePageElements.financeAssessmentDivorceOption).click()
      await this.page.locator(this.FinancePageElements.financeAssessmentDrivingLicenseOption).click()
      await this.page.locator(this.FinancePageElements.financeAssessmentBRPOption).click()
      await this.page.locator(this.FinancePageElements.financeAssessmentDeedPollOption).click()
    } else if (assessmentID === 'None') {
      console.log('Nothing selected')
    } else {
      console.log(`check bank spelling${assessmentID}`)
      expect(assessmentID).toBeFalsy()
    }
  }

  public async selectAssessmentRequireABankAccountOption(assessmentHaveBankAccount: string) {
    if (assessmentHaveBankAccount === 'Yes') {
      await this.page.locator(this.FinancePageElements.financeAssessmentRequireBankAccountYes).click()
    } else if (assessmentHaveBankAccount === 'No') {
      await this.page.locator(this.FinancePageElements.financeAssessmentRequireBankAccountNo).click()
    } else {
      console.log('check personal item option spelling')
      expect(assessmentHaveBankAccount).toBeFalsy()
    }
  }

  public async selectAssessmentRequireAnID(assessmentHaveID: string) {
    if (assessmentHaveID === 'Yes') {
      await this.page.locator(this.FinancePageElements.financeAssessmentRequireIDYes).click()
    } else if (assessmentHaveID === 'No') {
      await this.page.locator(this.FinancePageElements.financeAssessmentRequireIDNo).click()
    } else {
      console.log('check personal item option spelling')
      expect(assessmentHaveID).toBeFalsy()
    }
  }

  public async clickOnCompleteAssessmentNowLink() {
    await this.page.locator(this.FinancePageElements.FinanceAndIDCompleteAssessmentLink).click()
  }

  public async getAssessmentText() {
    return (
      await this.page.locator(this.FinancePageElements.FinanceAndIDCompleteAssessmentImportantText).textContent()
    ).replace(/\s+/g, '')
  }

  // Bank Tests

  public async getBankApplicationUpdateCYAPageStatusText() {
    return this.page.locator(this.FinancePageElements.bankApplicationUpdateCYAPageStatusText).textContent()
  }

  public async getBankApplicationReSubmittedCYAPageApplicationResubmittedText() {
    return (
      await this.page
        .locator(this.FinancePageElements.bankApplicationResubmittedCYAPageApplicationResubmittedText)
        .textContent()
    ).trim()
  }

  public async getBankApplicationReSubmittedCYAPageStatusText() {
    return (
      await this.page
        .locator(this.FinancePageElements.bankApplicationResubmittedCYAPageApplicationStatusText)
        .textContent()
    ).trim()
  }

  public async getBankApplicationReSubmittedCYAPageDateAccountOpenedText() {
    return (
      await this.page
        .locator(this.FinancePageElements.bankApplicationResubmittedCYAPageDateAccountOpenedText)
        .textContent()
    ).trim()
  }

  public async getBankApplicationReSubmittedCYAPageAddedToPersonalItemsText() {
    return (
      await this.page
        .locator(this.FinancePageElements.bankApplicationResubmittedCYAPageAddedToPersonalItemsText)
        .textContent()
    ).trim()
  }

  public async getBankApplicationReSubmittedCYAPageDateHeardBackText() {
    return this.page.locator(this.FinancePageElements.bankApplicationResubmittedCYAPageDateHeardBackText).textContent()
  }

  public async getBankApplicationUpdateCYAPageDateHeardBackText() {
    return this.page.locator(this.FinancePageElements.bankApplicationUpdateCYAPageDateHeardBackText).textContent()
  }

  public async getBankApplicationUpdateCYAPageAddedToPersonalItemsText(personalItems: string) {
    if (personalItems === 'N/A') {
      return 'N/A'
    }
    return (
      await this.page
        .locator(this.FinancePageElements.bankApplicationUpdateCYAPageAddedToPersonalItemsText)
        .textContent()
    ).trim()
  }

  public async selectBankApplicationUpdateStatusPersonalItem(personalItemSelection: string) {
    if (personalItemSelection === 'Yes') {
      await this.page.locator(this.FinancePageElements.yesPersonalItemOption).click()
    } else if (personalItemSelection === 'No') {
      await this.page.locator(this.FinancePageElements.noPersonalItemOption).click()
    } else if (personalItemSelection === 'N/A') {
      console.log('Personal Items not present on this page')
    } else {
      console.log('check personal item option spelling')
      expect(personalItemSelection).toBeFalsy()
    }
  }

  public async enterBankApplicationUpdateStatusPersonalItemDate(personalItemDate: string) {
    if (personalItemDate === 'N/A') {
      console.log('Selected No hence no personal item date entered')
    } else if ((await this.page.locator(this.FinancePageElements.yesPersonalItemOption).isVisible()) === true) {
      await this.enterPersonalItemAddedDate(personalItemDate)
    } else {
      await this.enterPersonalItemAddedDate(personalItemDate)
    }
  }

  public async enterPersonalItemAddedDate(applicationDate: string) {
    console.log(`Entering the personal date  ${applicationDate}`)
    const splitApplicationDate = applicationDate.split('/')
    const date = splitApplicationDate[0]
    const month = splitApplicationDate[1]
    const year = splitApplicationDate[2]
    await this.page.locator(this.FinancePageElements.personalItemDate).fill(date)
    await this.page.locator(this.FinancePageElements.personalItemMonth).fill(month)
    await this.page.locator(this.FinancePageElements.personalItemYear).fill(year)
  }

  public async selectApplicationStatus(applicationStatus: string) {
    await pageFixture.page.waitForTimeout(1000)
    console.log(`Selecting the ${applicationStatus} bank`)
    if (
      applicationStatus === 'Account opened' ||
      applicationStatus === 'Account declined' ||
      applicationStatus === 'Returned ineligible' ||
      applicationStatus === 'Returned inaccurate' ||
      applicationStatus === 'Returned incomplete'
    ) {
      await this.page.locator(this.FinancePageElements.bankApplicationStatus).selectOption(applicationStatus)
      await pageFixture.page.waitForTimeout(1000)
      await expect(await this.page.locator(this.FinancePageElements.bankApplicationStatus).textContent()).toContain(
        applicationStatus,
      )
    } else {
      console.log('check bank spelling')
      expect(applicationStatus).toBeFalsy()
    }
  }

  public async enterBankApplicationReSubmittedDate(applicationDate: string) {
    console.log(`Entering the personal date  ${applicationDate}`)
    const splitApplicationDate = applicationDate.split('/')
    const date = splitApplicationDate[0]
    const month = splitApplicationDate[1]
    const year = splitApplicationDate[2]
    await this.page.locator(this.FinancePageElements.bankApplicationResubmittedDay).fill(date)
    await this.page.locator(this.FinancePageElements.bankApplicationResubmittedMonth).fill(month)
    await this.page.locator(this.FinancePageElements.bankApplicationResubmittedYear).fill(year)
  }

  public async enterBankApplicationReSubmittedAccountOpenedDate(applicationDate: string) {
    console.log(`Entering the date${applicationDate}`)
    const splitApplicationDate = applicationDate.split('/')
    const date = splitApplicationDate[0]
    const month = splitApplicationDate[1]
    const year = splitApplicationDate[2]
    await this.page.locator(this.FinancePageElements.bankApplicationResubmittedReceivedDay).fill(date)
    await this.page.locator(this.FinancePageElements.bankApplicationResubmittedReceivedMonth).fill(month)
    await this.page.locator(this.FinancePageElements.bankApplicationResubmittedReceivedYear).fill(year)
  }

  public async enterBankApplicationReSubmittedHeardBackDate(applicationDate: string) {
    console.log(`Entering the date${applicationDate}`)
    const splitApplicationDate = applicationDate.split('/')
    const date = splitApplicationDate[0]
    const month = splitApplicationDate[1]
    const year = splitApplicationDate[2]
    await this.page.locator(this.FinancePageElements.bankApplicationResubmittedHeardDay).fill(date)
    await this.page.locator(this.FinancePageElements.bankApplicationResubmittedHeardMonth).fill(month)
    await this.page.locator(this.FinancePageElements.bankApplicationResubmittedHeardYear).fill(year)
  }

  public async selectBankApplicationReSubmittedPersonalItemsOption(
    personalItemsOption: string,
    personalItemsDate: string,
  ) {
    if (personalItemsOption === 'Yes' && personalItemsDate === 'N/A') {
      await this.page.locator(this.FinancePageElements.bankApplicationResubmittedPersonalItemYesOption).click()
    } else if (personalItemsOption === 'Yes') {
      await this.page.locator(this.FinancePageElements.bankApplicationResubmittedPersonalItemYesOption).click()
      await this.page
        .locator(this.FinancePageElements.bankApplicationResubmittedPersonalItemDate)
        .waitFor({ state: 'visible' })
      console.log(`Entering the date${personalItemsDate}`)
      const splitApplicationDate = personalItemsDate.split('/')
      const date = splitApplicationDate[0]
      const month = splitApplicationDate[1]
      const year = splitApplicationDate[2]
      await this.page.locator(this.FinancePageElements.bankApplicationResubmittedPersonalItemDate).fill(date)
      await this.page.locator(this.FinancePageElements.bankApplicationResubmittedPersonalItemMonth).fill(month)
      await this.page.locator(this.FinancePageElements.bankApplicationResubmittedPersonalItemYear).fill(year)
    } else if (personalItemsOption === 'No' && personalItemsDate === 'No') {
      await this.page.locator(this.FinancePageElements.bankApplicationResubmittedPersonalItemNoOption).click()
    } else if (personalItemsOption === 'No' && personalItemsDate === 'N/A') {
      await this.page.locator(this.FinancePageElements.bankApplicationResubmittedPersonalItemNoOption).click()
    } else if (personalItemsOption === 'N/A' && personalItemsDate === 'No') {
      console.log('Not clicking on any option')
    } else if (personalItemsOption === 'N/A' && personalItemsDate === 'N/A') {
      console.log('Not clicking on any option')
    } else {
      console.log('check bank spelling')
      expect(personalItemsOption).toBeFalsy()
    }
  }

  public async clickOnChangeLinkInTheResubmittedBankApplicationCYAPage(idEntry: string) {
    console.log(`getting the ${idEntry} text`)
    if (idEntry === 'Application resubmitted') {
      await this.page
        .locator(this.FinancePageElements.bankApplicationResubmittedCYAPageApplicationResubmittedChangeLink)
        .click()
    } else if (idEntry === 'Status') {
      await this.page
        .locator(this.FinancePageElements.bankApplicationResubmittedCYAPageApplicationStatusChangeLink)
        .click()
    } else if (idEntry === 'Date account opened') {
      await this.page
        .locator(this.FinancePageElements.bankApplicationResubmittedCYAPageDateAccountOpenedChangeLink)
        .click()
    } else if (idEntry === 'Added to personal items') {
      await this.page
        .locator(this.FinancePageElements.bankApplicationResubmittedCYAPageAddedToPersonalItemsChangeLink)
        .click()
    } else if (idEntry === 'Date heard back') {
      await this.page.locator(this.FinancePageElements.bankApplicationResubmittedCYAPageDateHeardBackChangeLink).click()
    } else {
      console.log('check link spelling')
      expect(idEntry).toBeFalsy()
    }
  }

  public async selectBankApplicationStatus(status: string) {
    if (status === 'N/A') {
      console.log('Doing nothing')
    } else {
      await this.page.locator(this.FinancePageElements.bankApplicationResubmittedStatus).selectOption(status)
    }
  }

  public async clickOnUpdateApplicationButtonFinanceSection() {
    await this.page.locator(this.FinancePageElements.bankApplicationUpdateApplicationButton).click()
  }

  public async clickOnResubmitApplication() {
    await this.page.locator(this.FinancePageElements.bankApplicationResubmitApplicationButton).click()
  }

  public async deleteBankAccountApplication() {
    await this.page.locator(this.FinancePageElements.deleteBankAccountApplicationLink).click()
    await this.page
      .locator(this.FinancePageElements.confirmDeleteBankAccountApplicationButton)
      .waitFor({ state: 'visible' })
    await this.page.locator(this.FinancePageElements.confirmDeleteBankAccountApplicationButton).click()
  }

  public async getBankDetailsEntryInFinanceSectionOfFinanceIDPage() {
    return this.page.locator(this.FinancePageElements.bankFinanceSectionEntry).textContent()
  }

  public async getApplicationSubmittedEntryInFinanceSectionOfFinanceIDPage() {
    return this.page.locator(this.FinancePageElements.bankApplicationSubmittedFinanceSectionEntry).textContent()
  }

  public async getStatusInFinanceSectionOfFinanceIDPage() {
    return this.page.locator(this.FinancePageElements.bankStatusFinanceSectionEntry).textContent()
  }

  public async getApplicationReturnedEntryInFinanceSectionOfFinanceIDPage() {
    return this.page
      .locator(this.FinancePageElements.bankApplicationUpdateApplicationReturnedDateFinanceSectionEntry)
      .textContent()
  }

  public async getPersonalItemsEntryInFinanceSectionOfFinanceIDPage(personalItems: string) {
    if (personalItems === 'Yes' || personalItems === 'No') {
      return (
        await this.page
          .locator(this.FinancePageElements.bankApplicationUpdateAddedToPersonalItemsFinanceSectionEntry)
          .textContent()
      ).trim()
    }
    if (personalItems === 'N/A') {
      return 'N/A'
    }
    console.log('check bank spelling')
    expect(personalItems).toBeFalsy()
    return null
  }

  public async getApplicationHistoryApplicationSubmittedEntryInFinanceSectionOfFinanceIDPage() {
    return this.page
      .locator(this.FinancePageElements.bankApplicationHistoryApplicationSubmittedFinanceSectionEntry)
      .textContent()
  }

  public async getApplicationHistoryResponseDatedEntryInFinanceSectionOfFinanceIDPage() {
    return this.page
      .locator(this.FinancePageElements.bankApplicationHistoryApplicationReturnedFinanceSectionEntry)
      .textContent()
  }

  public async getApplicationHistoryApplicationResubmittedEntryInFinanceSectionOfFinanceIDPage() {
    return this.page
      .locator(this.FinancePageElements.bankApplicationResubmittedApplicationResubmittedFinanceSectionEntry)
      .textContent()
  }

  public async getApplicationHistoryApplicationResubmittedAccountOpenedDateEntryInFinanceSectionOfFinanceIDPage() {
    return this.page
      .locator(this.FinancePageElements.bankApplicationResubmittedDateAccountOpenedFinanceSectionEntry)
      .textContent()
  }

  public async getApplicationHistoryApplicationResubmittedAccountRejectedDateEntryInFinanceSectionOfFinanceIDPage() {
    return this.page
      .locator(this.FinancePageElements.bankApplicationResubmittedDateHeardBackFinanceSectionEntry)
      .textContent()
  }

  public async checkAddBankAccountApplicationButtonIsPresent() {
    return this.page.locator(this.FinancePageElements.addABankAccountApplicationButton).isVisible()
  }

  public async clickOnConfirmBankAccountApplyButton() {
    await this.page.locator(this.FinancePageElements.confirmBankAccountCYAButton).click()
  }

  public async getBankDetailsEntryInCYABankAccountApplyPage() {
    // await this.page.locator(this.FinancePageElements.bankCYAEntry).waitFor({state: "visible"});
    return this.page.locator(this.FinancePageElements.bankCYAEntry).textContent()
  }

  public async getApplicationSubmittedEntryInCYABankAccountApplyPage() {
    return this.page.locator(this.FinancePageElements.bankApplicationSubmittedCYAEntry).textContent()
  }

  public async clickOnBankChangeCYAPageLink(ApplyForBankAccountCYAChangeLink: string) {
    console.log(`check bank spelling${ApplyForBankAccountCYAChangeLink}`)
    if (ApplyForBankAccountCYAChangeLink === 'Bank' || ApplyForBankAccountCYAChangeLink === 'bank') {
      await this.page.locator(this.FinancePageElements.bankCYAChangeLink).click()
    } else if (ApplyForBankAccountCYAChangeLink === 'Application submitted') {
      await this.page.locator(this.FinancePageElements.bankApplicationSubmittedCYAChangeLink).click()
    } else {
      console.log('check bank spelling')
      expect(ApplyForBankAccountCYAChangeLink).toBeFalsy()
    }
  }

  public async verifyAdditionalIDInformationPageTitle() {
    await expect(this.page).toHaveTitle(this.FinanceAndIDPageTitleElements.AdditionalIDInformationPageTitle)
  }

  public async selectIDType(idType: string) {
    if (idType === 'N/A' || idType === 'None') {
      console.log('Selecting No ID Type')
    } else {
      console.log(`Selecting the ${idType} bank`)

      await this.page.locator(this.FinancePageElements.selectIDType).selectOption(idType)
    }
  }

  public async clickOnSubmitButton() {
    await this.page.locator(this.FinancePageElements.submitBankAccountButton).click()
  }

  public async verifyApplyForBankAccountCYAPageTitle() {
    await expect(this.page).toHaveTitle(this.FinanceAndIDPageTitleElements.AddABankAccountCYAPageTitle)
  }

  public async verifyApplyForAssessmentCYAPageTitle() {
    await expect(this.page).toHaveTitle(this.FinanceAndIDPageTitleElements.AssessmentCheckCYAPageTitle)
  }

  public async selectBank(bankName: string) {
    console.log(`Selecting the ${bankName} bank`)
    if (
      bankName === 'Barclays' ||
      bankName === 'Co-op' ||
      bankName === 'HSBC' ||
      bankName === 'Lloyds' ||
      bankName === 'Nationwide' ||
      bankName === 'NatWest' ||
      bankName === 'Santander'
    ) {
      await this.page.locator(this.FinancePageElements.selectBank).selectOption(bankName)
    } else {
      console.log('check bank spelling')
      expect(bankName).toBeFalsy()
    }
  }

  public async enterApplicationSubmittedDate(applicationDate: string) {
    console.log(`Entering the submitted date  ${applicationDate}`)
    const splitApplicationDate = applicationDate.split('/')
    const date = splitApplicationDate[0]
    const month = splitApplicationDate[1]
    const year = splitApplicationDate[2]
    await this.page.locator(this.FinancePageElements.applicationSubmittedDate).fill(date)
    await this.page.locator(this.FinancePageElements.applicationSubmittedMonth).fill(month)
    await this.page.locator(this.FinancePageElements.applicationSubmittedYear).fill(year)
  }

  public async enterApplicationRequestedDate(applicationDate: string) {
    console.log(`Entering the requested date  ${applicationDate}`)
    const splitApplicationDate = applicationDate.split('/')
    const date = splitApplicationDate[0]
    const month = splitApplicationDate[1]
    const year = splitApplicationDate[2]
    await this.page.locator(this.FinancePageElements.applicationRequestedDate).fill(date)
    await this.page.locator(this.FinancePageElements.applicationRequestedMonth).fill(month)
    await this.page.locator(this.FinancePageElements.applicationRequestedYear).fill(year)
  }

  public async enterBankApplicationReceivedDate(applicationDate: string) {
    // await this.page.locator(this.FinancePageElements.bankAccountReceivedDay).waitFor({state: "visible"});
    console.log(`Entering the requested date  ${applicationDate}`)
    const splitApplicationDate = applicationDate.split('/')
    const date = splitApplicationDate[0]
    const month = splitApplicationDate[1]
    const year = splitApplicationDate[2]
    await this.page.locator(this.FinancePageElements.bankAccountReceivedDay).fill(date)
    await this.page.locator(this.FinancePageElements.bankApplicationReceivedMonth).fill(month)
    await this.page.locator(this.FinancePageElements.bankApplicationReceivedYear).fill(year)
  }

  public async enterBankApplicationHeardBackDate(applicationDate: string) {
    console.log(`Entering the requested date  ${applicationDate}`)
    const splitApplicationDate = applicationDate.split('/')
    const date = splitApplicationDate[0]
    const month = splitApplicationDate[1]
    const year = splitApplicationDate[2]
    await this.page.locator(this.FinancePageElements.bankApplicationHeardBackDay).fill(date)
    await this.page.locator(this.FinancePageElements.bankApplicationHeardBackMonth).fill(month)
    await this.page.locator(this.FinancePageElements.bankApplicationHeardBackYear).fill(year)
  }

  public async createABankAccountApplication(bank: string, applicationDate: string) {
    await this.deleteAnyExistingApplication('bank account')
    await this.clickOnAddABankAccountButton()
    await this.verifyAddABankAccountPageIsDisplayed()
    await this.selectBank(bank)
    await this.enterApplicationSubmittedDate(applicationDate)
    await this.clickOnSubmitButton()
    await this.clickOnConfirmBankAccountApplyButton()
    await this.verifyFinanceAndIdPageIsDisplayed()
  }

  public async deleteAnyExistingApplication(financeApplication: string) {
    if (financeApplication === 'bank account') {
      if ((await this.page.locator(this.FinancePageElements.deleteBankAccountApplicationLink).isVisible()) === true) {
        await this.page.locator(this.FinancePageElements.deleteBankAccountApplicationLink).click()
        await this.page
          .locator(this.FinancePageElements.confirmDeleteBankAccountApplicationButton)
          .waitFor({ state: 'visible' })
        await this.page.locator(this.FinancePageElements.confirmDeleteBankAccountApplicationButton).click()
      } else console.log('No Bank Accounts Applications present')
    } else if (financeApplication === 'Finance assessments') {
      if (
        (await this.page.locator(this.FinancePageElements.FinanceAndIDCompleteAssessmentImportantText).isVisible()) ===
        true
      ) {
        console.log('No Assessment entries')
      } else {
        console.log('Deleting Assessment Entries')
        await this.page.locator(this.FinancePageElements.deleteAssessmentInFinanceAndIDAssessmentSection).click()
        await this.page
          .locator(this.FinancePageElements.confirmDeleteAssessmentInFinanceAndIDAssessmentSection)
          .waitFor({ state: 'visible' })
        await this.page.locator(this.FinancePageElements.confirmDeleteAssessmentInFinanceAndIDAssessmentSection).click()
      }
    } else if (financeApplication === 'ID') {
      await this.deleteAllIdApplication()
    } else {
      console.log('Application Type does not exist')
      expect(financeApplication).toBeFalsy()
    }
  }

  public async deleteAllIdApplication() {
    const iDApplications = this.page.locator(this.FinancePageElements.deleteIDApplicationLink)
    const totalNumberOfIdApplications = await iDApplications.count()
    if (totalNumberOfIdApplications === 0) {
      console.log('There is nothing to delete here')
    } else {
      console.log(`There are ${totalNumberOfIdApplications} to be deleted`)
      for (let i = 0; i < totalNumberOfIdApplications; i += 1) {
        const uniqueLocatorToDeleteID = iDApplications.nth(0) // Adding the nth value
        // eslint-disable-next-line no-await-in-loop
        await uniqueLocatorToDeleteID.click()
        const confirmDelete = this.page.locator(this.FinancePageElements.confirmDeleteIdApplicationButton)
        const uniqueLocatorToConfirmDeleteID = confirmDelete.nth(0) // Adds a square bracket to the locator and populates it with a value 0
        // eslint-disable-next-line no-await-in-loop
        await uniqueLocatorToConfirmDeleteID.waitFor({ state: 'visible' })
        // eslint-disable-next-line no-await-in-loop
        await uniqueLocatorToConfirmDeleteID.click()
      }
    }
  }

  public async clickOnFinanceAndIDTabViaFinancePage() {
    await this.page.locator(this.FinancePageElements.FinanceAndIDResettlementOverviewTabViaFinancePage).click()
  }

  public async verifyFinanceAndIdPageIsDisplayed() {
    await expect(this.page).toHaveTitle(this.FinanceAndIDPageTitleElements.FinanceAndIDPageTitle)
  }

  public async clickOnFinanceAndIDAssessmentLink() {
    await this.page.locator(this.FinancePageElements.FinanceAndIDAssessmentTreeLink).click()
  }

  public async clickOnFinanceLink() {
    await this.page.locator(this.FinancePageElements.FinanceTreeLink).click()
  }

  public async clickOnAddABankAccountButton() {
    await this.page.locator(this.FinancePageElements.addABankAccountApplicationButton).click()
  }

  public async verifyAddABankAccountPageIsDisplayed() {
    await expect(this.page).toHaveTitle(this.FinanceAndIDPageTitleElements.AddABankAccountPageTitle)
  }

  public async clickOnIdDocumentLink() {
    await this.page.locator(this.FinancePageElements.IDDocumentsTreeLink).click()
  }

  public async clickOnAddAnIdButton() {
    await this.page.locator(this.FinancePageElements.addAnIDApplicationButton).click()
  }

  public async verifyAddAnIdApplicationPageIsDisplayed() {
    await expect(this.page).toHaveTitle(this.FinanceAndIDPageTitleElements.ApplyForAnIDPageTitle)
  }

  // public async checkAddAnIDApplicationButtonIsPresent()
  // {
  //     return  this.page.locator(this.FinancePageElements.addAnIDApplicationButton).isVisible();
  // }

  public async selectUpdateApplicationButton() {
    await this.page.locator(this.FinancePageElements.updateIDApplicationButton).click()
  }

  public async selectUpdateApplicationStatus(applicationStatus: string) {
    await this.page
      .locator(this.FinancePageElements.updateIDApplicationSelectApplicationStatus)
      .selectOption(applicationStatus)
  }

  public async enterUpdateApplicationDateIdReceivedDate(idReceivedDate: string) {
    if (idReceivedDate === 'N/A') {
      console.log('Nothing to see here')
    } else {
      await this.page.locator(this.FinancePageElements.updateIDApplicationReceivedDate).waitFor({ state: 'visible' })
      console.log(`Entering the requested date  ${idReceivedDate}`)
      const splitApplicationDate = idReceivedDate.split('/')
      const date = splitApplicationDate[0]
      const month = splitApplicationDate[1]
      const year = splitApplicationDate[2]
      await this.page.locator(this.FinancePageElements.updateIDApplicationReceivedDate).fill(date)
      await this.page.locator(this.FinancePageElements.updateIDApplicationReceivedMonth).fill(month)
      await this.page.locator(this.FinancePageElements.updateIDApplicationReceivedDYear).fill(year)
    }
  }

  public async selectUpdateApplicationPersonalItem(personalItemOption: string) {
    if (personalItemOption === 'Yes') {
      await this.page.locator(this.FinancePageElements.updateIDPersonalItemYesOption).click()
    } else if (personalItemOption === 'No') {
      await this.page.locator(this.FinancePageElements.updateIDPersonalItemNoOption).click()
    } else if (personalItemOption === 'N/A') {
      console.log('Nothing to see here')
    }
  }

  public async enterUpdateApplicationPersonalItemDate(personalItemsDate: string) {
    if (personalItemsDate === 'N/A') {
      console.log('Nothing to see here')
    } else {
      console.log(`Entering the requested date  ${personalItemsDate}`)
      const splitApplicationDate = personalItemsDate.split('/')
      const date = splitApplicationDate[0]
      const month = splitApplicationDate[1]
      const year = splitApplicationDate[2]
      await this.page.locator(this.FinancePageElements.updateIDPersonalItemDate).fill(date)
      await this.page.locator(this.FinancePageElements.updateIDPersonalItemMonth).fill(month)
      await this.page.locator(this.FinancePageElements.updateIDPersonalItemYear).fill(year)
    }
  }

  public async enterUpdateApplicationRefundAmount(refundAmount: string) {
    await this.page.locator(this.FinancePageElements.updateApplicationRefundAmount).fill(refundAmount)
  }

  public async getTotalNumberOfIdApplicationsInFinanceOverviewTab() {
    return (await this.page.locator(this.FinancePageElements.allIDApplications)).count()
  }
}
