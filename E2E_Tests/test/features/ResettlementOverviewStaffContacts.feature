Feature: Staff Contacts Resettlement Overview Page



  @test@resettlementOverview@regression@staffContacts
  Scenario Outline: Staff Contact: To verify the Key Worker, Prison Offender Manager and Community Offender Manager are displayed in the staff contact section of the resettlement Overview Page
    Given The User navigates to the Resettlement Overview Page as Prisoner "<Prisoner>" in the Moorland Prison
    And The "<Resettlement Overview Tab>" tab is selected
    When The staff contact link is selected and staff contacts displayed
    And The Key worker is "<Key Worker Staff Contact>", Prison Offender Manager is "<POM Staff Contact>" and the COM is "<COM Staff Contact>"


    Examples:
      | Prisoner        | Resettlement Overview Tab | Key Worker Staff Contact | POM Staff Contact |COM Staff Contact |
      | Clemence, Chrisy| Resettlement overview     | Mary Randall             | Asfand Qazi       |Jane Doe         |
      | Smith, John     | Resettlement overview     | Steve Rendell            | David Jones       |John Doe         |
