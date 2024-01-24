#Feature: Finance and ID tab of the Resettlement Overview Page
#
#Background:
#    Given The User navigates to the "Finance and ID" Tab of the Resettlement Overview Page as Prisoner "Smith, John" in the Moorland Prison



# ############################################################################################################################
# ###############################FINANCE AND ID----- BANK  ########################################################################
# ############################################################################################################################
#
#  @test@resettlement@regression@financeID@bank
#  Scenario: Bank: To verify the user can click on all navigation links of the Finance and ID Resettlement Overview Tab. To verify the user can make an initial bank account application and contents are displayed in the Finance and ID Resettlement Overview Tab
#  And The Finance and ID Tab selected
#  And The Finance and ID page is displayed via the Finance Page
#  And The user clicks on the finance and ID assessment link and the finance and id assessment section is displayed
#  And The user clicks on the finance link and the finance section is displayed
#  And There are no existing "Finance assessments" applications.
#  And There are no existing "bank account" applications.
#  And There are no existing "ID" applications.
#  And The user clicks on the Add a bank account application button and the Add bank accounts Page is displayed
#  And The bank "NatWest" is selected and the application date of "12/12/2022" is added to the application form
#  And The submit button for the apply for bank account is selected and check your answers page is displayed
#  And the change link for the "Bank" is selected in the CYA page and the apply for bank account page is displayed
#  And The bank "Lloyds" is selected and the application date of "15/12/2022" is added to the application form
#  And The submit button for the apply for bank account is selected and check your answers page is displayed
#  And the change link for the "Application submitted" is selected in the CYA page and the apply for bank account page is displayed
#  And The bank "HSBC" is selected and the application date of "14/12/2022" is added to the application form
#  And The submit button for the apply for bank account is selected and check your answers page is displayed
#  And The bank of "HSBC" and the application submitted date of "14 December 2022" are displayed in the Add Bank account CYA Page
#  And The confirm button for the apply for bank account is selected and the Finance tab of the resettlement Overview is displayed
#  And The Add a bank account application button is not present
#  And the Finance section of the Finance and ID Resettlement Overview page is populated with bank as "HSBC" and the application submitted as of "14 December 2022" and the status of "Pending" displayed
#  And The bank application is deleted

#######################################################################################
################ERROR DIALOGS FOR FIRST BANK ACCOUNT APPLICATION#######################
#######################################################################################
#  @test@resettlement@regression@financeID@bank@error
#  Scenario: Bank: To verify the error dialogs in the first Apply for bank account page
#    And The Finance and ID Tab selected
#    And The user clicks on the finance link and the finance section is displayed
#    And There are no existing "bank account" applications.
#    And The user clicks on the Add a bank account application button and the Add bank accounts Page is displayed
#    And The submit button for the apply for bank account is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "select Bank" question as "The application must include a bank name"
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "application submitted" question as "ThedatemustincludeadayThedatemustincludeamonthThedatemustincludeayearThedatemustbearealdate"
#    And The bank "NatWest" is selected
#    And The submit button for the apply for bank account is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "application submitted" question as "ThedatemustincludeadayThedatemustincludeamonthThedatemustincludeayearThedatemustbearealdate"
#
#  @test@resettlement@regression@financeID@bank@error
#  Scenario: Bank: To verify the error dialogs in the first Apply for bank account page when the wrong dates are entered into the application submitted field
#    And The Finance and ID Tab selected
#    And The user clicks on the finance link and the finance section is displayed
#    And There are no existing "bank account" applications.
#    And The user clicks on the Add a bank account application button and the Add bank accounts Page is displayed
#    And application submitted date of "2/12/2007" is added to the application form
#    And The submit button for the apply for bank account is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "select Bank" question as "The application must include a bank name"
#    And The bank "Santander" is selected
#    And application submitted date of "12/13/2007" is added to the application form
#    And The submit button for the apply for bank account is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "application submitted" question as "Thedatemustbearealdate"
#    And application submitted date of "41/05/2007" is added to the application form
#    And The submit button for the apply for bank account is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "application submitted" question as "Thedatemustbearealdate"
#    And application submitted date of "//" is added to the application form
#    And The submit button for the apply for bank account is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "application submitted" question as "ThedatemustincludeadayThedatemustincludeamonthThedatemustincludeayearThedatemustbearealdate"


    ####################################################################################
    #############ERROR DIALOGS FOR FIRST BANK ACCOUNT APPLICATION DONE##################
    ####################################################################################


