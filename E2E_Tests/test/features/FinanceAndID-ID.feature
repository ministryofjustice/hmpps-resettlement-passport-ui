Feature: Finance and ID tab of the Resettlement Overview Page

Background:
    Given The User navigates to the "Finance and ID" Tab of the Resettlement Overview Page as Prisoner "Smith, John" in the Moorland Prison

  ############################################################################################################################
  ###############################ADD AN ID ###################################################################################
  ############################################################################################################################

  @test@resettlement@regression@financeID@ID
  Scenario: ID: To verify the user can create a Birth certificate ID application in the Finance and ID Resettlement Overview Tab. To also verify the change button in the check your answers page for the ID application works as expected
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And The user clicks on the finance and ID assessment link and the finance and id assessment section is displayed
    And The user clicks on the ID Documents link and the ID documents section is displayed
    And There are no existing "Finance assessments" applications.
    And There are no existing "bank account" applications.
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And The ID type "Birth certificate" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And In the additional ID questions page the user enters "Yes" to GRO number "Yes" to UK national born overseas born in "Peru" country "Yes" to priority application and "50" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed
    And The type of "Birth certificate" application submitted date of "12 April 1987" GRO number "Yes" UK National "Yes (Peru)" Priority application "Yes" cost of "£50" are displayed in the ID CYA Page
   And The confirm button for the apply for ID application is selected and the Finance tab of the resettlement Overview is displayed
   And The type of "Birth certificate" application submitted date of "12 April 1987" GRO number "Yes" UK National "Yes (Peru)" Priority application "Yes" cost of "£50" are displayed in the ID section of the Finance and ID Resettlement Overview Page
   And the Id application is deleted



  @test@resettlement@regression@financeID@ID
  Scenario: ID: To verify the user can create a Adoption certificate ID application in the Finance and ID Resettlement Overview Tab
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And The user clicks on the finance and ID assessment link and the finance and id assessment section is displayed
    And The user clicks on the ID Documents link and the ID documents section is displayed
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And The ID type "Adoption certificate" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And In the additional ID questions page the user enters "Yes" to GRO number "N/A" to UK national born overseas born in "N/A" country "Yes" to priority application and "50" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed
    And The type of "Adoption certificate" application submitted date of "12 April 1987" GRO number "Yes" Priority application "Yes" cost of "£50" are displayed in the ID CYA Page
    And The confirm button for the apply for ID application is selected and the Finance tab of the resettlement Overview is displayed
    And The type of "Adoption certificate" application submitted date of "12 April 1987" GRO number "Yes" Priority application "Yes" cost of "£50" are displayed in the ID section of the Finance and ID Resettlement Overview Page
    And the Id application is deleted


  @test@resettlement@regression@financeID@ID
  Scenario: ID: To verify the user can create a Divorce decree absolute certificate ID application in the Finance and ID Resettlement Overview Tab
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And The user clicks on the finance and ID assessment link and the finance and id assessment section is displayed
    And The user clicks on the ID Documents link and the ID documents section is displayed
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And The ID type "Divorce decree absolute certificate" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And In the additional ID Divorce decree questions page the user enters "A12345" to Case Number "A12345" to Court Details and "50" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed
    And The type of "Divorce decree absolute certificate" application submitted date of "12 April 1987" Case Number "A12345" Court Details "A12345" and cost of "£50" are displayed in the ID CYA Page
    And The confirm button for the apply for ID application is selected and the Finance tab of the resettlement Overview is displayed
    And The type of "Divorce decree absolute certificate" application submitted date of "12 April 1987" Case Number "A12345" Court Details "A12345" and cost of "£50" are displayed in the ID section of the Finance and ID Resettlement Overview Page
    And the Id application is deleted


  @test@resettlement@regression@financeID@ID
  Scenario: ID: To verify the user can create a driving license ID application in the Finance and ID Resettlement Overview Tab
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And The user clicks on the finance and ID assessment link and the finance and id assessment section is displayed
    And The user clicks on the ID Documents link and the ID documents section is displayed
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And The ID type "Driving licence" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And In the additional ID Driving license questions page the user selects "Provisional" to Driving license type "Online" to Application made and "50" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed
    And The type of "Driving licence" application submitted date of "12 April 1987" Driving license type "Provisional" to Driving license Application "Online" and cost of "£50" are displayed in the ID CYA Page
    And The confirm button for the apply for ID application is selected and the Finance tab of the resettlement Overview is displayed
    And The type of "Driving licence" application submitted date of "12 April 1987" Driving license type "Provisional" to Driving license Application "Online" and cost of "£50" are displayed in the ID section of the Finance and ID Resettlement Overview Page
    And the Id application is deleted

  @test@resettlement@regression@financeID@ID
  Scenario: ID: To verify the user can create a Biometric Residence permit ID application in the Finance and ID Resettlement Overview Tab
   And The Finance and ID Tab selected
   And The Finance and ID page is displayed via the Finance Page
   And The user clicks on the finance and ID assessment link and the finance and id assessment section is displayed
   And The user clicks on the ID Documents link and the ID documents section is displayed
   And There are no existing "ID" applications.
   And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
   And The ID type "Biometric residence permit" is selected and the application submitted date of "12/04/1987" is added to the application form
   And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
   And In the additional ID questions page the user enters "50" to cost of application
   And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed
   And The type of "Biometric residence permit" application submitted date of "12 April 1987" and cost of "£50" are displayed in the ID CYA Page
    And The confirm button for the apply for ID application is selected and the Finance tab of the resettlement Overview is displayed
   And The type of "Biometric residence permit" application submitted date of "12 April 1987" and cost of "£50" are displayed in the ID section of the Finance and ID Resettlement Overview Page
   And the Id application is deleted


  @test@resettlement@regression@financeID@ID
  Scenario: ID: To verify the user can create a National Insurance Number letter ID application in the Finance and ID Resettlement Overview Tab
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And The user clicks on the finance and ID assessment link and the finance and id assessment section is displayed
    And The user clicks on the ID Documents link and the ID documents section is displayed
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And The ID type "National Insurance Number letter" is selected and the application submitted date of "12/05/2023" is added to the application form
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed
    And The type of "National Insurance Number letter" application submitted date of "12 May 2023" are displayed in the ID CYA Page
    And The confirm button for the apply for ID application is selected and the Finance tab of the resettlement Overview is displayed
    And The type of "National Insurance Number letter" application submitted date of "12 May 2023" and application status of "Pending" are displayed in the ID section of the Finance and ID Resettlement Overview Page
    And the Id application is deleted


  @test@resettlement@regression@financeID@ID
  Scenario: ID: To verify the user can change the application type in the CYA page of the Add an ID application and verify the content of the check you answers page are as expected
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed

    And The ID type "National Insurance Number letter" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed

    And the change link for "Type" is selected in the check your answers page and the Apply for ID application status page is displayed
    And The ID type "Marriage certificate" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And In the additional ID questions page the user enters "Yes" to GRO number "Yes" to UK national born overseas born in "Peru" country "Yes" to priority application and "50" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed

    And the change link for "GRO number" is selected in the check your answers page and the Apply for ID application status page is displayed
    And In the additional ID questions page the user enters "No" to GRO number "No" to UK national born overseas born in "N/A" country "No" to priority application and "10000000" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed

    And the change link for "Application submitted" is selected in the check your answers page and the Apply for ID application status page is displayed
    And The ID type "Adoption certificate" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And In the additional ID questions page the user enters "Yes" to GRO number "N/A" to UK national born overseas born in "N/A" country "No" to priority application and "50" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed

    And the change link for "Priority application" is selected in the check your answers page and the Apply for ID application status page is displayed
    And In the additional ID questions page the user enters "No" to GRO number "N/A" to UK national born overseas born in "N/A" country "Yes" to priority application and "50000" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed

    And the change link for "Application submitted" is selected in the check your answers page and the Apply for ID application status page is displayed
    And The ID type "Divorce decree absolute certificate" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And In the additional ID Divorce decree questions page the user enters "A12345" to Case Number "A12345" to Court Details and "50" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed

    And the change link for "Court details" is selected in the check your answers page and the Apply for ID application status page is displayed
    And In the additional ID Divorce decree questions page the user enters "A-12345" to Case Number "COURT CASE" to Court Details and "1200050" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed

    And the change link for "Application submitted" is selected in the check your answers page and the Apply for ID application status page is displayed
    And The ID type "Driving licence" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And In the additional ID Driving license questions page the user selects "Renewal" to Driving license type "At Post Office" to Application made and "10000" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed

    And the change link for "License location" is selected in the check your answers page and the Apply for ID application status page is displayed
    And In the additional ID Driving license questions page the user selects "Reinstatement" to Driving license type "By post" to Application made and "700000" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed

    And the change link for "Application submitted" is selected in the check your answers page and the Apply for ID application status page is displayed
    And The ID type "Deed poll certificate" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And In the additional ID questions page the user enters "50000" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed

    And the change link for "Cost" is selected in the check your answers page and the Apply for ID application status page is displayed
    And In the additional ID questions page the user enters "200" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed



    ####################################################################################
    ############# ERROR DIALOGS FOR ID APPLICATION #######################
    ####################################################################################

  @test@resettlement@financeID@ID
  Scenario: ID: To verify the error dialogs on the birth certificate ID journey
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And The user clicks on the finance and ID assessment link and the finance and id assessment section is displayed
    And The user clicks on the ID Documents link and the ID documents section is displayed
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "application submitted" question as "ThedateofapplicationsubmittedmustincludeadayThedateofapplicationsubmittedmustincludeamonthThedateofapplicationsubmittedmustincludeayearThedateofapplicationsubmittedmustbearealdate"
    And an ID error dialog page title is displayed with an error message above the "type" question as "Select an option"
    And The ID type "Replacement marriage certificate" is selected in the apply for ID page
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "application submitted" question as "ThedateofapplicationsubmittedmustincludeadayThedateofapplicationsubmittedmustincludeamonthThedateofapplicationsubmittedmustincludeayearThedateofapplicationsubmittedmustbearealdate"
    And The ID type "Birth certificate" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID documents Additional Question page is selected
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "Cost for Birth Certificate Route" question as "Enter the cost of application"
    And In the additional ID questions page the user enters "50" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "GRO Number" question as "Select an option"
    And an ID error dialog page title is displayed with an error message above the "UK National Overseas" question as "Select an option"
    And an ID error dialog page title is displayed with an error message above the "Priority Application" question as "Select an option"
    And In the additional ID questions page the user enters "Yes" to GRO number
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "UK National Overseas" question as "Select an option"
    And an ID error dialog page title is displayed with an error message above the "Priority Application" question as "Select an option"
    And In the additional ID questions page the user enters "Yes" to UK national born overseas
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "Priority Application" question as "Select an option"
    And In the additional ID questions page the user enters "Yes" to priority application
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "Select a country" question as "Select a country"
    And In the additional ID questions page the user enters "Yes" to GRO number "Yes" to UK national born overseas born in "Peru" country "Yes" to priority application and "50" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected




  @test@resettlement@financeID@ID
  Scenario:ID:  To verify the error dialogs on the adoption certificate ID journey
    And The Finance and ID Tab selected
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And The ID type "Adoption certificate" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID documents Additional Question page is selected
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "Cost for Birth Certificate Route" question as "Enter the cost of application"
    And In the additional ID questions page the user enters "50" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "GRO Number" question as "Select an option"
    And an ID error dialog page title is displayed with an error message above the "Priority Application" question as "Select an option"
    And In the additional ID questions page the user enters "Yes" to priority application
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "GRO Number" question as "Select an option"


  @test@resettlement@financeID@ID
  Scenario:ID:  To verify the error dialogs on the Divorce decree absolute certificate ID journey
    And The Finance and ID Tab selected
    And The user clicks on the ID Documents link and the ID documents section is displayed
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And The ID type "Divorce decree absolute certificate" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "Cost for Birth Certificate Route" question as "Enter the cost of application"
    And In the additional ID questions page the user enters "50" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "Case number" question as "Enter a case number"
    And an ID error dialog page title is displayed with an error message above the "Court details" question as "Enter court details"
    And In the additional ID Divorce decree questions page the user enters "A12345" to Case Number
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "Court details" question as "Enter court details"
    And In the additional ID Divorce decree questions page the user enters "A12345" to Court Details
    And In the additional ID Divorce decree questions page the user enters "" to Case Number
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "Case number" question as "Enter a case number"



  @test@resettlement@financeID@ID
  Scenario: ID: To verify the error dialogs on the driving licence ID journey
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And The user clicks on the finance and ID assessment link and the finance and id assessment section is displayed
    And The user clicks on the ID Documents link and the ID documents section is displayed
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And The ID type "Driving licence" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "Cost for Birth Certificate Route" question as "Enter the cost of application"
    And In the additional ID questions page the user enters "50" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "Driving Licence type" question as "Choose a driving licence type"
    And an ID error dialog page title is displayed with an error message above the "Driving Licence Where Application Is Made" question as "Choose where application was made"
    And In the additional ID Driving license questions page the user selects "Reinstatement" to Driving license type
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "Driving Licence Where Application Is Made" question as "Choose where application was made"
    And In the additional ID Driving license questions page the user selects "Online" to Application made
    And The submit button for the apply for ID documents Additional Question page is selected

    And the change link for "Application submitted" is selected in the check your answers page and the Apply for ID application status page is displayed
    And The ID type "Divorce decree absolute certificate" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And In the additional ID Divorce decree questions page the user enters "A12345" to Case Number "A12345" to Court Details and "50" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed

    And the change link for "Application submitted" is selected in the check your answers page and the Apply for ID application status page is displayed
    And The ID type "Driving licence" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And In the additional ID questions page the user enters "50" to cost of application
    And In the additional ID Driving license questions page the user selects "Online" to Application made
    And The submit button for the apply for ID documents Additional Question page is selected

    And an ID error dialog page title is displayed with an error message above the "Driving Licence type" question as "Choose a driving licence type"


  @test@resettlement@financeID@ID
  Scenario:ID: To verify the error dialogs on the BRP journey
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And The user clicks on the finance and ID assessment link and the finance and id assessment section is displayed
    And The user clicks on the ID Documents link and the ID documents section is displayed
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And The ID type "Biometric residence permit" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "Cost for BRP Route" question as "Enter the cost of application"


