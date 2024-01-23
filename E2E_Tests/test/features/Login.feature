Feature: User Login Page

@login
  Scenario: Login should be success
      
    Given User navigates to the Resettlement Website
    And User enter the username as "DLALEYE_GEN"
    And User enter the password as "Digitaldami123"
    When User click on the login button
    Then Login should be success