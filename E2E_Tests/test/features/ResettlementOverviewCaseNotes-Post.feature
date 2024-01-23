Feature: CaseNotes Overview Page


################POSTING CASE NOTES #################
################POSTING CASE NOTES #################
################POSTING CASE NOTES #################
  @resettlementOverview@regression@caseNotes@filterResults@PostCaseNotes
  Scenario: PostCaseNote:To verify user can post a case note via the pathway tab with no text entered and verify the content of the case not posted
    ################    Building Pre-test condition#################
    Given The User navigates to the Resettlement Overview Page as Prisoner "Clemence, Chrisy" in the Moorland Prison
    And The "Accommodation" tab is selected
    And pathway status is changed to "Done"
    #########    Actual Test###################
    And The "Accommodation" tab is selected
    And pathway status is changed to "In progress"
    And the first case note entry is populated with title "Accommodation" resettlement with status text as "Resettlement status set to: In progress." and CaseNote Text "N/A"
    And The happened and created text section populated with todays date and text " by Laleye, Dami"
    And the option "Laleye, Dami" is selected in the created by dropdown menu and the apply filter button is selected
    And the first case note entry is populated with title "Accommodation" resettlement with status text as "Resettlement status set to: In progress." and CaseNote Text "N/A"
    And The happened and created text section populated with todays date and text " by Laleye, Dami"
#    And I click through each page of the case notes till the last page of applied filter
    And The "Resettlement overview" tab is selected
    When The case notes section for the prisoner is displayed
    And I select the filter by pathway "Accommodation" case notes option
    And I select the filter by date range "All time" case notes option
    And I select the sort by "Pathway" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
    And the first case note entry in the Resettlement Overview Tab is populated with title "Accommodation" resettlement with status text as "Resettlement status set to: In progress." and CaseNote Text "N/A"
    And The happened and created text section populated with todays date and text " by Laleye, Dami" for the first case note entry in the Resettlement Overview Tab


  @resettlementOverview@regression@caseNotes@filterResults@PostCaseNotes
  Scenario: PostCaseNote:To verify user can post a case note via the resettlement Overview Route with text entered and verify the filter and content of the case are posted
    ##########    Building Pre-test condition#################
    Given The User navigates to the Resettlement Overview Page as Prisoner "Clemence, Chrisy" in the Moorland Prison
    And The "Education, skills and work" tab is selected
    And pathway status is changed to "Done"
    And The "Resettlement overview" tab is selected
    When The case notes section for the prisoner is displayed
     #########    Actual Test###################
    And The user clicks on the add case note button and "Add a case note" page is displayed
    And the user selects the "Education, skills and work" option and clicks on continue
    And the "Education, skills and work" Resettlement Overview tab is displayed
    And pathway status is changed to "In progress" with the text "Entered By the Automated Tests " with a timestamp and update applied.
    And the first case note entry is populated with title "Education, skills and work" resettlement with status text as "Resettlement status set to: In progress." and CaseNote Text "Entered By the Automated Tests"
    And The happened and created text section populated with todays date and text " by Laleye, Dami"
    And the option "Laleye, Dami" is selected in the created by dropdown menu and the apply filter button is selected
    And the first case note entry is populated with title "Education, skills and work" resettlement with status text as "Resettlement status set to: In progress." and CaseNote Text "Entered By the Automated Tests"
    And The happened and created text section populated with todays date and text " by Laleye, Dami"
    And The "Resettlement overview" tab is selected
    When The case notes section for the prisoner is displayed
    And I select the filter by pathway "Education, skills and work" case notes option
    And I select the filter by date range "All time" case notes option
    And I select the sort by "Pathway" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
    And the first case note entry in the Resettlement Overview Tab is populated with title "Education, skills and work" resettlement with status text as "Resettlement status set to: In progress." and CaseNote Text "Entered By the Automated Tests"
    And The happened and created text section populated with todays date and text " by Laleye, Dami" for the first case note entry in the Resettlement Overview Tab

