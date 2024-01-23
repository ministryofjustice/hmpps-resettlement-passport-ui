import { Page, expect } from '@playwright/test'
import { pageTitles } from '../hooks/pageTitles'

export default class PrisonPage {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  private PrisonPageElements = {
    selectPrisonDropdown: "//select[@id='prisonSelected']",
    selectPrisonButton: "//button[normalize-space()='Update table']",
    noPrisonSelectedError: "//a[normalize-space()='You must select a prison']",
    selectedPrisonText: "//main[@id='main-content']/p",
    listOfPrisonersDisplayed: "//h3[normalize-space()='All pathways overview']",
    listOfPrisonersNames: "//tbody[@class='govuk-table__body']/tr/td/a",
    prisonersTableRows: "//tbody[@class='govuk-table__body']/tr",
    prisonersTableColumns: "//tbody[@class='govuk-table__body']/tr[1]/td",
    firstPrisonerNameInPrisonersList: '//body[1]/div[2]/main[1]/table[1]/tbody[1]/tr[1]/td[1]/a',
    firstPrisonerReleaseConditionInPrisonersList: '//body[1]/div[2]/main[1]/table[1]/tbody[1]/tr[1]/td[2]',
    enterPrisonerNameSearch: "//input[@id='searchInput']",
    applyFilterInPrisonersPage: "//button[normalize-space()='Apply filters']",
    timeToRelease: "//select[@id='releaseTime']",
  }

  public async selectTimeToReleaseEntry(timeToReleaseOption: string) {
    console.log(`The time to release filter:  ${timeToReleaseOption}`)
    await this.page.locator(this.PrisonPageElements.timeToRelease).selectOption({ label: timeToReleaseOption })
  }

  public async enterPrisonerIntoPrisonerSearch(prisonerName: string) {
    console.log(`Entering Prisoner ${prisonerName} into the prisoner search box`)
    await this.page.locator(this.PrisonPageElements.enterPrisonerNameSearch).fill(prisonerName)
  }

  public async clickOnApplyFilterButton() {
    console.log('Applying prisoner search')
    await this.page.locator(this.PrisonPageElements.applyFilterInPrisonersPage).click()
  }

  public async defaultPrisonerReleaseConditionInThePrisonersList() {
    return (
      await this.page.locator(this.PrisonPageElements.firstPrisonerReleaseConditionInPrisonersList).textContent()
    ).replace(/\s+/g, '')
  }

  public async defaultPrisonerInThePrisonersList() {
    return this.page.locator(this.PrisonPageElements.firstPrisonerNameInPrisonersList).textContent()
  }

  public async getLastUpdatedTextForPrisoner(prisonerName: string) {
    {
      await this.page.waitForTimeout(1000)
      const rows = this.page.locator(this.PrisonPageElements.prisonersTableRows)
      const columns = this.page.locator(this.PrisonPageElements.prisonersTableColumns)
      console.log(`The Resettlement Table Has ${await rows.count()}`)
      console.log(`The Resettlement Table Has ${await columns.count()}`)

      for (let i = 0; i < (await rows.count()); i++) {
        // console.log('Building Xpath')....//tbody[@class='govuk-table__body']/tr;
        const row = rows.nth(i) // Adds a square bracket to the locator and populates it with a value 0....//tbody[@class='govuk-table__body']/tr[0]
        const firstColumnLocator = row.locator('td >> nth=0') // Adds another locator with the name specified ...//tbody[@class='govuk-table__body']/tr[0]/td[0]

        // console.log('Looping through the Names columns to find the column with a prisoner name: ' + await tdy.textContent());

        if ((await firstColumnLocator.textContent()).includes(prisonerName)) {
          console.log(`Found Prisoner : ${prisonerName}`)
          const switchToColumnFour = row.locator('td >> nth=18') // Adds a locator and a square bracket to the locator..//tbody[@class='govuk-table__body']/tr[4]/td[4]
          console.log(`This is the content of the column ${await switchToColumnFour}`)
          const getLastUpdatedText = (await switchToColumnFour.textContent()).trim()
          console.log(`Last UpdatedText:${getLastUpdatedText}`)
          return getLastUpdatedText
        }
      }
    }
  }

