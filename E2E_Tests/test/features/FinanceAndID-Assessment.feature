#Feature: Finance and ID tab of the Resettlement Overview Page
#
#Background:
#    Given The User navigates to the "Finance and ID" Tab of the Resettlement Overview Page as Prisoner "Smith, John" in the Moorland Prison



 ############################################################################################################################
 ###############################FINANCE AND ID--------- ASSESSMENT  #########################################################
 ############################################################################################################################


  @test@resettlement@regression@financeID@Assessment
#  Scenario: Assessment: To verify an assessment journey
#    And The Finance and ID Tab selected
#    And The Finance and ID page is displayed via the Finance Page
#    And There are no existing "Finance assessments" applications.
#    And The text "JohnSmithdoesnothaveacompletedFinanceandIDassessment.Completeassessmentnow." is displayed in the Assessment section of the finance and ID Tab
#    And The user clicks on the complete assessment now link and the Finance and ID Assessment Page is displayed
#    And assessment date of "12/04/2023" Required Bank Account "No" Require ID "No" and Current ID of type of "Birth Certificate" is selected
#    And The submit button for the assessment check page is selected and check your answers page is displayed
#    And assessment date of "12 April 2023" Required Bank Account "No" Require ID "No" and Existing ID of "Birthcertificate" are displayed in the Assessment CYA page
#    And the change link for the "Date of assessment" is selected in the Assessment CYA page and the Apply for Finance and ID Assessment Page is displayed
#    And The submit button for the assessment check page is selected and check your answers page is displayed
#    And the change link for the "Requires a bank account application" is selected in the Assessment CYA page and the Apply for Finance and ID Assessment Page is displayed
#    And assessment date of "21/05/2023" Required Bank Account "Yes" Require ID "Yes" and Current ID of type of "Adoption certificate" is selected
#    And The ID of type of "Birth Certificate" is selected
#    And The submit button for the assessment check page is selected and check your answers page is displayed
#    And the change link for the "Requires an ID application" is selected in the Assessment CYA page and the Apply for Finance and ID Assessment Page is displayed
#    And The submit button for the assessment check page is selected and check your answers page is displayed
#    And the change link for the "Existing ID" is selected in the Assessment CYA page and the Apply for Finance and ID Assessment Page is displayed
#    And The submit button for the assessment check page is selected and check your answers page is displayed
#    And assessment date of "21 May 2023" Required Bank Account "Yes" Require ID "Yes" and Existing ID of "Adoptioncertificate" are displayed in the Assessment CYA page
#    And The confirm button for the apply for bank account is selected and the Finance tab of the resettlement Overview is displayed
#    And The Finance and ID assessment section of the Finance and ID Tab has assessment date of "21 May 2023" Required Bank Account "Yes" Require ID "Yes" and Existing ID of "Adoptioncertificate" displayed
#    And The finance and ID assessment is deleted


  @test@resettlement@regression@financeID@Assessments
#  Scenario: Assessment:To verify a Finance and ID Assessment can be done with all ID types selected
#    And The Finance and ID Tab selected
#    And The Finance and ID page is displayed via the Finance Page
#    And There are no existing "Finance assessments" applications.
#    And The user clicks on the complete assessment now link and the Finance and ID Assessment Page is displayed
#    And assessment date of "20/07/2023" Required Bank Account "No" Require ID "No" and Current ID of type of "Birth Certificate" is selected
#    And all ID types except Birth certificate is selected
#    And The submit button for the assessment check page is selected and check your answers page is displayed
#    And assessment date of "20 July 2023" Required Bank Account "No" Require ID "No" and Existing ID of "CivilpartnershipcertificateAdoptioncertificateDrivinglicenceDeedpollcertificateBirthcertificateDivorcedecreeabsolutecertificateMarriagecertificateBiometricresidencepermit" are displayed in the Assessment CYA page
#    And The confirm button for the apply for bank account is selected and the Finance tab of the resettlement Overview is displayed
#    And The Finance and ID assessment section of the Finance and ID Tab has assessment date of "20 July 2023" Required Bank Account "No" Require ID "No" and Existing ID of "CivilpartnershipcertificateAdoptioncertificateDrivinglicenceDeedpollcertificateBirthcertificateDivorcedecreeabsolutecertificateMarriagecertificateBiometricresidencepermit" displayed
#    And The finance and ID assessment is deleted

  @test@resettlement@regression@financeID@Assessment
