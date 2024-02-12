Feature: Login


  @test@resettlementOverview@regression@login
  Scenario: Login: To verify the User can login successfully
    Given User logs in as dev user
    Then Login should be success