#    ####################################################################################
#    ############# END ERROR DIALOGS FOR ID APPLICATION #######################
#    ####################################################################################

  @test@resettlement@regression@financeID@ID
  Scenario:ID:  To verify the user can make multiple ID applications and also test the error dialogs when attempting to create an ID application which already exists
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And There are no existing "Finance assessments" applications.
    And There are no existing "bank account" applications.
    And There are no existing "ID" applications.

    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And A "Replacement marriage certificate" ID application with application submitted date of "12/04/2001" GRO number "Yes" UK National "No" UK National BornOverseas Country "N/A" Priority application "No" cost of "100"
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And A "Birth certificate" ID application with application submitted date of "12/04/2001" GRO number "No" UK National "Yes" UK National BornOverseas Country "Nigeria" Priority application "No" cost of "100"
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And A "Replacement civil partnership certificate" ID application with application submitted date of "12/04/2001" GRO number "Yes" UK National "No" UK National BornOverseas Country "N/A" Priority application "No" cost of "100"
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And A "Adoption certificate" ID application with application submitted date of "12/04/2001" GRO number "Yes" UK National "N/A" UK National BornOverseas Country "N/A" Priority application "No" cost of "100"
#   ############# Error Dialog to test selecting the same Adoption certificate  #######################
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And The ID type "Adoption certificate" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "type" question as "Select an option"
    And The Finance and ID Tab selected
