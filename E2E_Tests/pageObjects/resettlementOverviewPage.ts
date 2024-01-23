import { expect, Page } from '@playwright/test'
import { pageTitles } from '../hooks/pageTitles'

export default class ResettlementOverviewPage {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  private ResettlementOverviewPageElements = {
    clickOnLicenseConditions: "//a[normalize-space()='Licence conditions']",
    clickOnStandardLicenseConditionsLink: "//section[@id='licence-summary']/div/details/summary",
    licenseConditionHeader: "//section[@id='licence-summary']/header",
    licenseConditionsMapLink: "//section[@id='licence-summary']/div[1]/ol/li[2]/a",
    licenseConditionsMap: "//img[@alt='Map for licence condition']",
    ResettlementStatusText: "//section[@id='pathway-status']/header/h3/strong",
    updatePathwayButton: "//a[normalize-space()='Update status or notes']",
    updatePathwayStatusButton: "//button[normalize-space()='Update']",
    pathwayStatusSuccessTextTitle: "//h2[@id='govuk-notification-banner-title']",
    pathwayStatusSuccessText: "//div[@class='govuk-notification-banner__content']/h3",
    prisonerNameText: "//div[@class='govuk-grid-row']//div[@class='govuk-grid-column-three-quarters']/h1",
    prisonerGridProfileInformation: "//div[@class='govuk-grid-row profile-header']/div/div",
    resettlementOverviewTab: "//nav[@aria-label='Sub navigation']/ul/li[1]",
    accommodationTab: "//nav[@aria-label='Sub navigation']/ul/li[2]",
    attitudesTab: "//nav[@aria-label='Sub navigation']/ul/li[3]",
    childrenTab: "//nav[@aria-label='Sub navigation']/ul/li[4]",
    drugsTab: "//nav[@aria-label='Sub navigation']/ul/li[5]",
    educationTab: "//nav[@aria-label='Sub navigation']/ul/li[6]",
    financeTab: "//nav[@aria-label='Sub navigation']/ul/li[7]",
    healthTab: "//nav[@aria-label='Sub navigation']/ul/li[8]",
    notStartedOption: "//input[@id='NOT_STARTED']",
    inProgressOption: "//input[@id='IN_PROGRESS']",
    supportNotRequiredOption: "//input[@id='SUPPORT_NOT_REQUIRED']",
    supportDeclinedOption: "//input[@id='SUPPORT_DECLINED']",
    doneOption: "//input[@id='DONE']",
    notStartedCaseNoteText: "//div[@id='caseNote_NOT_STARTED']//textarea[@id='caseNoteInput']",
    inProgressCaseNoteText: "//div[@id='caseNote_IN_PROGRESS']//textarea[@id='caseNoteInput']",
    supportNotRequiredCaseNoteText: "//div[@id='caseNote_SUPPORT_NOT_REQUIRED']//textarea[@id='caseNoteInput']",
    supportDeclinedCaseNoteText: "//div[@id='caseNote_SUPPORT_DECLINED']//textarea[@id='caseNoteInput']",
    doneCaseNoteText: "//div[@id='caseNote_DONE']//textarea[@id='caseNoteInput']",
    resettlementOverviewPathwayStatusesTableRows: "//section[@id='status']/div/table/tbody/tr",
    resettlementOverviewPathwayStatusesTableColumns: "//section[@id='status']/div/table/tbody/tr[1]/td",
    accommodationResettlementOverviewTabPathwayStatus: "//section[@id='status']/div/table/tbody/tr[1]/td/strong",
    attitudesResettlementOverviewTabPathwayStatus: "//section[@id='status']/div/table/tbody/tr[2]/td/strong",
    childrenResettlementOverviewTabPathwayStatus: "//section[@id='status']/div/table/tbody/tr[3]/td/strong",
    drugsResettlementOverviewTabPathwayStatus: "//section[@id='status']/div/table/tbody/tr[4]/td/strong",
    educationResettlementOverviewTabPathwayStatus: "//section[@id='status']/div/table/tbody/tr[5]/td/strong",
    financeResettlementOverviewTabPathwayStatus: "//section[@id='status']/div/table/tbody/tr[6]/td/strong",
    healthResettlementOverviewTabPathwayStatus: "//section[@id='status']/div/table/tbody/tr[7]/td/strong",
    accommodationResettlementOverviewTabPathwayLastUpdateText: "//section[@id='status']/div/table/tbody/tr[1]/td/p",
    attitudesResettlementOverviewTabPathwayLastUpdateText: "//section[@id='status']/div/table/tbody/tr[2]/td/p",
    childrenResettlementOverviewTabPathwayLastUpdateText: "//section[@id='status']/div/table/tbody/tr[3]/td/p",
    drugsResettlementOverviewTabPathwayLastUpdateText: "//section[@id='status']/div/table/tbody/tr[4]/td/p",
    educationResettlementOverviewTabPathwayLastUpdateText: "//section[@id='status']/div/table/tbody/tr[5]/td/p",
    financeResettlementOverviewTabPathwayLastUpdateText: "//section[@id='status']/div/table/tbody/tr[6]/td/p",
    healthResettlementOverviewTabPathwayLastUpdateText: "//section[@id='status']/div/table/tbody/tr[7]/td/p",
    accommodationResettlementOverviewTabPathwayLink: "//section[@id='status']/div/table/tbody/tr[1]/th/a",
    attitudesResettlementOverviewTabPathwayLink: "//section[@id='status']/div/table/tbody/tr[2]/th/a",
    childrenResettlementOverviewTabPathwayLink: "//section[@id='status']/div/table/tbody/tr[3]/th/a",
    drugsResettlementOverviewTabPathwayLink: "//section[@id='status']/div/table/tbody/tr[4]/th/a",
    educationResettlementOverviewTabPathwayLink: "//section[@id='status']/div/table/tbody/tr[5]/th/a",
    financeResettlementOverviewTabPathwayLink: "//section[@id='status']/div/table/tbody/tr[6]/th/a",
    healthResettlementOverviewTabPathwayLink: "//section[@id='status']/div/table/tbody/tr[7]/th/a",
    prepareSomeoneForReleaseBreadcrumbLink: "//a[normalize-space()='Prepare someone for release']",
    ResettlementOverviewTabPathwayTabName: "//div[@class='govuk-grid-column-two-thirds']/h2",
    ResettlementOverviewPrisonerReleaseDateSection:
      "//div[@class='govuk-grid-row profile-header']//div[2]//div[1]//div[2]",
    RiskOfSeriousRecidivismStatus: "//section[@id='risk-assessments']/div[1]/table[1]/tbody[1]/tr[1]/td[1]/strong[1]",
    RoSHRiskLevel: "//section[@id='risk-assessments']/div/h4/strong",
    MAPPACategory: "//section[@id='risk-assessments']/div[1]/table[3]/tbody[1]/tr[1]/td[1]",
    MAPPALevel: "//section[@id='risk-assessments']/div[1]/table[3]/tbody[1]/tr[2]/td[1]",
    RiskOfSeriousRecidivismLastUpdateText: "//section[@id='risk-assessments']/div/p[1]",
    RoSHRiskLevelLastUpdateText: "//section[@id='risk-assessments']/div/p[2]",
    MAPPALastUpdateText: "//section[@id='risk-assessments']/div/p[3]",
    caseNoteSection: "//section[@id='case-notes']//h3[@class='app-summary-card__title']",
    caseNotePathwaySelection: "//section[@id='case-notes']/div/div/form/div/select[@name='selectedPathway']",
    caseNoteFilterByDateRangeSelection: "//section[@id='case-notes']/div/div/form/div/select[@name='days']",
    caseNoteSortBySelection: "//section[@id='case-notes']/div/div/form/div/select[@name='sort']",
    caseNoteApplyFiltersButton: "//section[@id='case-notes']/div/div/form/div[4]/button",
    caseNoteApplyFiltersResults: "//section[@id='case-notes']/div/div[2]/div",
    staffContactResettlementOverviewLink: "//a[normalize-space()='Staff contacts']",
    appointmentResettlementOverviewLink: "//a[normalize-space()='Appointments']",
    KeyWorkerStaffContact: "//section[@id='staff-contacts']/div/table/tbody/tr[1]/td",
    POMStaffContact: "//section[@id='staff-contacts']/div/table/tbody/tr[2]/td",
    COMStaffContact: "//section[@id='staff-contacts']/div/table/tbody/tr[3]/td",
    resettlementOverviewPathwayStatusTabViewHistoryButton: "//a[normalize-space()='View history']",
    resettlementOverviewPathwayStatusTabCaseNoteTitle: "//section[@id='case-notes']/header/h3",
    resettlementOverviewNextCaseNotesButton:
      "//li[contains(@class,'moj-pagination__item--next')]//a[contains(@class,'moj-pagination__link')]",
    defaultFilterSettingCaseNoteForClemenceChrisy: "//div[@id='case-notes-container']//div[1]",
    addANewCaseNoteButton: "//a[normalize-space()='Add a case note']",
    addANewCaseNotePageTitle: "//h1[normalize-space()='Add a case note']",
    addANewCaseNotePageSelectPathway: "//select[@id='casenotepathwayselector']",
    addANewCaseNoteContinueButton: "//button[normalize-space()='Continue']",
    firstCaseNoteTitle: "//div[@id='case-notes-container']//div[1]//h3[1]",
    firstCaseNoteResettlementStatusText: "//div[@id='case-notes-container']//div[1]//p[1]",
    firstCaseNoteText: "//div[@id='case-notes-container']//div[1]/div[1]",
    firstCaseNoteHappenedText: "//div[@id='case-notes-container']//div[1]//span[1]",
    firstCaseNoteCreatedText: "//div[@id='case-notes-container']//div[1]//span[2]",
    firstCaseNoteTitleInResettlementOverviewTab: "//section[@id='case-notes']/div/div[2]/div/div[1]/h3",
    firstCaseNoteResettlementStatusTextInResettlementOverviewTab:
      "//section[@id='case-notes']/div/div[2]/div/div[1]/p[1]",
    firstCaseNoteTextInResettlementOverviewTab: "//section[@id='case-notes']/div/div[2]/div/div[1]/div[1]",
    firstCaseNoteHappenedTextInResettlementOverviewTab: "//section[@id='case-notes']/div/div[2]/div/div[1]/span[1]",
    firstCaseNoteCreatedTextInResettlementOverviewTab: "//section[@id='case-notes']/div/div[2]/div/div[1]/span[2]",
    createdByDPSUserMenu: "//select[@id='pathway-select']",
    applyCreatedByCaseNoteFilter: "//button[normalize-space()='Apply filters']",
    appointmentsTableTitlesInResettlementOverviewTab: "//section[@id='appointments']/div/table/thead",
    appointmentsTableFirstEntryInResettlementOverviewTab: "//section[@id='appointments']/div/table/tbody/tr[1]",
  }

