#Feature: Appointment Resettlement Overview Page
#
#
#
#  @test@resettlementOverview@regression@appointments
#  Scenario Outline: Appointment :To verify the Appointment Overview Page.
#    Given The User navigates to the Resettlement Overview Page as Prisoner "<Prisoner>" in the Moorland Prison
#    And The "<Resettlement Overview Tab>" tab is selected
#    When The appointment link is selected and appointments are displayed
#    And the title row of the appointment section table is populated with "<Appointments Title Row>"
#    And the first entry of the appointment section table is populated with "<Appointments First Entry>"
#
#
#
#    Examples:
#      | Prisoner        | Resettlement Overview Tab |Appointments Title Row |Appointments First Entry|
#      | Clemence, Chrisy| Resettlement overview     |TitleContactDateTimeLocation|AppointmentwithCRSStaff(NS)UnallocatedStaff25Nov202313:00|
#      | Smith, John     | Resettlement overview     |TitleContactDateTimeLocation |AppointmentwithCRSStaff(NS)UnallocatedStaff18Sept202314:46|
#