#  Scenario: Assessment:To verify a Finance and ID Assessment can be done without an ID type selected
#    And The Finance and ID Tab selected
#    And The Finance and ID page is displayed via the Finance Page
#    And There are no existing "Finance assessments" applications.
#    And The user clicks on the complete assessment now link and the Finance and ID Assessment Page is displayed
#    And assessment date of "20/07/2029" Required Bank Account "No" Require ID "No" and Current ID of type of "None" is selected
#    And The submit button for the assessment check page is selected and check your answers page is displayed
#    And assessment date of "20 July 2029" Required Bank Account "No" Require ID "No" and Existing ID of "" are displayed in the Assessment CYA page
#    And The confirm button for the apply for bank account is selected and the Finance tab of the resettlement Overview is displayed
#    And The Finance and ID assessment section of the Finance and ID Tab has assessment date of "20 July 2029" Required Bank Account "No" Require ID "No" and Existing ID of "" displayed
#    And The finance and ID assessment is deleted


# ###############################ERROR DIALOGS FOR ASSESSMENT ########################################################################

  @test@resettlement@regression@financeID@Assessment
#  Scenario: Assessment: To verify error dialogs in a Assessment page when no option is selected and then when only the assessment date is entered
#    And The Finance and ID Tab selected
#    And The Finance and ID page is displayed via the Finance Page
#    And There are no existing "Finance assessments" applications.
#    And The user clicks on the complete assessment now link and the Finance and ID Assessment Page is displayed
#    And The submit button for the assessment check page is selected
#    And an error dialog page title is displayed with an error message above the "Date of assessment" question as "ThedateofassessmentmustincludeadayThedateofassessmentmustincludeamonthThedateofassessmentmustincludeayearThedateofassessmentmustbearealdate"
#    And the date of assessment date of "01/01/2024" is entered
#    And The submit button for the assessment check page is selected
#    And an error dialog page title is displayed with an error message above the "bank account question" question as "Selectanoption"


  @test@resettlement@regression@financeID@Assessment
#    Scenario: Assessment: To verify error dialog in the Assessment journey when only bank question is answered. Also when bank account and assessment date are only entered .
#    And The Finance and ID Tab selected
#    And The Finance and ID page is displayed via the Finance Page
#    And There are no existing "Finance assessments" applications.
#    And The user clicks on the complete assessment now link and the Finance and ID Assessment Page is displayed
#    And the bank account application of "Yes" is selected
#    And The submit button for the assessment check page is selected
#    And an error dialog page title is displayed with an error message above the "Date of assessment" question as "ThedateofassessmentmustincludeadayThedateofassessmentmustincludeamonthThedateofassessmentmustincludeayearThedateofassessmentmustbearealdate"
#    And the date of assessment date of "01/01/2023" is entered
#    And The submit button for the assessment check page is selected
#    And an error dialog page title is displayed with an error message above the "require an ID application" question as "Selectanoption"


  @test@resettlement@regression@financeID@Assessment
#  Scenario: Assessment: To verify error dialog in the Assessment journey when only ID question is answered. To test wrong and future assessment dates .
#    And The Finance and ID Tab selected
#    And The Finance and ID page is displayed via the Finance Page
#    And There are no existing "Finance assessments" applications.
#    And The user clicks on the complete assessment now link and the Finance and ID Assessment Page is displayed
#    And the require an ID application of "Yes" is selected
#    And The submit button for the assessment check page is selected
#    And an error dialog page title is displayed with an error message above the "Date of assessment" question as "ThedateofassessmentmustincludeadayThedateofassessmentmustincludeamonthThedateofassessmentmustincludeayearThedateofassessmentmustbearealdate"
#    And an error dialog page title is displayed with an error message above the "bank account question" question as "Selectanoption"
#    And the bank account application of "Yes" is selected
#    And the date of assessment date of "32/01/2023" is entered
#    And The submit button for the assessment check page is selected and check your answers page is displayed
#    And an error dialog page title is displayed with an error message above the "Date of assessment" question as "Thedateofassessmentmustbearealdate"
#    And the date of assessment date of "31/13/2023" is entered
#    And an error dialog page title is displayed with an error message above the "Date of assessment" question as "Thedateofassessmentmustbearealdate"
#    And The submit button for the assessment check page is selected and check your answers page is displayed

  @test@resettlement@regression@financeID@Assessment
#  Scenario: Assessment: To verify error dialog when only the existing ID types are selected.
#    And The Finance and ID Tab selected
#    And The Finance and ID page is displayed via the Finance Page
#    And There are no existing "Finance assessments" applications.
#    And The user clicks on the complete assessment now link and the Finance and ID Assessment Page is displayed
#    And all ID selection options are selected
#    And The submit button for the assessment check page is selected and check your answers page is displayed
#    And an error dialog page title is displayed with an error message above the "Date of assessment" question as "ThedateofassessmentmustincludeadayThedateofassessmentmustincludeamonthThedateofassessmentmustincludeayearThedateofassessmentmustbearealdate"
#    And an error dialog page title is displayed with an error message above the "bank account question" question as "Selectanoption"
#    And an error dialog page title is displayed with an error message above the "require an ID application" question as "Selectanoption"


# ###############################ERROR DIALOGS FOR ASSESSMENT ########################################################################