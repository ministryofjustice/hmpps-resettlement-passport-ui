import { browser } from 'k6/browser'
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js'
import { Trend } from 'k6/metrics'
import { NavigationBar } from '../pages/navigationBar.js'
import { Overview } from '../pages/overviewPage.js'
import { StatusUpdate } from '../pages/statusUpdate.js'
import { sleep } from 'k6'
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'

const myTrend = new Trend('total_dashboard_time', true)
let testVal

export async function mainDevBrowserTest() {
  const page = await browser.newPage()

  //const navigationBar = new NavigationBar(page);
  const overviewPage = new Overview(page)
  const statusUpdate = new StatusUpdate(page)
  const navigationBar = new NavigationBar(page)
  const screenshot = '../screenshots/'
  console.log('start of test')

  try {
    await overviewPage.gotoLogin()
    await overviewPage.submitLogin()

    console.log('signIn')
    await page.screenshot({ path: `${screenshot}signIn.png` })
    await page.evaluate(() => window.performance.mark('page-visit'))
    console.log('loggedIn')
    await page.screenshot({ path: `${screenshot}dashboard.png` })

    testVal = await overviewPage.dashboardHeader.innerText()
    describe('getDashboard', () => {
      expect(testVal).to.equal('All pathways overview')
      console.log('testDash')
    })

    await page.evaluate(() => window.performance.mark('action-completed'))
    // measures total duration of loading Dashboard Page
    await page.evaluate(() => window.performance.measure('total_dashboard_time', 'page-visit', 'action-completed'))

    const totalActionTime = await page.evaluate(
      () => JSON.parse(JSON.stringify(window.performance.getEntriesByName('total_dashboard_time')))[0].duration,
    )
    myTrend.add(totalActionTime)

    await overviewPage.gotoPrisoner()

    testVal = await overviewPage.prisonerHeader.innerText()
    describe('getOverview test', () => {
      expect(testVal).to.equal('Resettlement record')
      console.log('testOverview')
    })

    ///////// Test ACCOMMODATION /////////

    await Promise.all([page.waitForNavigation(), navigationBar.accommodation.click()])
    testVal = await overviewPage.header2Title.innerText()
    describe('getAccommodation', () => {
      expect(testVal).to.equal('Accommodation')
      console.log('testAccommodation')
    })

    await Promise.all([page.waitForNavigation(), statusUpdate.updateStatus.click()])
    testVal = await overviewPage.statusSummaryTitle.innerText()
    describe('updateAccommodation', () => {
      expect(testVal).to.include('Accommodation resettlement status')
      console.log('update accommodation')
    })
    await Promise.all([page.waitForNavigation(), statusUpdate.update.click()])
    testVal = await overviewPage.caseNotesSummaryTitle.innerText()
    describe('updateAccommodation', () => {
      expect(testVal).to.equal('Accommodation case notes and status history')
      console.log('updated accommodation')
    })

    ///////// Test ATTUTUDES /////////

    await Promise.all([page.waitForNavigation(), navigationBar.attitudes.click()])
    testVal = await overviewPage.header2Title.innerText()
    describe('getAttitudes', () => {
      expect(testVal).to.equal('Attitudes, thinking and behaviour')
      console.log('testAttitudes')
    })

    await Promise.all([page.waitForNavigation(), statusUpdate.updateStatus.click()])
    testVal = await overviewPage.statusSummaryTitle.innerText()
    describe('updateAttitudes', () => {
      expect(testVal).to.include('Attitudes, thinking and behaviour resettlement status')
      console.log('update attitudes')
    })
    await Promise.all([page.waitForNavigation(), statusUpdate.update.click()])
    testVal = await overviewPage.caseNotesSummaryTitle.innerText()
    describe('updateAttitudes', () => {
      expect(testVal).to.equal('Attitudes, thinking and behaviour case notes and status history')
      console.log('updated attitudes')
    })

    ///////// Test CHILDREN /////////

    await Promise.all([page.waitForNavigation(), navigationBar.children.click()])
    testVal = await overviewPage.header2Title.innerText()
    describe('getChildren', () => {
      expect(testVal).to.equal('Children, families and communities')
      console.log('testChildren')
    })

    await Promise.all([page.waitForNavigation(), statusUpdate.updateStatus.click()])
    testVal = await overviewPage.statusSummaryTitle.innerText()
    describe('updateChildren', () => {
      expect(testVal).to.include('Children, families and communities resettlement status')
      console.log('update children')
    })
    await Promise.all([page.waitForNavigation(), statusUpdate.update.click()])
    testVal = await overviewPage.caseNotesSummaryTitle.innerText()
    describe('updateChildren', () => {
      expect(testVal).to.equal('Children, families and communities case notes and status history')
      console.log('updated children')
    })

    ///////// Test DRUGS /////////

    await Promise.all([page.waitForNavigation(), navigationBar.drugs.click()])
    testVal = await overviewPage.header2Title.innerText()
    describe('getDrugs', () => {
      expect(testVal).to.equal('Drugs and alcohol')
      console.log('testDrugs')
    })

    await Promise.all([page.waitForNavigation(), statusUpdate.updateStatus.click()])
    testVal = await overviewPage.statusSummaryTitle.innerText()
    describe('updateDrugs', () => {
      expect(testVal).to.include('Drugs and alcohol resettlement status')
      console.log('update drugs')
    })
    await Promise.all([page.waitForNavigation(), statusUpdate.update.click()])
    testVal = await overviewPage.caseNotesSummaryTitle.innerText()
    describe('updateDrugs', () => {
      expect(testVal).to.equal('Drugs and alcohol case notes and status history')
      console.log('updated drugs')
    })

    ///////// Test EDUCATION /////////

    await Promise.all([page.waitForNavigation(), navigationBar.education.click()])
    testVal = await overviewPage.header2Title.innerText()
    describe('getEducation', () => {
      expect(testVal).to.equal('Education, skills and work')
      console.log('testEducation')
    })

    await Promise.all([page.waitForNavigation(), statusUpdate.updateStatus.click()])
    testVal = await overviewPage.statusSummaryTitle.innerText()
    describe('updateEducation', () => {
      expect(testVal).to.include('Education, skills and work resettlement status')
      console.log('update education')
    })
    await Promise.all([page.waitForNavigation(), statusUpdate.update.click()])
    testVal = await overviewPage.caseNotesSummaryTitle.innerText()
    describe('updateEducation', () => {
      expect(testVal).to.equal('Education, skills and work case notes and status history')
      console.log('updated education')
    })

    ///////// Test FINANCE /////////

    await Promise.all([page.waitForNavigation(), navigationBar.finance.click()])
    testVal = await overviewPage.header2Title.innerText()
    describe('getFinance', () => {
      expect(testVal).to.equal('Finance and ID')
      console.log('testFinance')
    })

    await Promise.all([page.waitForNavigation(), statusUpdate.updateStatus.click()])
    testVal = await overviewPage.statusSummaryTitle.innerText()
    describe('updateFinance', () => {
      expect(testVal).to.include('Finance and ID resettlement status')
      console.log('update Finance')
    })
    await Promise.all([page.waitForNavigation(), statusUpdate.update.click()])
    testVal = await overviewPage.caseNotesSummaryTitle.innerText()
    describe('updateFinance', () => {
      expect(testVal).to.equal('Finance and ID case notes and status history')
      console.log('updated Finance')
    })

    ///////// Test HEALTH /////////

    await Promise.all([page.waitForNavigation(), navigationBar.health.click()])
    testVal = await overviewPage.header2Title.innerText()
    describe('getHealth', () => {
      expect(testVal).to.equal('Health')
      console.log('testHealth')
    })

    await Promise.all([page.waitForNavigation(), statusUpdate.updateStatus.click()])
    testVal = await overviewPage.statusSummaryTitle.innerText()
    describe('updateHealth', () => {
      expect(testVal).to.include('Health resettlement status')
      console.log('update health')
    })
    await Promise.all([page.waitForNavigation(), statusUpdate.update.click()])
    testVal = await overviewPage.caseNotesSummaryTitle.innerText()
    describe('updateHealth', () => {
      expect(testVal).to.equal('Health case notes and status history')
      console.log('updated health')
    })

    ///////// Test OVERVIEW /////////

    await Promise.all([page.waitForNavigation(), navigationBar.overview.click()])

    await Promise.all([page.waitForNavigation(), overviewPage.generateFirstTimeID.click()])
    testVal = await overviewPage.otpCode.innerText()
    describe('verifyOtpCode', () => {
      expect(testVal).to.equal('First-time ID code')
      console.log('otp generated')
    })

    await Promise.all([page.waitForNavigation(), navigationBar.overview.click()])
  } finally {
    page.close()
  }
}