  public async getHealthPathwayStatusAndClickViaPrisonerListPage(prisonerName: string) {
    {
      const rows = this.page.locator(this.PrisonPageElements.prisonersTableRows)
      const columns = this.page.locator(this.PrisonPageElements.prisonersTableColumns)
      console.log(`The Resettlement Table Has ${await rows.count()}`)
      console.log(`The Resettlement Table Has ${await columns.count()}`)

      for (let i = 0; i < (await rows.count()); i++) {
        // console.log('Building Xpath')....//tbody[@class='govuk-table__body']/tr;
        const row = rows.nth(i) // Adds a square bracket to the locator and populates it with a value 0....//tbody[@class='govuk-table__body']/tr[0]
        const firstColumnLocator = row.locator('td >> nth=0') // Adds another locator with the name specified ...//tbody[@class='govuk-table__body']/tr[0]/td[0]

        // console.log('Looping through the Names columns to find the column with a prisoner name: ' + await tdy.textContent());

        if ((await firstColumnLocator.textContent()).includes(prisonerName)) {
          console.log(`Found Prisoner : ${prisonerName}`)
          const switchToColumnThree = row.locator('td >> nth=3') // Adds a locator and a square bracket to the locator..//tbody[@class='govuk-table__body']/tr[1]/td[3]
          // console.log('This is the content of the column ' + await switchToColumnThree.textContent());
          const pathwayLink = switchToColumnThree.locator(
            'details >> nth=0 >> div >> nth=0 >> table >> nth=0 >> tbody >> nth=0 >> tr >> nth=6 >> td >> nth=0 >> a >> nth=0',
          )
          const getPathwayStatusText = await switchToColumnThree
            .locator(
              'details >> nth=0 >> div >> nth=0 >> table >> nth=0 >> tbody >> nth=0 >> tr >> nth=6 >> td >> nth=1 >> strong >> nth=0',
            )
            .textContent()
          console.log(`Health Status ${getPathwayStatusText}`)
          await pathwayLink.click()
          return getPathwayStatusText
        }
      }
    }
  }

  public async getFinanceIDPathwayStatusAndClickViaPrisonerListPage(prisonerName: string) {
    {
      const rows = this.page.locator(this.PrisonPageElements.prisonersTableRows)
      const columns = this.page.locator(this.PrisonPageElements.prisonersTableColumns)
      console.log(`The Resettlement Table Has ${await rows.count()}`)
      console.log(`The Resettlement Table Has ${await columns.count()}`)

      for (let i = 0; i < (await rows.count()); i++) {
        // console.log('Building Xpath')....//tbody[@class='govuk-table__body']/tr;
        const row = rows.nth(i) // Adds a square bracket to the locator and populates it with a value 0....//tbody[@class='govuk-table__body']/tr[0]
        const firstColumnLocator = row.locator('td >> nth=0') // Adds another locator with the name specified ...//tbody[@class='govuk-table__body']/tr[0]/td[0]

        if ((await firstColumnLocator.textContent()).includes(prisonerName)) {
          console.log(`Found Prisoner : ${prisonerName}`)
          const switchToColumnThree = row.locator('td >> nth=3') // Adds a square bracket to the locator and populates it with a value 1..//tbody[@class='govuk-table__body']/tr[1]/td[3]
          // console.log('This is the content of the column ' + await switchToColumnThree.textContent());
          const pathwayLink = switchToColumnThree.locator(
            'details >> nth=0 >> div >> nth=0 >> table >> nth=0 >> tbody >> nth=0 >> tr >> nth=5 >> td >> nth=0 >> a >> nth=0',
          )
          const getPathwayStatusText = await switchToColumnThree
            .locator(
              'details >> nth=0 >> div >> nth=0 >> table >> nth=0 >> tbody >> nth=0 >> tr >> nth=5 >> td >> nth=1 >> strong >> nth=0',
            )
            .textContent()
          console.log(`FinanceID Status ${getPathwayStatusText}`)
          await pathwayLink.click() // clearing whitespaces details[1]/div[1]/table[1]/tbody[1]/tr[1]/td[1]/a[1]
          return getPathwayStatusText
        }
      }
    }
  }

