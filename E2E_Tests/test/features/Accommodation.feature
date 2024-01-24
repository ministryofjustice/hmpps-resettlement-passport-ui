Feature: Appointment Resettlement Overview Page


  @test@resettlementOverview@regression@accommodation
  Scenario: Accommodation: To verify the Accommodation Overview Page
    Given The User navigates to the "Accommodation" Tab of Resettlement Overview Page as Prisoner "Clemence, Chrisy" in the Moorland Prison
    And The "Main address" link of the accommodation tab is selected
    And The note of abode in the address section of the accommodation tab displays Address as "Chrisy Clemence is currently of no fixed abode. They may require assistance finding accommodation. If a CRS referral or duty to refer have been made, details will be shown above."
    And The "Duty to refer" link of the accommodation tab is selected
    And The Duty to refer section of the accommodation tab displays Referral date as "24 August 2023" Status as "Unknown"

#  @test@resettlementOverview@regression@accommodation
#  Scenario: Accommodation: To verify the Accommodation Overview Page
#    Given The User navigates to the "Accommodation" Tab of Resettlement Overview Page as Prisoner "Smith, John" in the Moorland Prison
#    And The "Main address" link of the accommodation tab is selected
#    And The Main address section of the accommodation tab displays Address as "Old Court, 10, Old Street, Old District, Old Town, Old County, LS2"
#    And The "Duty to refer" link of the accommodation tab is selected
#    And The Duty to refer section of the accommodation tab displays Referral date as "8 September 2023" Status as "Initiated"