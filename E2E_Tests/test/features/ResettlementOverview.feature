#Feature: Resettlement Overview Page
#
#
#
#Background:
#    Given The User navigates to the Resettlement Overview Page as Prisoner "Smith, John" in the Moorland Prison
#
#
#  @test@resettlementOverview@regression@license@Overview
#  Scenario: To verify clicking on the license conditions option
#    And clicks on the License conditions link and the license conditions are displayed
#    And clicks on the standard licence condition link
#    And clicks on the License conditions map and the license conditions map is displayed in a new tab
#
#
#  @test@resettlementOverview@regression@pathways@Overview
#  Scenario: To verify that in the Resettlement Overview -Readiness Status; clicking each pathway link displays the selected pathway tab
#    And The "Resettlement overview" tab is selected
#    And I click on the "Accommodation" readiness status link is selected and the tab is displayed
#    And The "Resettlement overview" tab is selected
#    And I click on the "Attitudes, thinking and behaviour" readiness status link is selected and the tab is displayed
#    And The "Resettlement overview" tab is selected
#    And I click on the "Children, families and communities" readiness status link is selected and the tab is displayed
#    And The "Resettlement overview" tab is selected
#    And I click on the "Drugs and alcohol" readiness status link is selected and the tab is displayed
#    And The "Resettlement overview" tab is selected
#    And I click on the "Education, skills and work" readiness status link is selected and the tab is displayed
#    And The "Resettlement overview" tab is selected
#    And I click on the "Finance and ID" readiness status link is selected and the tab is displayed
#    And The "Resettlement overview" tab is selected
#    And I click on the "Health" readiness status link is selected and the tab is displayed
#    And The "Resettlement overview" tab is selected
#
#  @test@resettlementOverview@regression@pathways@historyButton@Overview
#  Scenario: To verify that on clicking on the view history button in each pathway Tab of the resettlement Overview Page, the case notes for the pathway status is displayed.
#    And The "Accommodation" tab is selected
#    And clicks on the View History button and the "Accommodation case notes" is displayed
#    And The "Attitudes, thinking and behaviour" tab is selected
#    And clicks on the View History button and the "Attitudes, thinking and behaviour case notes" is displayed
#    And The "Children, families and communities" tab is selected
#    And clicks on the View History button and the "Children, families and communities case notes" is displayed
#    And The "Drugs and alcohol" tab is selected
#    And clicks on the View History button and the "Drugs and alcohol case notes" is displayed
#    And The "Education, skills and work" tab is selected
#    And clicks on the View History button and the "Education, skills and work case notes" is displayed
#    And The "Finance and ID" tab is selected
#    And clicks on the View History button and the "Finance and ID case notes" is displayed
#    And The "Health" tab is selected
#    And clicks on the View History button and the "Health case notes" is displayed
#    And The "Resettlement overview" tab is selected
#
#  @test@resettlementOverview@regression@pathways@prisonerProfileGrid@Overview
#  Scenario: To verify that in the Resettlement Overview ; the prisoner grid information is displayed as expected
#    And the release date in the resettlement Overview page is "29 Mar 2024" with a friday release information, number of days from now till the release and release type
#    And prisoner John Smith has a first name, last name, prisoner number, cell location and date of Birth
#
#
#  @test@resettlementOverview@regression@riskAssessment@Overview
#  Scenario: To verify Risk assessments and predictors in the resettlement overview tab
#    When The "Resettlement overview" tab is selected
#    And Risk of Serious Recidivism is "Low"
#    And the Risk of Serious Recidivism Last updated text is "Last updated: 29 July 2023"
#    And Overall RoSH risk level is "High"
#    And the Overall RoSH risk Last updated text is "Last updated: 29 July 2023"
#    And the MAPPA Category is "3" and the Level is "1"
#    And the MAPPA Category Last updated text is "Last updated: 27 January 2023"
#
##     And OGRS3 is "Very High", OVP is "Very High",OGP is "Very High",OSP/I is "Very High" and OSP/C is "Very High",
##    And Children is "Very High", Public is "Very High",Known adult is "Very High",Staff is "Very High" and Prisoner is "Very High",