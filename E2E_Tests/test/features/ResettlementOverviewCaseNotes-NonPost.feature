Feature: CaseNotes Overview Page


  @test@resettlementOverview@regression@caseNotes@NonPostCaseNotes
  Scenario: NonPostCaseNote: To verify case notes are displayed in the resettlement Overview Page and able to filter caseNotes and apply selection
    Given The User navigates to the Resettlement Overview Page as Prisoner "Clemence, Chrisy" in the Moorland Prison
    And The "Resettlement overview" tab is selected
    When The case notes section for the prisoner is displayed
    And I select the filter by pathway "Health" case notes option
    And I select the filter by date range "Last week" case notes option
    And I select the sort by "Pathway" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed


  @test@resettlementOverview@regression@caseNotes@NonPostCaseNotes
  Scenario: NonPostCaseNote: To verify the filter pathway can be selected
    Given The User navigates to the Resettlement Overview Page as Prisoner "Clemence, Chrisy" in the Moorland Prison
    And The "Resettlement overview" tab is selected
    When The case notes section for the prisoner is displayed
    And I select the filter by pathway "Accommodation" case notes option
    And I select the filter by date range "Last 12 weeks" case notes option
    And I select the sort by "Created (most recent)" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed


  @test@resettlementOverview@caseNotes@NonPostCaseNotes
  Scenario: NonPostCaseNote: To verify case notes are displayed in the resettlement Overview Page and able to filter caseNotes and apply selection
    Given The User navigates to the Resettlement Overview Page as Prisoner "Clemence, Chrisy" in the Moorland Prison
    And The "Resettlement overview" tab is selected
    When The case notes section for the prisoner is displayed
    And I select the filter by pathway "Accommodation" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
    And I select the filter by pathway "All pathways" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
    And I select the filter by pathway "Attitudes, thinking and behaviour" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
    And I select the filter by pathway "Children, families and communities" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
    And I select the filter by pathway "Drugs and alcohol" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
    And I select the filter by pathway "Education, skills and work" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
    And I select the filter by pathway "Finance and ID" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
    And I select the filter by pathway "Health" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
    And I select the filter by date range "All time" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
    And I select the filter by date range "Last week" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
    And I select the filter by date range "Last 4 weeks" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
    And I select the filter by date range "Last 12 weeks" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
    And I select the sort by "Pathway" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
    And I select the sort by "Created (most recent)" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed



  @test@resettlementOverview@regression@caseNotes@filterResults@NonPostCaseNotes
  Scenario: NonPostCaseNote: To verify case notes pagination works and able to get to the last case note page
    Given The User navigates to the Resettlement Overview Page as Prisoner "Clemence, Chrisy" in the Moorland Prison
    And The "Resettlement overview" tab is selected
    When The case notes section for the prisoner is displayed
    And I select the filter by pathway "All pathways" case notes option
    And I select the filter by date range "All time" case notes option
    And I select the sort by "Pathway" case notes option
    And I click on the Apply filters case notes button and the filter results are displayed
#    And I click through each page of the case notes till the last page of applied filter


  @test@resettlementOverview@regression@caseNotes@NonPostCaseNotes
  Scenario Outline: NonPostCaseNote:  To verify the add a case Note page is displayed when the add case note button is selected via the resettlement overview page
    Given The User navigates to the Resettlement Overview Page as Prisoner "<Prisoner>" in the Moorland Prison
    And The "Resettlement overview" tab is selected
    When The case notes section for the prisoner is displayed
    And The user clicks on the add case note button and "<Page Name>" page is displayed
    And the user selects the "<Pathway>" option and clicks on continue
    And the "<Resettlement Overview Pathway Tab>" Resettlement Overview tab is displayed

    Examples:
      | Prisoner        | Page Name       | Pathway                            |Resettlement Overview Pathway Tab |
      | Clemence, Chrisy| Add a case note | Attitudes, thinking and behaviour  |Attitudes, thinking and behaviour     |
      | Clemence, Chrisy| Add a case note | Accommodation                      |Accommodation    |
      | Clemence, Chrisy| Add a case note | Children, families and communities |Children, families and communities    |
      | Clemence, Chrisy| Add a case note | Drugs and alcohol                  |Drugs and alcohol     |
      | Clemence, Chrisy| Add a case note | Education, skills and work         |Education, skills and work   |
      | Clemence, Chrisy| Add a case note | Finance and ID                     |Finance and ID    |
      | Clemence, Chrisy| Add a case note | Health                             |Health    |