  public async getESWPathwayStatusAndClickViaPrisonerListPage(
    prisonerName: string, // find a prisoner number via their prison name
  ) {
    {
      const rows = this.page.locator(this.PrisonPageElements.prisonersTableRows)
      const columns = this.page.locator(this.PrisonPageElements.prisonersTableColumns)
      console.log(`The Resettlement Table Has ${await rows.count()}`)
      console.log(`The Resettlement Table Has ${await columns.count()}`)

      for (let i = 0; i < (await rows.count()); i++) {
        // console.log('Building Xpath')....//tbody[@class='govuk-table__body']/tr;
        const row = rows.nth(i) // Adds a square bracket to the locator and populates it with a value 0....//tbody[@class='govuk-table__body']/tr[0]
        const firstColumnLocator = row.locator('td >> nth=0') // Adds another locator with the name specified ...//tbody[@class='govuk-table__body']/tr[0]/td[0]
        // console.log('Looping through the Names columns to find the column with a prisoner name: ' + await tdy.textContent());

        if ((await firstColumnLocator.textContent()).includes(prisonerName)) {
          console.log(`Found Prisoner : ${prisonerName}`)
          const switchToColumnThree = row.locator('td >> nth=3') // Adds a square bracket to the locator and populates it with a value 1..//tbody[@class='govuk-table__body']/tr[1]/td[3]
          // console.log('This is the content of the column ' + await tdybe.textContent());
          const pathwayLink = switchToColumnThree.locator(
            'details >> nth=0 >> div >> nth=0 >> table >> nth=0 >> tbody >> nth=0 >> tr >> nth=4 >> td >> nth=0 >> a >> nth=0',
          )
          const getPathwayStatusText = await switchToColumnThree
            .locator(
              'details >> nth=0 >> div >> nth=0 >> table >> nth=0 >> tbody >> nth=0 >> tr >> nth=4 >> td >> nth=1 >> strong >> nth=0',
            )
            .textContent()
          console.log(`ESP Status ${getPathwayStatusText}`)
          await pathwayLink.click() // clearing whitespaces details[1]/div[1]/table[1]/tbody[1]/tr[1]/td[1]/a[1]
          return getPathwayStatusText
        }
      }
    }
  }

  public async getDACPathwayStatusAndClickViaPrisonerListPage(
    prisonerName: string, // find a prisoner number via their prison name
  ) {
    {
      const rows = this.page.locator(this.PrisonPageElements.prisonersTableRows)
      const columns = this.page.locator(this.PrisonPageElements.prisonersTableColumns)
      console.log(`The Resettlement Table Has ${await rows.count()}`)
      console.log(`The Resettlement Table Has ${await columns.count()}`)

      for (let i = 0; i < (await rows.count()); i++) {
        // console.log('Building Xpath')....//tbody[@class='govuk-table__body']/tr;
        const row = rows.nth(i) // Adds a square bracket to the locator and populates it with a value 0....//tbody[@class='govuk-table__body']/tr[0]
        const firstColumnLocator = row.locator('td >> nth=0') // Adds another locator with the name specified ...//tbody[@class='govuk-table__body']/tr[0]/td[0]
        // console.log('Looping through the Names columns to find the column with a prisoner name: ' + await tdy.textContent());

        if ((await firstColumnLocator.textContent()).includes(prisonerName)) {
          console.log(`Found Prisoner : ${prisonerName}`)
          const switchToColumnThree = row.locator('td >> nth=3') // Adds a square bracket to the locator and populates it with a value 1..//tbody[@class='govuk-table__body']/tr[1]/td[3]
          // console.log('This is the content of the column ' + await tdybe.textContent());
          const pathwayLink = switchToColumnThree.locator(
            'details >> nth=0 >> div >> nth=0 >> table >> nth=0 >> tbody >> nth=0 >> tr >> nth=3 >> td >> nth=0 >> a >> nth=0',
          )
          const getPathwayStatusText = await switchToColumnThree
            .locator(
              'details >> nth=0 >> div >> nth=0 >> table >> nth=0 >> tbody >> nth=0 >> tr >> nth=3 >> td >> nth=1 >> strong >> nth=0',
            )
            .textContent()
          console.log(`Drugs Status ${getPathwayStatusText}`)
          await pathwayLink.click() // clearing whitespaces details[1]/div[1]/table[1]/tbody[1]/tr[1]/td[1]/a[1]
          return getPathwayStatusText
        }
      }
    }
  }