#  @test@resettlement@regression@financeID@bank
#   Scenario: Bank: To verify the application status with Account Opened journey works as expected and the CYA page works as expected
#   And The Finance and ID Tab with a bank application for bank "Santander" with application submitted date of "12/04/2021" and status pending
#   And the user clicks on the Update application button in the Finance section and the Apply for bank account update application status page is displayed
#   And The bank application status of "Account opened" is selected and additional fields are then displayed in the application status page
#   And the bank application received response date of "09/06/2023" is entered and "No" selected for Added to personal items with date "N/A" for Account Opened Status only
#   And The submit button for the apply for bank account is selected and check your answers page is displayed
#   And the change link for the "Status" is selected in the apply for bank account update application status CYA page and the apply for bank account update application status page is displayed
#   And The application status of "Account opened" is selected and the bank details response date of "08/06/2023" is entered and "Yes" selected for Added to personal items with date "08/11/2022"
#   And The submit button for the apply for bank account is selected and check your answers page is displayed
#   And the change link for the "Date account opened" is selected in the apply for bank account update application status CYA page and the apply for bank account update application status page is displayed
#   And The submit button for the apply for bank account is selected and check your answers page is displayed
#   And the change link for the "Added to personal items" is selected in the apply for bank account update application status CYA page and the apply for bank account update application status page is displayed
#   And The submit button for the apply for bank account is selected and check your answers page is displayed
#   And The status of "Account opened" and the date account opened date of "8 June 2023" and Added to personal items of "8 November 2022" is displayed in the bank account update application CYA page
#    And The confirm button for the apply for bank account is selected and the Finance tab of the resettlement Overview is displayed
#    And the Finance section of the Finance and ID Resettlement Overview page is populated with bank as "Santander" and the application submitted as of "12 April 2021" and the status of "Account opened" displayed
#   And the additional questions of the Finance section of the Finance and ID Resettlement Overview page is populated with Date account opened as "8 June 2023" and date added to personal items of "8 November 2022" is displayed
#   And The bank application is deleted
#
#
#
#  @test@resettlement@financeID@bank
#   Scenario:Bank: To verify the application status with Account Declined journey works as expected
#   And The Finance and ID Tab with a bank application for bank "Barclays" with application submitted date of "12/10/2021" and status pending
#   And the user clicks on the Update application button in the Finance section and the Apply for bank account update application status page is displayed
#   And The bank application status of "Account declined" is selected and additional fields are then displayed in the application status page
#   And the bank application rejected response date of "09/06/2023" is entered for Non Account Opened Statuses
#   And The submit button for the apply for bank account is selected and check your answers page is displayed
#   And the change link for the "Status" is selected in the apply for bank account update application status CYA page and the apply for bank account update application status page is displayed
#   And The bank application status of "Returned ineligible" is selected and additional fields are then displayed in the application status page
#   And The application status of "Returned ineligible" is selected and the bank details response date of "18/11/2022" is entered and "N/A" selected for Added to personal items with date "N/A"
#   And The submit button for the apply for bank account is selected and check your answers page is displayed
#   And the change link for the "Date heard back from application" is selected in the apply for bank account update application status CYA page and the apply for bank account update application status page is displayed
#   And The submit button for the apply for bank account is selected and check your answers page is displayed
#   And The status of "Returned ineligible" and the date account opened date of "18 November 2022" and Added to personal items of "N/A" is displayed in the bank account update application CYA page
#    And The confirm button for the apply for bank account is selected and the Finance tab of the resettlement Overview is displayed
#   And the Finance section of the Finance and ID Resettlement Overview page is populated with bank as "Barclays" and the application submitted as of "12 October 2021" and the status of "Returned ineligible" displayed
#   And the additional questions of the Finance section of the Finance and ID Resettlement Overview page is populated with Date account heard back as "18 November 2022" and "N/A" selected for Added to personal items
#   And The bank application is deleted
#
#
#
#  @test@resettlement@regression@financeID@bank
#   Scenario: Bank:To verify the application status with Returned inaccurate journey works as expected
#   And The Finance and ID Tab with a bank application for bank "Co-op" with application submitted date of "12/04/2021" and status pending
#   And the user clicks on the Update application button in the Finance section and the Apply for bank account update application status page is displayed
#   And The bank application status of "Returned inaccurate" is selected and additional fields are then displayed in the application status page
#   And the bank application rejected response date of "12/04/2019" is entered for Non Account Opened Statuses
#   And The submit button for the apply for bank account is selected and check your answers page is displayed
#   And The status of "Returned inaccurate" and the date account opened date of "12 April 2019" and Added to personal items of "N/A" is displayed in the bank account update application CYA page
#   And the change link for the "Status" is selected in the apply for bank account update application status CYA page and the apply for bank account update application status page is displayed
#   And The bank application status of "Returned incomplete" is selected and additional fields are then displayed in the application status page
#   And The application status of "Returned incomplete" is selected and the bank details response date of "08/06/2023" is entered and "N/A" selected for Added to personal items with date "N/A"
#   And The submit button for the apply for bank account is selected and check your answers page is displayed
#   And the change link for the "Date heard back from application" is selected in the apply for bank account update application status CYA page and the apply for bank account update application status page is displayed
#   And The submit button for the apply for bank account is selected and check your answers page is displayed
#   And The status of "Returned incomplete" and the date account opened date of "8 June 2023" and Added to personal items of "N/A" is displayed in the bank account update application CYA page
#    And The confirm button for the apply for bank account is selected and the Finance tab of the resettlement Overview is displayed
#   And the Finance section of the Finance and ID Resettlement Overview page is populated with bank as "Co-op" and the application submitted as of "12 April 2021" and the status of "Returned incomplete" displayed
#   And The application history dropdown menu is selected
#   And the Application history of the Finance section of the Finance and ID Resettlement Overview page has the application submitted date of "12 April 2021" and Application returned incomplete or inaccurate of "8 June 2023" displayed
#   And The bank application is deleted
#
#
#
#
#  @test@resettlement@regression@financeID@bank
#  Scenario:Bank: To verify the user is able to change application status types via the CYA page
#  And The Finance and ID Tab with a bank application for bank "Nationwide" with application submitted date of "30/09/2022" and status pending
#  And the user clicks on the Update application button in the Finance section and the Apply for bank account update application status page is displayed
#  And The bank application status of "Returned incomplete" is selected and additional fields are then displayed in the application status page
#  And the bank application rejected response date of "01/10/2022" is entered for Non Account Opened Statuses
#  And The submit button for the apply for bank account is selected and check your answers page is displayed
#  And The status of "Returned incomplete" and the date account opened date of "1 October 2022" and Added to personal items of "N/A" is displayed in the bank account update application CYA page
#  And the change link for the "Status" is selected in the apply for bank account update application status CYA page and the apply for bank account update application status page is displayed
#  And The bank application status of "Account opened" is selected and additional fields are then displayed in the application status page
#  And the bank application received response date of "02/10/2022" is entered and "No" selected for Added to personal items with date "N/A" for Account Opened Status only
#  And The submit button for the apply for bank account is selected and check your answers page is displayed
#  And The status of "Account opened" and the date account opened date of "2 October 2022" and Added to personal items of "No" is displayed in the bank account update application CYA page
#  And the change link for the "Status" is selected in the apply for bank account update application status CYA page and the apply for bank account update application status page is displayed
#  And The bank application status of "Account declined" is selected and additional fields are then displayed in the application status page
#  And the bank application rejected response date of "03/10/2022" is entered for Non Account Opened Statuses
#  And The submit button for the apply for bank account is selected and check your answers page is displayed
#  And The status of "Account declined" and the date account opened date of "3 October 2022" and Added to personal items of "N/A" is displayed in the bank account update application CYA page
#  And the change link for the "Status" is selected in the apply for bank account update application status CYA page and the apply for bank account update application status page is displayed
#  And The bank application status of "Returned ineligible" is selected and additional fields are then displayed in the application status page
#  And the bank application rejected response date of "04/10/2022" is entered for Non Account Opened Statuses
#  And The submit button for the apply for bank account is selected and check your answers page is displayed
#  And The status of "Returned ineligible" and the date account opened date of "4 October 2022" and Added to personal items of "N/A" is displayed in the bank account update application CYA page
#  And the change link for the "Status" is selected in the apply for bank account update application status CYA page and the apply for bank account update application status page is displayed
#  And The bank application status of "Returned inaccurate" is selected and additional fields are then displayed in the application status page
#  And the bank application rejected response date of "05/10/2022" is entered for Non Account Opened Statuses
#  And The submit button for the apply for bank account is selected and check your answers page is displayed
#  And The status of "Returned inaccurate" and the date account opened date of "5 October 2022" and Added to personal items of "N/A" is displayed in the bank account update application CYA page
#  And the change link for the "Status" is selected in the apply for bank account update application status CYA page and the apply for bank account update application status page is displayed
#  And The bank application status of "Account opened" is selected and additional fields are then displayed in the application status page
#  And the bank application received response date of "06/10/2022" is entered and "No" selected for Added to personal items with date "N/A" for Account Opened Status only
#  And The submit button for the apply for bank account is selected and check your answers page is displayed
#  And The confirm button for the apply for bank account is selected and the Finance tab of the resettlement Overview is displayed
#  And the Finance section of the Finance and ID Resettlement Overview page is populated with bank as "Nationwide" and the application submitted as of "30 September 2022" and the status of "Account opened" displayed
#  And The bank application is deleted


