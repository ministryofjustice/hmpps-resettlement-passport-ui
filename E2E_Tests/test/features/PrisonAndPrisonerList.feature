#Feature: List of Prison and Prisoners Page
#


#Background:
#    Given The User navigates to the list of prisons page and the time to release filter of "All prisoners" has been applied with prisoner "Smith, John" entered as prisoner name


#  @test@regression@prison@pathwayStatus
#  Scenario: PrisonerList: To verify the user is able to select a prison, select a prisoner and verify the prisoner name, number, release date, release condition and friday release state is displayed.
#    To also verify that on selecting a prisoner name link, the application navigates to the resettlement overview page.
#   And the prisoner "Arran, Mcclean" is with a prisoner number of "A3775DZ", release date of "31Mar2024", release conditions of "CRD" and the friday release date is "false"
#   And the prisoner "Smith, John" is with a prisoner number of "G4274GN", release date of "29Mar2024", release conditions of "CRD" and the friday release date is "true"
#   And the prisoner "Smith, John" is selected
#   And the resettlement overview page is displayed

#  @test@regression@pathwayStatus
#  Scenario: PrisonerList: To verify Accommodation pathway status
#    And I click on the resettlement status link to see the various pathway statuses for "Clemence, Chrisy"
#    And I see the accommodation pathway status displayed for "Clemence, Chrisy" in the prisoners page pathway status is the same as that displayed in the prisoners page
#
#  @test@regression@pathwayStatus
#  Scenario: PrisonerList: To verify Attitudes, thinking and behaviour pathway status
#    And I click on the resettlement status link to see the various pathway statuses for "Clemence, Chrisy"
#    And I see the Attitudes, thinking and behaviour pathway status displayed for "Clemence, Chrisy" in the prisoners page pathway status is the same as that displayed in the prisoners page
#
#  @test@regression@pathwayStatus
#  Scenario: PrisonerList: To verify Children, families and communities pathway status
#    And I click on the resettlement status link to see the various pathway statuses for "Clemence, Chrisy"
#    And I see the Children, families and communities pathway status displayed for "Clemence, Chrisy" in the prisoners page pathway status is the same as that displayed in the prisoners page
#
#  @test@regression@pathwayStatus
#  Scenario: PrisonerList: To verify Drugs and alcohol pathway status
#    And I click on the resettlement status link to see the various pathway statuses for "Clemence, Chrisy"
#    And I see the Drugs and alcohol pathway status displayed for "Clemence, Chrisy" in the prisoners page pathway status is the same as that displayed in the prisoners page
#
#  @test@regression@pathwayStatus
#  Scenario: PrisonerList: To verify Education, skills and work pathway status
#    And I click on the resettlement status link to see the various pathway statuses for "Clemence, Chrisy"
#    And I see the Education, skills and work pathway status displayed for "Clemence, Chrisy" in the prisoners page pathway status is the same as that displayed in the prisoners page
#
#  @test@regression@pathwayStatus
#  Scenario: PrisonerList: To verify Finance and ID pathway status
#    And I click on the resettlement status link to see the various pathway statuses for "Clemence, Chrisy"
#    And I see the Finance and ID pathway status displayed for "Clemence, Chrisy" in the prisoners page pathway status is the same as that displayed in the prisoners page
#
#  @test@regression@pathwayStatus
#  Scenario: PrisonerList: To verify Health pathway status
#    And I click on the resettlement status link to see the various pathway statuses for "Clemence, Chrisy"
#    And I see the Health pathway status displayed for "Clemence, Chrisy" in the prisoners page pathway status is the same as that displayed in the prisoners page
#
#
#  @test@regression@pathwayStatus@defaultPrisoner
#  Scenario: PrisonerList: To verify the first prisoner name and release conditions in the list of prisoners to ensure the prisoners are sorted by release date
#    And the first prisoner name in the prisoners list is "Smith, John" with release conditions "29Mar2024⚠️FridayCRD"


#  @regression@prison
#  Scenario: PrisonerList: To verify the release date are calculated as expected
## This test is to be DELETED. Need to test via pagination as the prisoner search bar does not work in Dev
#  #######NEWMAN, Nancy approvedParoleDate": "2034-04-07",
#  # Ahnneet, Aesu homeDetentionCurfewActualDate": "2034-04-07",
#  #"Mcclean","Arran" conditionalReleaseDate
#  # Blanco,Albert automatic release date
#  # Aisho,Egurztof#"confirmedReleaseDate": "2034-03-31",
#  # Aisho, Onshinthomasin #"confirmedReleaseDate": "2044-04-08", and "paroleEligibilityDate": "2034-03-07",
#    And the prisoner "Newman, Nancy" is with a prisoner number of "A8457DY", release date of "7Apr2034⚠", release conditions of "day" and the friday release date is "true"
#    And the prisoner "Ahnneet, Aesu" is with a prisoner number of "A3426DZ", release date of "7Apr2034⚠", release conditions of "day" and the friday release date is "true"
#    And the prisoner "Arran, Mcclean" is with a prisoner number of "A3775DZ", release date of "31Mar2024", release conditions of "CRD" and the friday release date is "false"
#    And the prisoner "Blanco, Albert" is with a prisoner number of "A5173DY", release date of "17Sept203", release conditions of "ARD" and the friday release date is "false"
#    And the prisoner "Aisho, Egurztof" is with a prisoner number of "G4572UO", release date of "31Mar2034", release conditions of "day" and the friday release date is "true"
#    And the prisoner "Aisho, Onshinthomasin" is with a prisoner number of "G6980GG", release date of "8Apr2044⚠", release conditions of "day" and the friday release date is "true"
#
#  @test@regression@pathwayStatus
#  Scenario: PrisonerList: To verify the filter time to release filter option can be selected
#    And I select and apply the filter "Within 12 weeks"
#    And I select and apply the filter "Within 24 weeks"