  public async getCTCPathwayStatusAndClickViaPrisonerListPage(
    prisonerName: string, // find a prisoner number via their prison name
  ) {
    {
      const rows = this.page.locator(this.PrisonPageElements.prisonersTableRows)
      const columns = this.page.locator(this.PrisonPageElements.prisonersTableColumns)
      console.log(`The Resettlement Table Has ${await rows.count()}`)
      console.log(`The Resettlement Table Has ${await columns.count()}`)

      for (let i = 0; i < (await rows.count()); i++) {
        // console.log('Building Xpath')....//tbody[@class='govuk-table__body']/tr;
        const row = rows.nth(i) // Adds a square bracket to the locator and populates it with a value 0....//tbody[@class='govuk-table__body']/tr[0]
        const firstColumnLocator = row.locator('td >> nth=0') // Adds another locator with the name specified ...//tbody[@class='govuk-table__body']/tr[0]/td[0]
        // console.log('Looping through the Names columns to find the column with a prisoner name: ' + await tdy.textContent());

        if ((await firstColumnLocator.textContent()).includes(prisonerName)) {
          console.log(`Found Prisoner : ${prisonerName}`)
          const switchToColumnThree = row.locator('td >> nth=3') // Adds a square bracket to the locator and populates it with a value 1..//tbody[@class='govuk-table__body']/tr[1]/td[3]
          // console.log('This is the content of the column ' + await switchToColumnThree.textContent());
          const pathwayLink = switchToColumnThree.locator(
            'details >> nth=0 >> div >> nth=0 >> table >> nth=0 >> tbody >> nth=0 >> tr >> nth=2 >> td >> nth=0 >> a >> nth=0',
          )
          const getPathwayStatusText = await switchToColumnThree
            .locator(
              'details >> nth=0 >> div >> nth=0 >> table >> nth=0 >> tbody >> nth=0 >> tr >> nth=2 >> td >> nth=1 >> strong >> nth=0',
            )
            .textContent()
          console.log(`Children Status ${getPathwayStatusText}`)
          await pathwayLink.click() // clearing whitespaces details[1]/div[1]/table[1]/tbody[1]/tr[1]/td[1]/a[1]
          return getPathwayStatusText
        }
      }
    }
  }