#####################################################################################
##############ERROR DIALOGS FOR UPDATE BANK ACCOUNT APPLICATION#######################
#####################################################################################


#  @test@resettlement@regression@financeID@bank@error
#   Scenario: Bank:To verify the error dialogs when a status of Account opened is selected and the submitted is selected.
#   And The Finance and ID Tab with a bank application for bank "HSBC" with application submitted date of "12/04/2021" and status pending
#   And the user clicks on the Update application button in the Finance section and the Apply for bank account update application status page is displayed
#   And The bank application status of "Account opened" is selected and additional fields are then displayed in the application status page
#   And The submit button is selected
#   And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date account opened" question as "ThedatemustincludeamonthThedatemustincludeayearThedatemustbearealdate"
#   And The Apply for Bank Account error dialog page title is displayed with an error message above the "Added to personal items" question as "Select if it was added to personal items"
#   And The bank application status of "Account opened" is selected and additional fields are then displayed in the application status page
#   And the bank application received response date of "41/06/2023" is entered and "No" selected for Added to personal items with date "N/A" for Account Opened Status only
#   And The submit button is selected
#   And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date account opened" question as "Thedatemustbearealdate"
#   And the bank application received response date of "09/17/2023" is entered and "No" selected for Added to personal items with date "N/A" for Account Opened Status only
#   And The submit button is selected
#   And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date account opened" question as "Thedatemustbearealdate"
#   And the bank application received response date of "09/06/1997" is entered and "Yes" selected for Added to personal items with date "N/A" for Account Opened Status only
#   And The submit button is selected
#   And The Apply for Bank Account error dialog page title is displayed with an error message above the "Yes in the Added to personal items" question as "ThedatemustincludeadayThedatemustincludeamonthThedatemustincludeayearThedatemustbearealdate"
#   And the bank application received response date of "09/06/1997" is entered and "Yes" selected for Added to personal items with date "41/06/2023" for Account Opened Status only
#   And The submit button is selected
#   And The Apply for Bank Account error dialog page title is displayed with an error message above the "Yes in the Added to personal items" question as "Thedatemustbearealdate"
#   And the bank application received response date of "09/06/1997" is entered and "Yes" selected for Added to personal items with date "15/15/2023" for Account Opened Status only
#   And The submit button is selected
#   And The Apply for Bank Account error dialog page title is displayed with an error message above the "Yes in the Added to personal items" question as "Thedatemustbearealdate"
#
#
#  @test@resettlement@regression@financeID@bank@error
#   Scenario: Bank: To verify the error dialogs when a status of Returned Incomplete is selected and the submitted is selected.
#     And The Finance and ID Tab with a bank application for bank "Nationwide" with application submitted date of "30/09/2022" and status pending
#     And the user clicks on the Update application button in the Finance section and the Apply for bank account update application status page is displayed
#     And The bank application status of "Returned incomplete" is selected and additional fields are then displayed in the application status page
#     And The submit button is selected
#     And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date heard back" question as "ThedatemustincludeadayThedatemustincludeamonthThedatemustincludeayearThedatemustbearealdate"
#     And the bank application rejected response date of "41/06/2023" is entered for Non Account Opened Statuses
#     And The submit button is selected
#     And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date heard back" question as "Thedatemustbearealdate"
#     And the bank application rejected response date of "15/15/2023" is entered for Non Account Opened Statuses
#     And The submit button is selected
#     And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date heard back" question as "Thedatemustbearealdate"
#     And the bank application rejected response date of "././." is entered for Non Account Opened Statuses
#     And The submit button is selected
#     And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date heard back" question as "Thedatemustbearealdate"



