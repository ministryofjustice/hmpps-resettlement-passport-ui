import { Page } from '@playwright/test'

export default class AccommodationPage {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  private AccommodationPageElements = {
    dutyToReferLink: "//a[normalize-space()='Duty to refer']",
    mainAddressLink: "//a[normalize-space()='Main address']",
    dutyToReferReferralDate: "//section[@id='duty-to-refer']/div/table/tbody/tr[1]/td",
    dutyToReferStatus: "//section[@id='duty-to-refer']/div/table/tbody/tr[2]/td",
    mainAddressText: "//section[@id='main-address']/div/table/tbody/tr/td",
    mainAddressMessageText: "//section[@id='main-address']/div/p",
  }

  async clickOnAccommodationTreeLink(accommodationTabTreeLink: string) {
    if (accommodationTabTreeLink === 'Duty to refer') {
      await this.page.locator(this.AccommodationPageElements.dutyToReferLink).click()
    } else if (accommodationTabTreeLink === 'Main Address') {
      await this.page.locator(this.AccommodationPageElements.mainAddressLink).click()
    }
  }

  async getDutyToReferReferralDate() {
    return this.page.locator(this.AccommodationPageElements.dutyToReferReferralDate).textContent()
  }

  async getDutyToReferStatus() {
    return this.page.locator(this.AccommodationPageElements.dutyToReferStatus).textContent()
  }

  async getAddressNote() {
    return this.page.locator(this.AccommodationPageElements.mainAddressMessageText).textContent()
  }

  async getMainAddress() {
    return this.page.locator(this.AccommodationPageElements.mainAddressText).textContent()
  }
}