  public async getATBPathwayStatusAndClickViaPrisonerListPage(
    prisonerName: string, // find a prisoner number via their prison name
  ) {
    {
      const rows = this.page.locator(this.PrisonPageElements.prisonersTableRows)
      const columns = this.page.locator(this.PrisonPageElements.prisonersTableColumns)
      console.log(`The Resettlement Table Has ${await rows.count()}`)
      console.log(`The Resettlement Table Has ${await columns.count()}`)

      for (let i = 0; i < (await rows.count()); i++) {
        // console.log('Building Xpath')....//tbody[@class='govuk-table__body']/tr;
        const row = rows.nth(i) // Adds a square bracket to the locator and populates it with a value 0....//tbody[@class='govuk-table__body']/tr[0]
        const firstColumnLocator = row.locator('td >> nth=0') // Adds another locator with the name specified ...//tbody[@class='govuk-table__body']/tr[0]/td[0]
        // console.log('Looping through the Names columns to find the column with a prisoner name: ' + await tdy.textContent());

        if ((await firstColumnLocator.textContent()).includes(prisonerName)) {
          console.log(`Found Prisoner : ${prisonerName}`)
          const switchToColumnThree = row.locator('td >> nth=3') // Adds a square bracket to the locator and populates it with a value 1..//tbody[@class='govuk-table__body']/tr[1]/td[3]
          // console.log('This is the content of the column ' + await switchToColumnThree.textContent());
          const pathwayLink = switchToColumnThree.locator(
            'details >> nth=0 >> div >> nth=0 >> table >> nth=0 >> tbody >> nth=0 >> tr >> nth=1 >> td >> nth=0 >> a >> nth=0',
          )
          const getPathwayStatusText = await switchToColumnThree
            .locator(
              'details >> nth=0 >> div >> nth=0 >> table >> nth=0 >> tbody >> nth=0 >> tr >> nth=1 >> td >> nth=1 >> strong >> nth=0',
            )
            .textContent()
          console.log(`Attitudes Status ${getPathwayStatusText}`)
          await pathwayLink.click() // clearing whitespaces details[1]/div[1]/table[1]/tbody[1]/tr[1]/td[1]/a[1]
          return getPathwayStatusText
        }
      }
    }
  }

  public async getAccommodationPathwayStatusAndClickViaPrisonerListPage(
    prisonerName: string, // find a prisoner number via their prison name
  ) {
    {
      const rows = this.page.locator(this.PrisonPageElements.prisonersTableRows)
      const columns = this.page.locator(this.PrisonPageElements.prisonersTableColumns)
      console.log(`The Resettlement Table Has ${await rows.count()}`)
      console.log(`The Resettlement Table Has ${await columns.count()}`)

      for (let i = 0; i < (await rows.count()); i++) {
        // console.log('Building Xpath')....//tbody[@class='govuk-table__body']/tr;
        const row = rows.nth(i) // Adds a square bracket to the locator and populates it with a value 0....//tbody[@class='govuk-table__body']/tr[0]
        const firstColumnLocator = row.locator('td >> nth=0') // Adds another locator with the name specified ...//tbody[@class='govuk-table__body']/tr[0]/td[0]
        // console.log('Looping through the Names columns to find the column with a prisoner name: ' + await tdy.textContent());

        if ((await firstColumnLocator.textContent()).includes(prisonerName)) {
          console.log(`Found Prisoner : ${prisonerName}`)
          const switchToColumnThree = row.locator('td >> nth=3') // Adds a square bracket to the locator and populates it with a value 1..//tbody[@class='govuk-table__body']/tr[1]/td[3]
          // console.log('This is the content of the column ' + await tdybe.textContent());
          const pathwayLink = switchToColumnThree.locator(
            'details >> nth=0 >> div >> nth=0 >> table >> nth=0 >> tbody >> nth=0 >> tr >> nth=0 >> td >> nth=0 >> a >> nth=0',
          )
          const getPathwayStatusText = await switchToColumnThree
            .locator(
              'details >> nth=0 >> div >> nth=0 >> table >> nth=0 >> tbody >> nth=0 >> tr >> nth=0 >> td >> nth=1 >> strong >> nth=0',
            )
            .textContent()
          console.log(`Accommodation Status ${getPathwayStatusText}`)
          await pathwayLink.click()
          return getPathwayStatusText
        }
      }
    }
  }