#   ############# End Error Dialog to test selecting the same Adoption certificate #######################
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And The ID type "Divorce decree absolute certificate" is selected and the application submitted date of "12/04/2001" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And In the additional ID Divorce decree questions page the user enters "A12345" to Case Number "A12345" to Court Details and "50" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed
    And The confirm button for the apply for ID application is selected and the Finance tab of the resettlement Overview is displayed

    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And A "Biometric residence permit" ID application with application submitted date of "12/04/2020" GRO number "N/A" UK National "N/A" UK National BornOverseas Country "N/A" Priority application "N/A" cost of "100"
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And A "Deed poll certificate" ID application with application submitted date of "12/04/2020" GRO number "N/A" UK National "N/A" UK National BornOverseas Country "N/A" Priority application "N/A" cost of "100"

    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And A "National Insurance Number letter" ID application with application submitted date of "12/04/2001" GRO number "N/A" UK National "N/A" UK National BornOverseas Country "N/A" Priority application "N/A" cost of "N/A"
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And The ID type "Driving licence" is selected and the application submitted date of "12/04/2001" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And In the additional ID Driving license questions page the user selects "Provisional" to Driving license type "Online" to Application made and "50" to cost of application
    And The submit button for the apply for ID documents Additional Question page is selected and the CYA Page for apply for ID documents is displayed
    And The confirm button for the apply for ID application is selected and the Finance tab of the resettlement Overview is displayed

    And The total number of ID applications in the ID section of the Finance and ID tab is "9"
    And For ID entry "1" with name "ID 1" has ID application type of "Marriage certificate" is displayed in the ID section of the Finance and ID Resettlement Overview Page
    And For ID entry "2" with name "ID 2" has ID application type of "Birth certificate" is displayed in the ID section of the Finance and ID Resettlement Overview Page
    And For ID entry "3" with name "ID 3" has ID application type of "Civil partnership certificate" is displayed in the ID section of the Finance and ID Resettlement Overview Page

    And For ID entry "4" with name "ID 4" has ID application type of "Adoption certificate" is displayed in the ID section of the Finance and ID Resettlement Overview Page
    And For ID entry "8" with name "ID 8" has ID application type of "National Insurance Number letter" is displayed in the ID section of the Finance and ID Resettlement Overview Page
    And For ID entry "9" with name "ID 9" has ID application type of "Driving licence" is displayed in the ID section of the Finance and ID Resettlement Overview Page


    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And The ID type "N/A" is selected and the application submitted date of "12/04/1987" is added to the application form
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "type" question as "Select an option"