#      ####################################################################################
#      #############END******ERROR DIALOGS FOR UPDATE BANK ACCOUNT APPLICATION********END##
#      ####################################################################################


#  @test@resettlement@regression@financeID@bank
# Scenario:Bank: To verify the application status journey after an application has been returned as either incomplete or inaccurate and the account is opened. To also verify the user is able to change reapplication status from opened to declined
# And The Finance and ID Tab with a bank application for bank "HSBC" with application submitted date of "12/04/2000" and the application has been returned as "Returned incomplete" on date heard back as "12/04/2001"
# And the resubmit application button is selected and the bank application resubmitted page is displayed
#
# And The application resubmitted date of "12/04/2002" is entered and resubmitted application status of "Account opened" is selected and additional questions for bank application resubmitted page is displayed
# And The application account opened date of "28/04/2002" is entered and "No" selected for Added to personal items is selected and Personal items date "N/A" in the bank application resubmitted page is displayed
# And The submit button for the apply for bank account is selected and check your answers page is displayed
# And The application resubmitted date of "12 April 2002" status of "Account opened" date account opened date of "28 April 2002" and Added to personal items text of "No" is displayed in the resubmit bank account CYA page
#
# And the change link for "Application resubmitted" is selected in the bank application resubmitted CYA page and the bank application resubmitted page is displayed
# And The application resubmitted date of "12/04/2002" is entered and resubmitted application status of "Account opened" is selected and additional questions for bank application resubmitted page is displayed
# And The application account opened date of "28/04/2002" is entered and "Yes" selected for Added to personal items is selected and Personal items date "29/04/2002" in the bank application resubmitted page is displayed
# And The submit button for the apply for bank account is selected and check your answers page is displayed
#
# And the change link for "Status" is selected in the bank application resubmitted CYA page and the bank application resubmitted page is displayed
# And The submit button for the apply for bank account is selected and check your answers page is displayed
#
# And the change link for "Date account opened" is selected in the bank application resubmitted CYA page and the bank application resubmitted page is displayed
# And The submit button for the apply for bank account is selected and check your answers page is displayed
#
# And the change link for "Added to personal items" is selected in the bank application resubmitted CYA page and the bank application resubmitted page is displayed
# And The submit button for the apply for bank account is selected and check your answers page is displayed
#
# And The confirm button for the apply for bank account is selected and the Finance tab of the resettlement Overview is displayed
# And the Finance section of the Finance and ID Resettlement Overview page is populated with bank as "HSBC" and the application submitted as of "12 April 2000" and the status of "Account opened" displayed
# And the additional questions of the Finance section of the Finance and ID Resettlement Overview page is populated with Date account opened as "28 April 2002" and date added to personal items of "29 April 2002" is displayed
#
# And The application history dropdown menu is selected
# And the Application history of the Finance section of the Finance and ID Resettlement Overview page has the application submitted date of "12 April 2000" and Application returned incomplete or inaccurate of "12 April 2001" displayed
# And the Application history of the Finance section of the Finance and ID Resettlement Overview page has the application re-submitted date of "12 April 2002" and Application opened date of "28 April 2002" displayed
# And The bank application is deleted