  public async clickOnResettlementStatusLink(
    prisonerName: string, // find a prisoner number via their prison name
  ) {
    const rows = this.page.locator(this.PrisonPageElements.prisonersTableRows)
    const columns = this.page.locator(this.PrisonPageElements.prisonersTableColumns)
    console.log(`The Resettlement Table Has ${await rows.count()}`)
    console.log(`The Resettlement Table Has ${await columns.count()}`)

    for (let i = 0; i < (await rows.count()); i++) {
      // console.log('Building Xpath')....//tbody[@class='govuk-table__body']/tr;
      const row = rows.nth(i) // Adds a square bracket to the locator and populates it with a value 0....//tbody[@class='govuk-table__body']/tr[0]
      const firstColumnLocator = row.locator('td >> nth=0') // Adds another locator with the name specified ...//tbody[@class='govuk-table__body']/tr[0]/td[0]
      // console.log('Looping through the Names columns to find the column with a prisoner name: ' + await tdy.textContent());

      if ((await firstColumnLocator.textContent()).includes(prisonerName)) {
        console.log(`Found Prisoner : ${prisonerName}`)
        const switchToColumnThree = row.locator('td >> nth=3')
        // console.log('This is the content of the column ' + await switchToColumnThree.textContent());
        const showResettlementStatusLink = switchToColumnThree.locator('details >> nth=0 >> summary')
        console.log(`Searching for the list for prisoner ${showResettlementStatusLink}`)
        await showResettlementStatusLink.click()
      }
    }
  }

  public async getAllPathwayStatusTextForAPrisoner(
    prisonerName: string, // find a prisoner number via their prison name
  ) {
    const rows = this.page.locator(this.PrisonPageElements.prisonersTableRows)
    const columns = this.page.locator(this.PrisonPageElements.prisonersTableColumns)
    console.log(`The Resettlement Table Has ${await rows.count()}`)
    console.log(`The Resettlement Table Has ${await columns.count()}`)

    for (let i = 0; i < (await rows.count()); i++) {
      // console.log('Building Xpath')....//tbody[@class='govuk-table__body']/tr;
      const row = rows.nth(i) // Adds a square bracket to the locator and populates it with a value 0....//tbody[@class='govuk-table__body']/tr[0]
      const firstColumnLocator = row.locator('td >> nth=0') // Adds another locator with the name specified ...//tbody[@class='govuk-table__body']/tr[0]/td[0]
      // console.log('Looping through the Names columns to find the column with a prisoner name: ' + await tdy.textContent());

      // console.log('Looping through the Names columns to find the column with a prisoner name: ' + await tdy.textContent());

      if ((await firstColumnLocator.textContent()).includes(prisonerName)) {
        console.log(`Found Prisoner : ${prisonerName}`)
        const switchToColumnThree = row.locator('td >> nth=3')
        // console.log('This is the content of the column ' + await switchToColumnThree.textContent());
        const pathwayText = (await switchToColumnThree.textContent()).replace(/\s+/g, '') // clearing whitespaces
        // console.log('Resettlement Status Column Displays :' + b);
        return pathwayText
      }
    }
  }

  public async checkFridayReleaseDate(
    prisonerName: string, // find a prisoner number via their prison name
  ) {
    const rows = this.page.locator(this.PrisonPageElements.prisonersTableRows)
    const columns = this.page.locator(this.PrisonPageElements.prisonersTableColumns)
    console.log(`Searching for the list for prisoner ${await rows.count()}`)
    console.log(`Searching for the list for column count ${await columns.count()}`)

    for (let i = 0; i < (await rows.count()); i++) {
      // console.log('Building Xpath');
      const row = rows.nth(i) // Adds a square bracket to the locator and populates it with a value 0
      const tds = row.locator('td') // Adds another locator with the name specified
      const tdy = tds.nth(0) // Adds a square bracket to the locator and populates it with a value 0 ...//tbody[@class='govuk-table__body']/tr[0]/td[0]

      // console.log('Looping through the Names columns to find the column with a prisoner name: ' + await tdy.textContent());

      if ((await tdy.textContent()).includes(prisonerName)) {
        console.log(`Found Prisoner : ${prisonerName}`)
        const tdybe = tds.nth(1) // Adds a square bracket to the locator and populates it with a value 1..//tbody[@class='govuk-table__body']/tr[0]/td[1]
        // console.log('This is the content of the column ' + await tdybe.textContent());
        const b = (await tdybe.textContent()).replace(/\s+/g, '') // clearing whitespaces
        // console.log('sdfafdfafr :' + b);
        const removeFridayTextCaution = b.includes('Friday') // Checking for friday conditions
        if (removeFridayTextCaution === true) {
          console.log(`This is a friday release date :${b}`)
          return 'true'
        }
        console.log(`This is NOT a friday release date :${b}`)
        return 'false'
      }
    }
  }