############## Error Dialog to test selecting the same ID type is selected when all 9 ID types have been selected#######################
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And an ID error dialog page title is displayed with an error message above the "application submitted" question as "ThedateofapplicationsubmittedmustincludeadayThedateofapplicationsubmittedmustincludeamonthThedateofapplicationsubmittedmustincludeayearThedateofapplicationsubmittedmustbearealdate"
    And an ID error dialog page title is displayed with an error message above the "type" question as "Select an option"
    And The ID type "Adoption certificate" is selected and the application submitted date of "12/07/2010" is added to the application form
    And The submit button for the apply for ID documents Additional Question page is selected
    And an ID error dialog page title is displayed with an error message above the "type" question as "Select an option"
    And The ID type "Driving licence" is selected and the application submitted date of "12/07/2015" is added to the application form
    And The submit button for the apply for ID page is selected and the additional ID questions page is displayed
    And an ID error dialog page title is displayed with an error message above the "type" question as "Select an option"
############## Error Dialog to test selecting the same ID type is selected when all 9 ID types have been selected#######################

    And The Finance and ID Tab selected
    And the Id application is deleted




  @test@resettlement@regression@financeID@ID
  Scenario: ID: To verify the user can go through an application accepted ID update journey
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And There are no existing "Finance assessments" applications.
    And There are no existing "bank account" applications.
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And A "Birth certificate" ID application with application submitted date of "12/04/1987" GRO number "No" UK National "Yes" UK National BornOverseas Country "Nigeria" Priority application "No" cost of "100"
    And the update application button is selected and the update ID Application page is displayed
    And the application status of "Accepted" is selected
    And The application ID received date of "12/04/1987" is entered and personal item of "No" and date added to personal items "N/A" in the update ID Application page
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And the change link for "Application status" is selected in the update application CYA page and the Update ID application status page is displayed
    And The application ID received date of "12/04/1987" is entered and personal item of "No" and date added to personal items "N/A" in the update ID Application page
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And the change link for "Added to personal items" is selected in the update application CYA page and the Update ID application status page is displayed
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And the change link for "Date ID received" is selected in the update application CYA page and the Update ID application status page is displayed
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And The application status of "Accepted" date ID received of "12 April 1987" and the date added to personal item of "No" are displayed in the updated ID CYA Page
    And The confirm button for the apply for ID application is selected and the Finance tab of the resettlement Overview is displayed
    And The type of "Birth certificate" application submitted date of "12 April 1987" GRO number "No" UK National "Yes (Nigeria)" Priority application "No" cost of "£100" are displayed in the ID section of the Finance and ID Resettlement Overview Page
    And application status of "Accepted" date ID received date of "12 April 1987" and Added to Personal Items "No" are also displayed in the ID section of the Finance and ID Resettlement Overview Page
    And the Id application is deleted

  @test@resettlement@regression@financeID@ID
  Scenario: ID: To verify the user can go through an application accepted ID update journey
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And There are no existing "Finance assessments" applications.
    And There are no existing "bank account" applications.
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And A "Birth certificate" ID application with application submitted date of "12/04/1987" GRO number "No" UK National "No" UK National BornOverseas Country "N/A" Priority application "No" cost of "100.99"
    And the update application button is selected and the update ID Application page is displayed
    And the application status of "Accepted" is selected
    And The application ID received date of "12/04/1988" is entered and personal item of "Yes" and date added to personal items "12/04/1990" in the update ID Application page
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And The application status of "Accepted" date ID received of "12 April 1988" and the date added to personal item of "12 April 1990" are displayed in the updated ID CYA Page
    And The confirm button for the apply for ID application is selected and the Finance tab of the resettlement Overview is displayed
    And The type of "Birth certificate" application submitted date of "12 April 1987" GRO number "No" UK National "No" Priority application "No" cost of "£100.99" are displayed in the ID section of the Finance and ID Resettlement Overview Page
    And application status of "Accepted" date ID received date of "12 April 1988" and Added to Personal Items "12 April 1990" are also displayed in the ID section of the Finance and ID Resettlement Overview Page
    And the Id application is deleted

  @test@resettlement@financeID@ID
  Scenario: ID: To verify the user can go through a National Insurance Number Letter application accepted ID update journey
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And There are no existing "Finance assessments" applications.
    And There are no existing "bank account" applications.
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And A "National Insurance Number letter" ID application with application submitted date of "12/04/1987" GRO number "N/A" UK National "N/A" UK National BornOverseas Country "N/A" Priority application "N/A" cost of "N/A"
    And the update application button is selected and the update ID Application page is displayed
    And the application status of "Accepted" is selected
    And The application ID received date of "12/04/1988" is entered and personal item of "Yes" and date added to personal items "12/04/1990" in the update ID Application page
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And The application status of "Accepted" date ID received of "12 April 1988" and the date added to personal item of "12 April 1990" are displayed in the updated ID CYA Page
    And The confirm button for the apply for ID application is selected and the Finance tab of the resettlement Overview is displayed
    And The type of "National Insurance Number letter" application submitted date of "12 April 1987" are displayed in the ID section of the Finance and ID Resettlement Overview Page
    And application status of "Accepted" date ID received date of "12 April 1988" and Added to Personal Items "12 April 1990" are also displayed in the ID section of the Finance and ID Resettlement Overview Page
    And the Id application is deleted

  @test@resettlement@regression@financeID@ID
    Scenario: ID: To verify the user can go through an application rejected ID update journey
      And The Finance and ID Tab selected
      And There are no existing "ID" applications.
      And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
      And A "Birth certificate" ID application with application submitted date of "12/04/1987" GRO number "No" UK National "Yes" UK National BornOverseas Country "Peru" Priority application "No" cost of "100"
      And the update application button is selected and the update ID Application page is displayed
      And the application status of "Rejected" is selected
      And The application refund amount of "500" is entered in the update ID Application page
      And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
      And The application status of "Rejected" and application refund amount of date ID received of "£500" are displayed in the updated ID CYA Page
      And The confirm button for the apply for ID application is selected and the Finance tab of the resettlement Overview is displayed
      And The type of "Birth certificate" application submitted date of "12 April 1987" GRO number "No" UK National "Yes (Peru)" Priority application "No" cost of "£100" are displayed in the ID section of the Finance and ID Resettlement Overview Page
      And application status of "Rejected" and application refund of "£500" are also displayed in the ID section of the Finance and ID Resettlement Overview Page
      And the Id application is deleted

  @test@resettlement@regression@financeID@ID
  Scenario: ID: To verify the user can go through a National Insurance Number Letter application rejected ID update journey
    And The Finance and ID Tab selected
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And A "National Insurance Number letter" ID application with application submitted date of "12/10/2000" GRO number "N/A" UK National "N/A" UK National BornOverseas Country "N/A" Priority application "N/A" cost of "N/A"
    And the update application button is selected and the update ID Application page is displayed
    And the application status of "Rejected" is selected
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And The application status of "Rejected" is displayed in the updated ID CYA Page
    And The confirm button for the apply for ID application is selected and the Finance tab of the resettlement Overview is displayed
    And The type of "National Insurance Number letter" application submitted date of "12 October 2000" are displayed in the ID section of the Finance and ID Resettlement Overview Page
    And application status of "Rejected" is also displayed in the ID section of the Finance and ID Resettlement Overview Page
    And the Id application is deleted

  @test@resettlement@regression@financeID@ID
  Scenario: ID: To verify the user can change status from accepted to rejected on the ID update journey
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And A "Birth certificate" ID application with application submitted date of "12/04/1987" GRO number "No" UK National "Yes" UK National BornOverseas Country "Peru" Priority application "No" cost of "100"
    And the update application button is selected and the update ID Application page is displayed
    And the application status of "Accepted" is selected
    And The application ID received date of "12/04/1987" is entered and personal item of "No" and date added to personal items "N/A" in the update ID Application page
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And the change link for "Application status" is selected in the update application CYA page and the Update ID application status page is displayed
    And the application status of "Rejected" is selected
    And The application refund amount of "500" is entered in the update ID Application page
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And The confirm button for the apply for ID application is selected and the Finance tab of the resettlement Overview is displayed
    And The type of "Birth certificate" application submitted date of "12 April 1987" GRO number "No" UK National "Yes (Peru)" Priority application "No" cost of "£100" are displayed in the ID section of the Finance and ID Resettlement Overview Page
    And application status of "Rejected" and application refund of "£500" are also displayed in the ID section of the Finance and ID Resettlement Overview Page
    And the Id application is deleted