#  @test@resettlement@regression@financeID@bank
#  Scenario: Bank:To verify the application status journey after an application has been returned as either incomplete or inaccurate and the account is declined. To also verify the user is able to change reapplication status from declined to opened
#    And The Finance and ID Tab with a bank application for bank "NatWest" with application submitted date of "12/04/2005" and the application has been returned as "Returned incomplete" on date heard back as "12/05/2005"
#    And the resubmit application button is selected and the bank application resubmitted page is displayed
#
#    And The application resubmitted date of "12/06/2005" is entered and resubmitted application status of "Account declined" is selected and additional questions for bank application resubmitted page is displayed
#    And The application date heard back from resubmission date of "12/07/2005" in the bank application resubmitted page is displayed
#
#    And The submit button for the apply for bank account is selected and check your answers page is displayed
#    And The application resubmitted date of "12 June 2005" status of "Account declined" date account rejected date of "12 July 2005" is displayed in the resubmit bank account CYA page
#
#    And the change link for "Application resubmitted" is selected in the bank application resubmitted CYA page and the bank application resubmitted page is displayed
#    And The submit button for the apply for bank account is selected and check your answers page is displayed
#
#    And the change link for "Status" is selected in the bank application resubmitted CYA page and the bank application resubmitted page is displayed
#    And The application resubmitted date of "13/06/2005" is entered and resubmitted application status of "Account declined" is selected and additional questions for bank application resubmitted page is displayed
#    And The application date heard back from resubmission date of "14/07/2005" in the bank application resubmitted page is displayed
#    And The submit button for the apply for bank account is selected and check your answers page is displayed
#
#    And the change link for "Date heard back" is selected in the bank application resubmitted CYA page and the bank application resubmitted page is displayed
#    And The submit button for the apply for bank account is selected and check your answers page is displayed
#
#    And The confirm button for the apply for bank account is selected and the Finance tab of the resettlement Overview is displayed
#    And the Finance section of the Finance and ID Resettlement Overview page is populated with bank as "NatWest" and the application submitted as of "12 April 2005" and the status of "Account declined" displayed
#    And The application history dropdown menu is selected
#    And the Application history of the Finance section of the Finance and ID Resettlement Overview page has the application submitted date of "12 April 2005" and Application returned incomplete or inaccurate of "12 May 2005" displayed
#    And the Application history of the Finance section of the Finance and ID Resettlement Overview page has the application re-submitted date of "13 June 2005" and Application status of "14 July 2005" displayed
#    And The bank application is deleted