  public async getPrisonerReleaseConditions(
    prisonerName: string, // find a prisoner number via their prison name
  ) {
    const rows = this.page.locator(this.PrisonPageElements.prisonersTableRows)
    const columns = this.page.locator(this.PrisonPageElements.prisonersTableColumns)
    console.log(`Searching for the list for prisoner ${await rows.count()}`)
    console.log(`Searching for the list for column count ${await columns.count()}`)

    for (let i = 0; i < (await rows.count()); i++) {
      // console.log('Building Xpath');
      const row = rows.nth(i) // Adds a square bracket to the locator and populates it with a value 0
      const tds = row.locator('td') // Adds another locator with the name specified
      const tdy = tds.nth(0) // Adds a square bracket to the locator and populates it with a value 0

      // console.log('Looping through the Names columns to find the column with a prisoner name   ' + await tdy.textContent());

      if ((await tdy.textContent()).includes(prisonerName)) {
        // select first row adds squarebrackets
        console.log(`Found Prisoner : ${prisonerName}`)
        const tdybe = tds.nth(1)
        // console.log('sdfafdfafr ' + await tdybe.textContent());
        const releaseConditionsText = (await tdybe.textContent()).replace(/\s+/g, '').slice(-3)
        // console.log('releaseConditionsText :' + b);
        return releaseConditionsText
      }
    }
  }

  public async getPrisonerReleaseDate(
    prisonerName: string, // find a prisoner number via their prison name
  ) {
    const rows = this.page.locator(this.PrisonPageElements.prisonersTableRows)
    const columns = this.page.locator(this.PrisonPageElements.prisonersTableColumns)
    console.log(`Searching for the list for prisoner ${await rows.count()}`)
    console.log(`Searching for the list for column count ${await columns.count()}`)

    for (let i = 0; i < (await rows.count()); i++) {
      // console.log('Building Xpath');
      const row = rows.nth(i) // Adds a square bracket to the locator and populates it with a value 0
      const tds = row.locator('td') // Adds another locator with the name specified
      const tdy = tds.nth(0) // Adds a square bracket to the locator and populates it with a value 0

      // console.log('Looping through the Names columns to find the column with a prisoner name   ' + await tdy.textContent());

      if ((await tdy.textContent()).includes(prisonerName)) {
        // select first row adds squarebrackets
        console.log(`Found Prisoner : ${prisonerName}`)
        const tdybe = tds.nth(1)
        console.log(`All The Text from the Release Date Column ${await tdybe.textContent()}`)
        const b = (await tdybe.textContent()).replace(/\s+/g, '').substring(0, 9)
        console.log(`Cleaned Out Whitespaces :${b}`)
        return b
      }
    }
  }

  public async getPrisonerNumber(
    prisonerName: string, // find a prisoner number via their prison name
  ) {
    const rows = this.page.locator(this.PrisonPageElements.prisonersTableRows)
    const columns = this.page.locator(this.PrisonPageElements.prisonersTableColumns)
    console.log(`Searching for the list for prisoner ${await rows.count()}`)
    console.log(`Searching for the list for column count ${await columns.count()}`)

    for (let i = 0; i < (await rows.count()); i++) {
      // console.log('Building Xpath');
      const row = rows.nth(i) // Adds a square bracket to the locator and populates it with a value 0
      const tds = row.locator('td') // Adds another locator with the name specified

      // console.log('Looping through the Names columns to find the column with a prisoner name   ' + await tdy.textContent());
      if ((await tds.nth(0).textContent()).includes(prisonerName)) {
        // select first row adds squarebrackets
        console.log(`Found Prisoner : ${prisonerName}`)
        const sk = tds.nth(0)
        const text = (await sk.locator('span').textContent()).replace(/\s+/g, '') // adds new slash select the first row first column drill into roll
        // console.log('This is the value' + ggg);
        return text
      }
    }
  }