################Only Run When Required
  @resettlementOverview@caseNotes
  Scenario: PostCaseNote:To verify that in a particular pathway tab; all pathway statuses can be selected and apply.
    Given The User navigates to the Resettlement Overview Page as Prisoner "Clemence, Chrisy" in the Moorland Prison
    And The "Attitudes, thinking and behaviour" tab is selected
    And pathway status is changed to "Not started"
    And The "Attitudes, thinking and behaviour" tab is selected
    And I see the pathway status as "Not started" in the resettlement overview page for prisoner "Clemence, Chrisy"
    And pathway status is changed to "In progress"
    And The "Attitudes, thinking and behaviour" tab is selected
    And I see the pathway status as "In progress" in the resettlement overview page for prisoner "Clemence, Chrisy"
    And The "Attitudes, thinking and behaviour" tab is selected
    And pathway status is changed to "Support not required"
    And The "Attitudes, thinking and behaviour" tab is selected
    And I see the pathway status as "Support not required" in the resettlement overview page for prisoner "Clemence, Chrisy"
    And The "Attitudes, thinking and behaviour" tab is selected
    And pathway status is changed to "Support declined"
    And The "Attitudes, thinking and behaviour" tab is selected
    And I see the pathway status as "Support declined" in the resettlement overview page for prisoner "Clemence, Chrisy"
    And The "Attitudes, thinking and behaviour" tab is selected
    And pathway status is changed to "Done"
    And The "Attitudes, thinking and behaviour" tab is selected
    And I see the pathway status as "Done" in the resettlement overview page for prisoner "Clemence, Chrisy"

  @resettlementOverview
  Scenario: PostCaseNote:To verify that in each of the pathway tab; the pathway status can be updated and then verify the total status numbers are as expected in the Prisoners Page
    Given The User navigates to the Resettlement Overview Page as Prisoner "Clemence, Chrisy" in the Moorland Prison
    And The "Accommodation" tab is selected
    And pathway status is changed to "Not started"
    And The "Attitudes, thinking and behaviour" tab is selected
    And pathway status is changed to "In progress"
    And The "Children, families and communities" tab is selected
    And pathway status is changed to "Support not required"
    And The "Drugs and alcohol" tab is selected
    And pathway status is changed to "Support declined"
    And The "Education, skills and work" tab is selected
    And pathway status is changed to "Done"
    And The "Finance and ID" tab is selected
    And pathway status is changed to "In progress"
    And The "Health" tab is selected
    And pathway status is changed to "Not started"
    And The "Resettlement overview" tab is selected
    And from the Resettlement Overview Page, Navigate back to the List of Prisoners and search for prisoner "Smith, John" within Moorland prison
    And the Resettlement Status Summary for prisoner "Smith, John" is displayed as Two Not Started Two In Progress and Three Done

  @resettlementOverview@caseNotes
  Scenario: PostCaseNote:To verify that in each of the pathway tab; the pathway status can be updated. To also verify that these changes are reflected in both the Resettlement Overview -Readiness Status and in the Prisoners Name row in the Prisons Page. To verify the total status numbers are as expected in the Prisoners Page
    Given The User navigates to the Resettlement Overview Page as Prisoner "Clemence, Chrisy" in the Moorland Prison
    And The "Accommodation" tab is selected
    And pathway status is changed to "Support declined"
    And The "Attitudes, thinking and behaviour" tab is selected
    And pathway status is changed to "Done"
    And The "Children, families and communities" tab is selected
    And pathway status is changed to "In progress"
    And The "Drugs and alcohol" tab is selected
    And pathway status is changed to "Not started"
    And The "Education, skills and work" tab is selected
    And pathway status is changed to "In progress"
    And The "Finance and ID" tab is selected
    And pathway status is changed to "In progress"
    And The "Health" tab is selected
    And pathway status is changed to "Support declined"
    And The "Resettlement overview" tab is selected
    And The Resettlement statuses link in the Resettlement Overview Tab of the Resettlement Overview Page
    And the Resettlement overview Pathway Readiness status for "Accommodation" tab is "Support declined"
    And the Resettlement overview Pathway Readiness status for "Attitudes, thinking and behaviour" tab is "Done"
    And the Resettlement overview Pathway Readiness status for "Children, families and communities" tab is "In progress"
    And the Resettlement overview Pathway Readiness status for "Drugs and alcohol" tab is "Not started"
    And the Resettlement overview Pathway Readiness status for "Education, skills and work" tab is "In progress"
    And the Resettlement overview Pathway Readiness status for "Finance and ID" tab is "In progress"
    And the Resettlement overview Pathway Readiness status for "Health" tab is "Support declined"
    And from the Resettlement Overview Page, Navigate back to the List of Prisoners and search for prisoner "Clemence, Chrisy" within Moorland prison
    And the Resettlement Status Summary for prisoner "Clemence, Chrisy" is displayed as One Not Started Three In Progress and Three Done


  @resettlementOverview@pathways@caseNotes@regression@PostCaseNotes
  Scenario: PostCaseNote:To verify that in the Resettlement Overview -Readiness Status section; the last update text for each status is based on the last updated date
    Given The User navigates to the Resettlement Overview Page as Prisoner "Clemence, Chrisy" in the Moorland Prison
    And All pathway statuses are set to "In Progress"
    And All pathway statuses are set to "Done"
    And the last update text for each pathway is set to today's date
    And from the Resettlement Overview Page, Navigate back to the List of Prisoners and search for prisoner "Clemence, Chrisy" within Moorland prison
    And the last updated text for the prisoner "Clemence, Chrisy" is today's date