#  @test@resettlement@regression@financeID@bank
#  Scenario: Bank:To verify the status can be changed fromm accepted to declined and vice versa
#    And The Finance and ID Tab with a bank application for bank "NatWest" with application submitted date of "12/04/2005" and the application has been returned as "Returned incomplete" on date heard back as "12/05/2005"
#    And the resubmit application button is selected and the bank application resubmitted page is displayed
#    And The application resubmitted date of "12/06/2005" is entered and resubmitted application status of "Account declined" is selected and additional questions for bank application resubmitted page is displayed
#    And The application date heard back from resubmission date of "12/07/2005" in the bank application resubmitted page is displayed
#    And The submit button for the apply for bank account is selected and check your answers page is displayed
#    And The application resubmitted date of "12 June 2005" status of "Account declined" date account rejected date of "12 July 2005" is displayed in the resubmit bank account CYA page
#    And the change link for "Status" is selected in the bank application resubmitted CYA page and the bank application resubmitted page is displayed
#    And The application resubmitted date of "13/04/2002" is entered and resubmitted application status of "Account opened" is selected and additional questions for bank application resubmitted page is displayed
#    And The application account opened date of "28/04/2002" is entered and "No" selected for Added to personal items is selected and Personal items date "N/A" in the bank application resubmitted page is displayed
#    And The submit button for the apply for bank account is selected and check your answers page is displayed
#    And The application resubmitted date of "13 April 2002" status of "Account opened" date account opened date of "28 April 2002" and Added to personal items text of "No" is displayed in the resubmit bank account CYA page
#    And the change link for "Status" is selected in the bank application resubmitted CYA page and the bank application resubmitted page is displayed
#    And The application resubmitted date of "12/06/2005" is entered and resubmitted application status of "Account declined" is selected and additional questions for bank application resubmitted page is displayed
#    And The application date heard back from resubmission date of "12/07/2005" in the bank application resubmitted page is displayed
#    And The submit button for the apply for bank account is selected and check your answers page is displayed
#    And The application resubmitted date of "12 June 2005" status of "Account declined" date account rejected date of "12 July 2005" is displayed in the resubmit bank account CYA page
#    And The confirm button for the apply for bank account is selected and the Finance tab of the resettlement Overview is displayed
#    And The bank application is deleted


    ####################################################################################
    ############# ERROR DIALOGS FOR RESUBMITTED BANK ACCOUNT #######################
    ####################################################################################