  public async clickAndViewAPrisoner(
    prisonerName: string, // find a prisoner number via their prison name
  ) {
    const rows = this.page.locator(this.PrisonPageElements.prisonersTableRows)
    const columns = this.page.locator(this.PrisonPageElements.prisonersTableColumns)
    console.log(`Searching for the list for prisoner ${await rows.count()}`)
    console.log(`Searching for the list for column count ${await columns.count()}`)

    for (let i = 0; i < (await rows.count()); i++) {
      // console.log('Building Xpath');
      const row = rows.nth(i) // Adds a square bracket to the locator and populates it with a value 0
      const tds = row.locator('td') // Adds another locator with the name specified
      // const tdy = tds.nth(0);//Adds a square bracket to the locator and populates it with a value 0

      // console.log('Looping through the Names columns to find the column with a prisoner name   ' + await tdy.textContent());

      for (
        let j = 0;
        j < (await tds.count());
        j++ // looping through the columns
      ) {
        // console.log('Here is the content of the column ' + await tds.nth(j).textContent());
        if ((await tds.nth(j).textContent()).includes(prisonerName)) {
          // select first row adds squarebrackets
          console.log(`Found Prisoner : ${prisonerName}`)
          const fff = tds.nth(j) // Adds a square bracket to the locator and populates it with a value 0
          await fff.locator('a').click() // select the first row first column drill into roll
        }
      }
    }
  }

  public async getAllPrisonerNames() {
    await this.page.waitForSelector(this.PrisonPageElements.listOfPrisonersNames)
    const allPrisonerNames = await this.page.$$(this.PrisonPageElements.listOfPrisonersNames)
    console.log(` The number of prisoners on the page:  ${allPrisonerNames.length}`)
    return allPrisonerNames
  }

  public async selectPrison(prisonName: string) {
    console.log(`selecting the following prison:  ${prisonName}`)
    await this.page.locator(this.PrisonPageElements.selectPrisonDropdown).selectOption({ label: prisonName })
  }

  public async getListOfPrisons() {
    const allPrisons = await this.page.locator(this.PrisonPageElements.selectPrisonDropdown).textContent()
    console.log(`List of all Prisons  -${allPrisons}`)
  }

  public async acceptPrison() {
    console.log('Accepting Prison selection')
    await this.page.locator(this.PrisonPageElements.selectPrisonButton).click()
  }

  public async checkDefaultPrisonSelectionIsEmpty() {
    await this.acceptPrison()
    const prisonPageErrorDialog = await this.page.locator(this.PrisonPageElements.noPrisonSelectedError).textContent()
    console.log(`This is the prisoners page error dialog :${prisonPageErrorDialog}`)
    expect(prisonPageErrorDialog).toEqual(pageTitles.PrisonPageErrorDialog)
  }

  public async getSelectedPrisonText() {
    const prisonPageSelectionIdText = await this.page.locator(this.PrisonPageElements.selectedPrisonText).textContent()
    console.log(`This is the prison selection Text  ${prisonPageSelectionIdText}`)
    return prisonPageSelectionIdText
  }

  public async checkListOfPrisonersIsDisplayed() {
    const prisonersDisplayed = await this.page.locator(this.PrisonPageElements.listOfPrisonersDisplayed).isVisible()
    console.log(`${prisonersDisplayed} The List of prisoners is displayed`)
    return prisonersDisplayed
  }
}