  public async clickOnApplyFiltersButtonForCreatedByCaseNotes() {
    await this.page.locator(this.ResettlementOverviewPageElements.applyCreatedByCaseNoteFilter).click()
  }

  public async selectCaseNoteUser(dpsUserNameText: string) {
    console.log(`Selecting the ${dpsUserNameText} filter option`)
    await this.page.locator(this.ResettlementOverviewPageElements.createdByDPSUserMenu).selectOption(dpsUserNameText)
  }

  public async getFirstCaseNoteTitleInResettlementOverviewTab() {
    return (
      await this.page
        .locator(this.ResettlementOverviewPageElements.firstCaseNoteTitleInResettlementOverviewTab)
        .textContent()
    ).trim()
  }

  public async getFirstCaseNoteResettlementStatusTextInResettlementOverviewTab() {
    return (
      await this.page
        .locator(this.ResettlementOverviewPageElements.firstCaseNoteResettlementStatusTextInResettlementOverviewTab)
        .textContent()
    ).trim()
  }

  public async getFirstCaseNoteTextInResettlementOverviewTab() {
    if (
      (await this.page
        .locator(this.ResettlementOverviewPageElements.firstCaseNoteResettlementStatusTextInResettlementOverviewTab)
        .isVisible()) === true
    ) {
      // sometimes the search returns an empty string which is visible; in that scenario we return n/a
      if (
        (await this.page
          .locator(this.ResettlementOverviewPageElements.firstCaseNoteTextInResettlementOverviewTab)
          .textContent()) === ''
      ) {
        return 'N/A'
      }
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.firstCaseNoteTextInResettlementOverviewTab)
          .textContent()
      ).trim()
    }
    return 'N/A'
  }

  public async verifyFirstCaseNoteHappenedTextInResettlementOverviewTab() {
    return (
      await this.page
        .locator(this.ResettlementOverviewPageElements.firstCaseNoteHappenedTextInResettlementOverviewTab)
        .textContent()
    ).trim()
  }

  public async verifyFirstCaseNoteCreatedTextInResettlementOverviewTab() {
    return (
      await this.page
        .locator(this.ResettlementOverviewPageElements.firstCaseNoteCreatedTextInResettlementOverviewTab)
        .textContent()
    ).trim()
  }

  public async getFirstCaseNoteTitle() {
    return (await this.page.locator(this.ResettlementOverviewPageElements.firstCaseNoteTitle).textContent()).trim()
  }

  public async getFirstCaseNoteResettlementStatusText() {
    return (
      await this.page.locator(this.ResettlementOverviewPageElements.firstCaseNoteResettlementStatusText).textContent()
    ).trim()
  }

  public async getFirstCaseNoteText(firstCaseNoteText: string) {
    if (firstCaseNoteText === 'N/A') {
      return 'N/A'
    }
    return (await this.page.locator(this.ResettlementOverviewPageElements.firstCaseNoteText).textContent()).trim()
  }

  public async verifyFirstCaseNoteHappenedText() {
    console.log('Retrieving the first happened text')
    return (
      await this.page.locator(this.ResettlementOverviewPageElements.firstCaseNoteHappenedText).textContent()
    ).trim()
  }

  public async verifyFirstCaseNoteCreatedText() {
    console.log('Retrieving the created case note text')
    return (
      await this.page.locator(this.ResettlementOverviewPageElements.firstCaseNoteCreatedText).textContent()
    ).trim()
  }

  public async createFirstCaseNoteHappenedText() {
    await this.page.waitForTimeout(1000)
    const date = await this.getTodayDate()
    console.log(date) // Fri Jun 17 2022 11:27:28 GMT+0100 (British Summer Time)
    const addedText = 'Happened: '
    return `${addedText}${date}`
  }

  public async createFirstCaseNoteCreatedText(caseNoteUserName: string) {
    await this.page.waitForTimeout(1000)
    const date = await this.getTodayDate()
    console.log(date) // Fri Jun 17 2022 11:27:28 GMT+0100 (British Summer Time)
    const addedText = 'Created: '
    return `${addedText}${date}${caseNoteUserName}`
  }

  public async verifyPathwayResettlementOverviewPage(pathwayTabName: string) {
    console.log(`Selecting the ${pathwayTabName} Filter by pathway for prisoner Case notes`)
    if (
      pathwayTabName === 'All pathways' ||
      pathwayTabName === 'Accommodation' ||
      pathwayTabName === 'Attitudes, thinking and behaviour' ||
      pathwayTabName === 'Children, families and communities'
    ) {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.ResettlementOverviewTabPathwayTabName)
          .textContent()
      ).trim()
    }
    if (
      pathwayTabName === 'Drugs and alcohol' ||
      pathwayTabName === 'Education, skills and work' ||
      pathwayTabName === 'Finance and ID' ||
      pathwayTabName === 'Health'
    ) {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.ResettlementOverviewTabPathwayTabName)
          .textContent()
      ).trim()
    }
    throw new Error('No pathway tab name found')

    // console.log('check pathway spelling')
    // expect(pathwayTabName).toBeFalsy()
  }

  public async clickOnContinueInAddANewCasePage() {
    await this.page.locator(this.ResettlementOverviewPageElements.addANewCaseNoteContinueButton).click()
  }

  public async selectPathwayInAddACaseNotePage(pathwayStatusForAddCaseNotes: string) {
    console.log(`Selecting the ${pathwayStatusForAddCaseNotes} Filter by pathway for prisoner Case notes`)
    if (
      pathwayStatusForAddCaseNotes === 'All pathways' ||
      pathwayStatusForAddCaseNotes === 'Accommodation' ||
      pathwayStatusForAddCaseNotes === 'Attitudes, thinking and behaviour' ||
      pathwayStatusForAddCaseNotes === 'Children, families and communities'
    ) {
      return this.page
        .locator(this.ResettlementOverviewPageElements.addANewCaseNotePageSelectPathway)
        .selectOption(pathwayStatusForAddCaseNotes)
    }
    if (
      pathwayStatusForAddCaseNotes === 'Drugs and alcohol' ||
      pathwayStatusForAddCaseNotes === 'Education, skills and work' ||
      pathwayStatusForAddCaseNotes === 'Finance and ID' ||
      pathwayStatusForAddCaseNotes === 'Health'
    ) {
      return this.page
        .locator(this.ResettlementOverviewPageElements.addANewCaseNotePageSelectPathway)
        .selectOption(pathwayStatusForAddCaseNotes)
    }
    console.log('check pathway spelling')
    expect(pathwayStatusForAddCaseNotes).toBeFalsy()
    return null
  }

  public async getAddACaseNotePageTitle() {
    return (
      await this.page.locator(this.ResettlementOverviewPageElements.addANewCaseNotePageTitle).textContent()
    ).trim()
  }

  public async clickOnAddANewCaseNoteButton() {
    await this.page.locator(this.ResettlementOverviewPageElements.addANewCaseNoteButton).click()
  }

  public async clickThroughAllCaseNotesFilterPageTillTheLastPage() {
    if (
      await this.page.locator(this.ResettlementOverviewPageElements.resettlementOverviewNextCaseNotesButton).isVisible()
    ) {
      do {
        // eslint-disable-next-line no-await-in-loop
        await this.clickOnNextCaseNotesButton()
        if (
          // eslint-disable-next-line no-await-in-loop
          await this.page
            .locator(this.ResettlementOverviewPageElements.resettlementOverviewNextCaseNotesButton)
            .isHidden()
        ) {
          console.log('Clicked Through All Pages of the Case Note Sort')
          // eslint-disable-next-line no-await-in-loop
          await this.page.waitForTimeout(1000)
          break
        }
      } while (
        // eslint-disable-next-line no-await-in-loop
        await this.page
          .locator(this.ResettlementOverviewPageElements.resettlementOverviewNextCaseNotesButton)
          .isVisible()
      )
    } else {
      console.log('No additional Case Note Pages')
    }
  }

  public async clickOnNextCaseNotesButton() {
    await this.page.locator(this.ResettlementOverviewPageElements.resettlementOverviewNextCaseNotesButton).click()
  }

  public async getPathwayStatusTabCaseNoteTitle() {
    console.log('Clicking on the View History button and verifying the case notes title is displayed for the pathway')
    await this.page
      .locator(this.ResettlementOverviewPageElements.resettlementOverviewPathwayStatusTabViewHistoryButton)
      .click()
    return (
      await this.page
        .locator(this.ResettlementOverviewPageElements.resettlementOverviewPathwayStatusTabCaseNoteTitle)
        .textContent()
    ).trim()
  }

  public async clickOnStaffContactsLink() {
    await this.page.locator(this.ResettlementOverviewPageElements.staffContactResettlementOverviewLink).click()
  }

  public async clickOnAppointmentLink() {
    await this.page.locator(this.ResettlementOverviewPageElements.appointmentResettlementOverviewLink).click()
  }

  public async getKeyWorkerStaffContact() {
    return (await this.page.locator(this.ResettlementOverviewPageElements.KeyWorkerStaffContact).textContent()).trim()
  }

  public async getAppointmentsSectionTitleRowContentOfResettlementOverviewTabText() {
    return (
      await this.page
        .locator(this.ResettlementOverviewPageElements.appointmentsTableFirstEntryInResettlementOverviewTab)
        .textContent()
    ).replace(/\s+/g, '')
  }

  public async getFirstEntryInAppointmentsSectionOfResettlementOverviewTabText() {
    return (
      await this.page
        .locator(this.ResettlementOverviewPageElements.appointmentsTableTitlesInResettlementOverviewTab)
        .textContent()
    ).replace(/\s+/g, '')
  }

  public async getPOMStaffContact() {
    return (await this.page.locator(this.ResettlementOverviewPageElements.POMStaffContact).textContent()).trim()
  }

  public async getCOMStaffContact() {
    return (await this.page.locator(this.ResettlementOverviewPageElements.COMStaffContact).textContent()).trim()
  }

  public async checkFiltersResultsForCaseNotesAreDisplayed() {
    await this.page.waitForSelector(this.ResettlementOverviewPageElements.caseNoteApplyFiltersResults)
    return this.page.locator(this.ResettlementOverviewPageElements.caseNoteApplyFiltersResults).isVisible()
  }

  public async clickOnApplyFiltersForCaseNotes() {
    console.log('Applying selected Case Note filter ')
    await this.page.locator(this.ResettlementOverviewPageElements.caseNoteApplyFiltersButton).click()
  }

  public async selectSortByForCaseNotes(sortByForCaseNotes: string) {
    console.log(`Selecting the ${sortByForCaseNotes} Filter by pathway for prisoner Case notes`)
    if (sortByForCaseNotes === 'Pathway' || sortByForCaseNotes === 'Created (most recent)') {
      return this.page
        .locator(this.ResettlementOverviewPageElements.caseNoteSortBySelection)
        .selectOption(sortByForCaseNotes)
    }
    console.log('check pathway spelling')
    expect(sortByForCaseNotes).toBeFalsy()
    return null
  }

  public async selectFilterByDateRange(filterByDateRangeForCaseNotes: string) {
    console.log(`Selecting the ${filterByDateRangeForCaseNotes} Filter by pathway for prisoner Case notes`)
    if (
      filterByDateRangeForCaseNotes === 'All time' ||
      filterByDateRangeForCaseNotes === 'Last week' ||
      filterByDateRangeForCaseNotes === 'Last 4 weeks' ||
      filterByDateRangeForCaseNotes === 'Last 12 weeks'
    ) {
      return this.page
        .locator(this.ResettlementOverviewPageElements.caseNoteFilterByDateRangeSelection)
        .selectOption(filterByDateRangeForCaseNotes)
    }
    console.log('check pathway spelling')
    expect(filterByDateRangeForCaseNotes).toBeFalsy()
    return null
  }

  public async selectFilterByPathwayForCaseNotes(pathwayStatusForCaseNotes: string) {
    console.log(`Selecting the ${pathwayStatusForCaseNotes} Filter by pathway for prisoner Case notes`)
    if (
      pathwayStatusForCaseNotes === 'All pathways' ||
      pathwayStatusForCaseNotes === 'Accommodation' ||
      pathwayStatusForCaseNotes === 'Attitudes, thinking and behaviour' ||
      pathwayStatusForCaseNotes === 'Children, families and communities'
    ) {
      return this.page
        .locator(this.ResettlementOverviewPageElements.caseNotePathwaySelection)
        .selectOption(pathwayStatusForCaseNotes)
    }
    if (
      pathwayStatusForCaseNotes === 'Drugs and alcohol' ||
      pathwayStatusForCaseNotes === 'Education, skills and work' ||
      pathwayStatusForCaseNotes === 'Finance and ID' ||
      pathwayStatusForCaseNotes === 'Health'
    ) {
      return this.page
        .locator(this.ResettlementOverviewPageElements.caseNotePathwaySelection)
        .selectOption(pathwayStatusForCaseNotes)
    }
    console.log('check pathway spelling')
    expect(pathwayStatusForCaseNotes).toBeFalsy()
    return null
  }

  public async getPrisonerProfileGridRowInformation() {
    return (
      await this.page.locator(this.ResettlementOverviewPageElements.prisonerGridProfileInformation).textContent()
    ).replace(/\s+/g, '')
  }

  public async getCaseNoteCreatedByText(pathway: string) {
    console.log(`Getting ${pathway} Last Updated Text`)
    if (pathway === 'Accommodation') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.accommodationResettlementOverviewTabPathwayLastUpdateText)
          .textContent()
      ).trim()
    }
    if (pathway === 'Attitudes, thinking and behaviour') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.attitudesResettlementOverviewTabPathwayLastUpdateText)
          .textContent()
      ).trim()
    }
    if (pathway === 'Children, families and communities') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.childrenResettlementOverviewTabPathwayLastUpdateText)
          .textContent()
      ).trim()
    }
    if (pathway === 'Drugs and alcohol') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.drugsResettlementOverviewTabPathwayLastUpdateText)
          .textContent()
      ).trim()
    }
    if (pathway === 'Education, skills and work') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.educationResettlementOverviewTabPathwayLastUpdateText)
          .textContent()
      ).trim()
    }
    if (pathway === 'Finance and ID') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.financeResettlementOverviewTabPathwayLastUpdateText)
          .textContent()
      ).trim()
    }
    if (pathway === 'Health') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.healthResettlementOverviewTabPathwayLastUpdateText)
          .textContent()
      ).trim()
    }
    expect(pathway).toBeFalsy()
    console.log('check pathway spelling')
    return null
  }

  public async checkCaseNoteSectionIsDisplayed() {
    return this.page.locator(this.ResettlementOverviewPageElements.caseNoteSection).isVisible()
  }

  public async getRiskOfSeriousRecidivismLastUpdateText() {
    return (
      await this.page.locator(this.ResettlementOverviewPageElements.RiskOfSeriousRecidivismLastUpdateText).textContent()
    ).trim()
  }

  public async getRoSHRiskLevelLastUpdateText() {
    return (
      await this.page.locator(this.ResettlementOverviewPageElements.RoSHRiskLevelLastUpdateText).textContent()
    ).trim()
  }

  public async getMAPPACategoryLastUpdateText() {
    return (await this.page.locator(this.ResettlementOverviewPageElements.MAPPALastUpdateText).textContent()).trim()
  }

  public async getRiskOfSeriousRecidivism() {
    return (
      await this.page.locator(this.ResettlementOverviewPageElements.RiskOfSeriousRecidivismStatus).textContent()
    ).replace(/\s+/g, '')
  }

  public async getRoSHRiskLevel() {
    return (await this.page.locator(this.ResettlementOverviewPageElements.RoSHRiskLevel).textContent()).replace(
      /\s+/g,
      '',
    )
  }

  public async getMAPPACategory() {
    return (await this.page.locator(this.ResettlementOverviewPageElements.MAPPACategory).textContent()).replace(
      /\s+/g,
      '',
    )
  }

  public async getMAPPALevel() {
    return (await this.page.locator(this.ResettlementOverviewPageElements.MAPPALevel).textContent()).replace(/\s+/g, '')
  }

  public async getPrisonerReleaseDate() {
    return (
      await this.page
        .locator(this.ResettlementOverviewPageElements.ResettlementOverviewPrisonerReleaseDateSection)
        .textContent()
    ).replace(/\s+/g, '')
  }

  public async verifyResettlementOverviewPathwayTabName() {
    return (
      await this.page.locator(this.ResettlementOverviewPageElements.ResettlementOverviewTabPathwayTabName).textContent()
    ).trim()
  }

  public async clickOnResettlementOverviewReadinessPathwayLink(prisonerReadinessPathwayLink: string) {
    console.log(`Clicking on ${prisonerReadinessPathwayLink} Last Updated Text`)
    if (prisonerReadinessPathwayLink === 'Accommodation') {
      await this.page
        .locator(this.ResettlementOverviewPageElements.accommodationResettlementOverviewTabPathwayLink)
        .click()
      expect(await this.verifyResettlementOverviewPathwayTabName()).toEqual(prisonerReadinessPathwayLink)
    } else if (prisonerReadinessPathwayLink === 'Attitudes, thinking and behaviour') {
      await this.page.locator(this.ResettlementOverviewPageElements.attitudesResettlementOverviewTabPathwayLink).click()
      expect(await this.verifyResettlementOverviewPathwayTabName()).toEqual(prisonerReadinessPathwayLink)
    } else if (prisonerReadinessPathwayLink === 'Children, families and communities') {
      await this.page.locator(this.ResettlementOverviewPageElements.childrenResettlementOverviewTabPathwayLink).click()
      expect(await this.verifyResettlementOverviewPathwayTabName()).toEqual(prisonerReadinessPathwayLink)
    } else if (prisonerReadinessPathwayLink === 'Drugs and alcohol') {
      await this.page.locator(this.ResettlementOverviewPageElements.drugsResettlementOverviewTabPathwayLink).click()
      expect(await this.verifyResettlementOverviewPathwayTabName()).toEqual(prisonerReadinessPathwayLink)
    } else if (prisonerReadinessPathwayLink === 'Education, skills and work') {
      await this.page.locator(this.ResettlementOverviewPageElements.educationResettlementOverviewTabPathwayLink).click()
      expect(await this.verifyResettlementOverviewPathwayTabName()).toEqual(prisonerReadinessPathwayLink)
    } else if (prisonerReadinessPathwayLink === 'Finance and ID') {
      await this.page.locator(this.ResettlementOverviewPageElements.financeResettlementOverviewTabPathwayLink).click()
      expect(await this.verifyResettlementOverviewPathwayTabName()).toEqual(prisonerReadinessPathwayLink)
    } else if (prisonerReadinessPathwayLink === 'Health') {
      await this.page.locator(this.ResettlementOverviewPageElements.healthResettlementOverviewTabPathwayLink).click()
      expect(await this.verifyResettlementOverviewPathwayTabName()).toEqual(prisonerReadinessPathwayLink)
    } else {
      expect(prisonerReadinessPathwayLink).toBeFalsy()
      console.log('check pathway spelling')
    }
  }

  public async getPrisonerPathwayReadinessLastUpdateText(prisonerReadinessPathwayLastUpdateText: string) {
    console.log(`Getting ${prisonerReadinessPathwayLastUpdateText} Last Updated Text`)
    if (prisonerReadinessPathwayLastUpdateText === 'Accommodation') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.accommodationResettlementOverviewTabPathwayLastUpdateText)
          .textContent()
      ).trim()
    }
    if (prisonerReadinessPathwayLastUpdateText === 'Attitudes, thinking and behaviour') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.attitudesResettlementOverviewTabPathwayLastUpdateText)
          .textContent()
      ).trim()
    }
    if (prisonerReadinessPathwayLastUpdateText === 'Children, families and communities') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.childrenResettlementOverviewTabPathwayLastUpdateText)
          .textContent()
      ).trim()
    }
    if (prisonerReadinessPathwayLastUpdateText === 'Drugs and alcohol') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.drugsResettlementOverviewTabPathwayLastUpdateText)
          .textContent()
      ).trim()
    }
    if (prisonerReadinessPathwayLastUpdateText === 'Education, skills and work') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.educationResettlementOverviewTabPathwayLastUpdateText)
          .textContent()
      ).trim()
    }
    if (prisonerReadinessPathwayLastUpdateText === 'Finance and ID') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.financeResettlementOverviewTabPathwayLastUpdateText)
          .textContent()
      ).trim()
    }
    if (prisonerReadinessPathwayLastUpdateText === 'Health') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.healthResettlementOverviewTabPathwayLastUpdateText)
          .textContent()
      ).trim()
    }
    expect(prisonerReadinessPathwayLastUpdateText).toBeFalsy()
    console.log('check pathway spelling')
    return null
  }

  public async getTodayDate() {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  public async getTodayDateShortMonth() {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  public async createLastUpdatedDate() {
    await this.page.waitForTimeout(1000)
    const date = await this.getTodayDateShortMonth()
    console.log(date) // Fri Jun 17 2022 11:27:28 GMT+0100 (British Summer Time)
    const addedText = 'Updated:'
    return `${addedText}${date}`
  }

  public async clickOnPreparePrisonerForReleaseBreadcrumb() {
    console.log('moving to the list of Prisons and Prisoners Page ')
    await this.page.locator(this.ResettlementOverviewPageElements.prepareSomeoneForReleaseBreadcrumbLink).click()
  }

  public async getPrisonerReadinessOverviewPathwayStatus(prisonerReadinessPathway: string) {
    console.log(`Getting ${prisonerReadinessPathway} status for prisoner`)
    if (prisonerReadinessPathway === 'Accommodation') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.accommodationResettlementOverviewTabPathwayStatus)
          .textContent()
      ).trim()
    }
    if (prisonerReadinessPathway === 'Attitudes, thinking and behaviour') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.attitudesResettlementOverviewTabPathwayStatus)
          .textContent()
      ).trim()
    }
    if (prisonerReadinessPathway === 'Children, families and communities') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.childrenResettlementOverviewTabPathwayStatus)
          .textContent()
      ).trim()
    }
    if (prisonerReadinessPathway === 'Drugs and alcohol') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.drugsResettlementOverviewTabPathwayStatus)
          .textContent()
      ).trim()
    }
    if (prisonerReadinessPathway === 'Education, skills and work') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.educationResettlementOverviewTabPathwayStatus)
          .textContent()
      ).trim()
    }
    if (prisonerReadinessPathway === 'Finance and ID') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.financeResettlementOverviewTabPathwayStatus)
          .textContent()
      ).trim()
    }
    if (prisonerReadinessPathway === 'Health') {
      return (
        await this.page
          .locator(this.ResettlementOverviewPageElements.healthResettlementOverviewTabPathwayStatus)
          .textContent()
      ).trim()
    }
    expect(prisonerReadinessPathway).toBeFalsy()
    console.log('check pathway spelling')
    return null
  }

  public async clickOnUpdateCaseNoteButtonAndVerifySuccess() {
    await this.page.locator(this.ResettlementOverviewPageElements.updatePathwayStatusButton).click()
    expect(
      (
        await this.page.locator(this.ResettlementOverviewPageElements.pathwayStatusSuccessTextTitle).textContent()
      ).replace(/\s+/g, ''),
    ).toEqual(pageTitles.PathwaySuccessTitle)
    expect(
      (await this.page.locator(this.ResettlementOverviewPageElements.pathwayStatusSuccessText).textContent()).trim(),
    ).toEqual(pageTitles.PathwaySuccessText)
  }

  public async changePathwayStatus(pathwayStatus: string) {
    const currentPathwayStatus = await this.getResettlementPathwayStatus()
    console.log(`Current Pathway Status ${currentPathwayStatus}`)

    if (currentPathwayStatus === pathwayStatus) {
      console.log(`Pathway "${pathwayStatus}" already Selected`)
    } else if (currentPathwayStatus !== pathwayStatus) {
      console.log(`Changing Pathway Selection to ${pathwayStatus}`)
      await this.page.locator(this.ResettlementOverviewPageElements.updatePathwayButton).click()

      if (pathwayStatus === 'Not started') {
        await this.page.locator(this.ResettlementOverviewPageElements.notStartedOption).click()
      } else if (
        pathwayStatus === 'In progress' ||
        pathwayStatus === 'In Progress' ||
        pathwayStatus === 'in Progress'
      ) {
        await this.page.locator(this.ResettlementOverviewPageElements.inProgressOption).click()
      } else if (pathwayStatus === 'Support not required') {
        await this.page.locator(this.ResettlementOverviewPageElements.supportNotRequiredOption).click()
      } else if (pathwayStatus === 'Support declined') {
        await this.page.locator(this.ResettlementOverviewPageElements.supportDeclinedOption).click()
      } else if (pathwayStatus === 'Done') {
        await this.page.locator(this.ResettlementOverviewPageElements.doneOption).click()
      } else {
        expect(pathwayStatus).toBeFalsy()
        console.log('check pathway spelling')
      }

      await this.clickOnUpdateCaseNoteButtonAndVerifySuccess()
    }
  }

  public async enterCaseNoteTextInPathwayStatus(pathwayStatus: string, pathwayCaseNoteText: string) {
    const currentDate = new Date().toString()
    const updatedPathwayCaseNoteText = `${pathwayCaseNoteText}${currentDate}`

    if (pathwayStatus === 'Not started') {
      await this.page.locator(this.ResettlementOverviewPageElements.notStartedOption).click()
      await this.page
        .locator(this.ResettlementOverviewPageElements.notStartedCaseNoteText)
        .fill(updatedPathwayCaseNoteText)
    } else if (pathwayStatus === 'In progress' || pathwayStatus === 'In Progress' || pathwayStatus === 'in Progress') {
      await this.page.locator(this.ResettlementOverviewPageElements.inProgressOption).click()
      await this.page
        .locator(this.ResettlementOverviewPageElements.inProgressCaseNoteText)
        .fill(updatedPathwayCaseNoteText)
    } else if (pathwayStatus === 'Support not required') {
      await this.page.locator(this.ResettlementOverviewPageElements.supportNotRequiredOption).click()
      await this.page
        .locator(this.ResettlementOverviewPageElements.supportNotRequiredCaseNoteText)
        .fill(updatedPathwayCaseNoteText)
    } else if (pathwayStatus === 'Support declined') {
      await this.page.locator(this.ResettlementOverviewPageElements.supportDeclinedOption).click()
      await this.page
        .locator(this.ResettlementOverviewPageElements.supportDeclinedCaseNoteText)
        .fill(updatedPathwayCaseNoteText)
    } else if (pathwayStatus === 'Done') {
      await this.page.locator(this.ResettlementOverviewPageElements.doneOption).click()
      await this.page.locator(this.ResettlementOverviewPageElements.doneCaseNoteText).fill(updatedPathwayCaseNoteText)
    } else {
      expect(pathwayStatus).toBeFalsy()
      console.log('check pathway spelling')
    }

    await this.clickOnUpdateCaseNoteButtonAndVerifySuccess()
  }

  public async clickOnResettlementOverviewPathwayTab(resettlementTab: string) {
    console.log(`Selecting ${resettlementTab} Tab`)

    if (resettlementTab === 'Resettlement overview' || resettlementTab === 'Resettlement Overview') {
      await this.page.locator(this.ResettlementOverviewPageElements.resettlementOverviewTab).click()
    } else if (resettlementTab === 'Accommodation') {
      await this.page.locator(this.ResettlementOverviewPageElements.accommodationTab).click()
    } else if (resettlementTab === 'Attitudes, thinking and behaviour') {
      await this.page.locator(this.ResettlementOverviewPageElements.attitudesTab).click()
    } else if (resettlementTab === 'Children, families and communities') {
      await this.page.locator(this.ResettlementOverviewPageElements.childrenTab).click()
    } else if (resettlementTab === 'Drugs and alcohol') {
      await this.page.locator(this.ResettlementOverviewPageElements.drugsTab).click()
    } else if (resettlementTab === 'Education, skills and work') {
      await this.page.locator(this.ResettlementOverviewPageElements.educationTab).click()
    } else if (resettlementTab === 'Finance and ID') {
      await this.page.locator(this.ResettlementOverviewPageElements.financeTab).click()
    } else if (resettlementTab === 'Health') {
      await this.page.locator(this.ResettlementOverviewPageElements.healthTab).click()
    } else console.log('Either Tab does not exist or you have entered the text wrong')
  }

  public async getPrisonerNameInResettlementOverviewPage() {
    const a = await this.page.locator(this.ResettlementOverviewPageElements.prisonerNameText).textContent()
    console.log('Confirming the right Prisoners Overview Page is displayed')
    return a
  }

  public async getResettlementPathwayStatus() {
    const a = await this.page.locator(this.ResettlementOverviewPageElements.ResettlementStatusText).textContent()
    console.log('Getting the Pathway status in Overview Page')
    return a
  }

  public async clickOnLicenseConditions() {
    await this.page.locator(this.ResettlementOverviewPageElements.clickOnLicenseConditions).click()
    const a = await this.page.locator(this.ResettlementOverviewPageElements.licenseConditionHeader).textContent()
    expect(a).toContain(pageTitles.ResettlementOverviewLicenseConditionsTitle)
  }

  public async clickOnStandardLicenceLink() {
    await this.page.locator(this.ResettlementOverviewPageElements.clickOnStandardLicenseConditionsLink).click()
  }

  public async clickOnLicenseConditionsMapLink() {
    const popupPromise = this.page.waitForEvent('popup')
    await this.page.locator(this.ResettlementOverviewPageElements.licenseConditionsMapLink).click()
    const newTab = await popupPromise
    // Wait for the popup or new tab to load which returns a page
    await newTab.waitForLoadState()
    console.log(`Switching to the newly displayed Tab ${await newTab.title()}`)
    const checkMapIsDisplayed = await newTab
      .locator(this.ResettlementOverviewPageElements.licenseConditionsMap)
      .isVisible()
    expect(checkMapIsDisplayed).toBe(true)
  }
}