#  @test@resettlement@regression@financeID@bank@error
#  Scenario: Bank: To verify the error dialogs on the re-submitted bank application route when an application has been opened
#  And The Finance and ID Tab with a bank application for bank "HSBC" with application submitted date of "12/04/2000" and the application has been returned as "Returned incomplete" on date heard back as "12/04/2001"
#  And the resubmit application button is selected and the bank application resubmitted page is displayed
#  And The submit button is selected
#  And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date application resubmitted" question as "ThedatemustincludeadayThedatemustincludeamonthThedatemustincludeayearThedatemustbearealdate"
#  And The Apply for Bank Account error dialog page title is displayed with an error message above the "Resubmitted application status" question as "The application must include a status"
#    And The application resubmitted date of "12/04/2002" is entered and resubmitted application status of "N/A" is selected and additional questions for bank application resubmitted page is displayed
#    And The submit button is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "Resubmitted application status" question as "The application must include a status"
#
#    And The application resubmitted date of "32/04/2002" is entered and resubmitted application status of "N/A" is selected and additional questions for bank application resubmitted page is displayed
#    And The submit button is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date application resubmitted" question as "Thedatemustbearealdate"
#    And The application resubmitted date of "09/14/1998" is entered and resubmitted application status of "N/A" is selected and additional questions for bank application resubmitted page is displayed
#    And The submit button is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date application resubmitted" question as "Thedatemustbearealdate"
#
#    And The application resubmitted date of "12/04/2002" is entered and resubmitted application status of "Account opened" is selected and additional questions for bank application resubmitted page is displayed
#    And The submit button is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date account opened" question as "ThedatemustincludeadayThedatemustincludeamonthThedatemustincludeayearThedatemustbearealdate"
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "Added to personal items" question as "Select if it was added to personal items"
#
#    And The application account opened date of "28/04/2002" is entered and "N/A" selected for Added to personal items is selected and Personal items date "N/A" in the bank application resubmitted page is displayed
#    And The submit button is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "Added to personal items" question as "Select if it was added to personal items"
#
#    And The application account opened date of "32/09/2002" is entered and "N/A" selected for Added to personal items is selected and Personal items date "N/A" in the bank application resubmitted page is displayed
#    And The submit button is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date account opened" question as "Thedatemustbearealdate"
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "Added to personal items" question as "Select if it was added to personal items"
#    And The application account opened date of "12/15/2002" is entered and "No" selected for Added to personal items is selected and Personal items date "N/A" in the bank application resubmitted page is displayed
#    And The submit button is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date account opened" question as "Thedatemustbearealdate"
#    And The application account opened date of "28/04/2002" is entered and "Yes" selected for Added to personal items is selected and Personal items date "N/A" in the bank application resubmitted page is displayed
#    And The submit button is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "Yes in the Added to personal items for Resubmitted Application" question as "ThedatemustincludeadayThedatemustincludeamonthThedatemustincludeayearThedatemustbearealdate"
#    And The application account opened date of "28/04/2002" is entered and "Yes" selected for Added to personal items is selected and Personal items date "32/10/2002" in the bank application resubmitted page is displayed
#    And The submit button is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "Yes in the Added to personal items for Resubmitted Application" question as "Thedatemustbearealdate"
#    And The application account opened date of "28/04/2002" is entered and "Yes" selected for Added to personal items is selected and Personal items date "12/15/2002" in the bank application resubmitted page is displayed
#    And The submit button is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "Yes in the Added to personal items for Resubmitted Application" question as "Thedatemustbearealdate"



#  @test@resettlement@regression@financeID@bank@error
#  Scenario: Bank: To verify the error dialogs on the re-submitted bank application route when an application has been declined
#    And The Finance and ID Tab with a bank application for bank "HSBC" with application submitted date of "12/04/2000" and the application has been returned as "Returned incomplete" on date heard back as "12/04/2001"
#    And the resubmit application button is selected and the bank application resubmitted page is displayed
#    And The application resubmitted date of "12/06/2005" is entered and resubmitted application status of "Account declined" is selected and additional questions for bank application resubmitted page is displayed
#    And The submit button is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date heard back for Resubmitted bank Application" question as "ThedatemustincludeadayThedatemustincludeamonthThedatemustincludeayearThedatemustbearealdate"
#    And The application date heard back from resubmission date of "200/04/2010" in the bank application resubmitted page is displayed
#    And The submit button is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date heard back for Resubmitted bank Application" question as "Thedatemustbearealdate"
#    And The application date heard back from resubmission date of "21/22/2010" in the bank application resubmitted page is displayed
#    And The submit button is selected
#    And The Apply for Bank Account error dialog page title is displayed with an error message above the "Date heard back for Resubmitted bank Application" question as "Thedatemustbearealdate"

    ####################################################################################
    ############# END ERROR DIALOGS FOR RESUBMITTED BANK ACCOUNT #######################
    ####################################################################################