export class NavigationBar {
  constructor(page) {
    this.page = page
    this.overview = page.locator('[data-qa="sub-nav-prisoner-overview"]')
    this.accommodation = page.locator('[data-qa="sub-nav-accommodation"]')
    this.attitudes = page.locator('[data-qa="sub-nav-attitudes-thinking-and-behaviour"]')
    this.children = page.locator('[data-qa="sub-nav-children-families-and-communities"]')
    this.drugs = page.locator('[data-qa="sub-nav-drugs-and-alcohol"]')
    this.education = page.locator('[data-qa="sub-nav-education-skills-and-work"]')
    this.finance = page.locator('[data-qa="sub-nav-finance-and-id"]')
    this.health = page.locator('[data-qa="sub-nav-health-status"]')
  }
}