#    ####################################################################################
#    ############# ERROR DIALOGS FOR ID APPLICATION #######################
#    ####################################################################################
  @test@resettlement@regression@financeID@ID
  Scenario: ID: To verify the error dialogs on the update ID application journey
    And The Finance and ID Tab selected
    And The Finance and ID page is displayed via the Finance Page
    And There are no existing "ID" applications.
    And The user clicks on the Add an ID application button and the Add ID Documents Page is displayed
    And A "Birth certificate" ID application with application submitted date of "12/04/1987" GRO number "No" UK National "No" UK National BornOverseas Country "N/A" Priority application "No" cost of "100"
    And the update application button is selected and the update ID Application page is displayed
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And an ID error dialog page title is displayed with an error message above the "ID Application Status" question as "Please choose a status"
    And the application status of "Accepted" is selected
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And an ID error dialog page title is displayed with an error message above the "Date ID received" question as "ThedatemustincludeadayThedatemustincludeamonthThedatemustincludeayearThedatemustbearealdate"
    And an ID error dialog page title is displayed with an error message above the "Added to personal items" question as "Select an option"
    And the application status of "Rejected" is selected
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And an ID error dialog page title is displayed with an error message above the "Application refund amount" question as "Enter a refund amount"
    And the application status of "Accepted" is selected
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And an ID error dialog page title is displayed with an error message above the "Date ID received" question as "ThedatemustincludeadayThedatemustincludeamonthThedatemustincludeayearThedatemustbearealdate"
    And an ID error dialog page title is displayed with an error message above the "Added to personal items" question as "Select an option"

    And The application ID received date of "35/04/1988" is entered and personal item of "N/A" and date added to personal items "N/A" in the update ID Application page
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And an ID error dialog page title is displayed with an error message above the "Date ID received" question as "Thedatemustbearealdate"

    And The application ID received date of "12/31/1988" is entered and personal item of "N/A" and date added to personal items "N/A" in the update ID Application page
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And an ID error dialog page title is displayed with an error message above the "Date ID received" question as "Thedatemustbearealdate"


    And The application ID received date of "12/04/1988" is entered and personal item of "N/A" and date added to personal items "N/A" in the update ID Application page
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And an ID error dialog page title is displayed with an error message above the "Added to personal items" question as "Select an option"


    And The application ID received date of "12/04/1988" is entered and personal item of "Yes" and date added to personal items "N/A" in the update ID Application page
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And an ID error dialog page title is displayed with an error message above the "Yes in the Added to personal items" question as "ThedatemustincludeadayThedatemustincludeamonthThedatemustincludeayearThedatemustbearealdate"

    And The application ID received date of "12/04/1988" is entered and personal item of "Yes" and date added to personal items "51/11/2010" in the update ID Application page
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And an ID error dialog page title is displayed with an error message above the "Yes in the Added to personal items" question as "Thedatemustbearealdate"

    And The application ID received date of "12/04/1988" is entered and personal item of "Yes" and date added to personal items "11/31/2010" in the update ID Application page
    And The submit button for the ID Application update page and the check your answers page for update ID Application page is displayed
    And an ID error dialog page title is displayed with an error message above the "Yes in the Added to personal items" question as "Thedatemustbearealdate"



#    ##########################################################################
#    ############# END ERROR DIALOGS FOR ID APPLICATION #######################
#    ##########################################################################