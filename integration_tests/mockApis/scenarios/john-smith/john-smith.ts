import { stubFor } from '../../wiremock'
import responseHeaders from '../../headers'

export const johnSmithImage = () =>
  stubFor({
    name: 'john-smith-image',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/image/1313058',
      method: 'GET',
    },
    response: {
      status: 200,
      base64Body:
        '/9j/4AAQSkZJRgABAQAASABIAAD/4QD6RXhpZgAATU0AKgAAAAgABwESAAMAAAABAAEAAAEaAAUAAAABAAAAYgEbAAUAAAABAAAAagEoAAMAAAABAAIAAAExAAIAAAAhAAAAcgEyAAIAAAAUAAAAlIdpAAQAAAABAAAAqAAAAAAAAABIAAAAAQAAAEgAAAABQWRvYmUgUGhvdG9zaG9wIDI1LjAgKE1hY2ludG9zaCkAADIwMjM6MDk6MTUgMTA6Mzk6MTcAAASQBAACAAAAFAAAAN6gAQADAAAAAQABAACgAgAEAAAAAQAAAMigAwAEAAAAAQAAAMgAAAAAMjAyMzowMzoyNyAxMjo0Njo1MQD/4Q38aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiBkYzpmb3JtYXQ9ImltYWdlL2pwZWciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKE1hY2ludG9zaCkiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTA5LTE1VDEwOjM5OjE3KzAxOjAwIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0wMy0yN1QxMjo0Njo1MSswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wOS0xNVQxMDozOToxNyswMTowMCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjkxMTgzNmM4LTg5NmMtNDg5YS05MDI0LTUxNTMzYzVlNTI3OSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjQ5YmFhODA4LTU4N2EtMGE0YS04ZDBkLTY4NmI3YzY1Y2VhYyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyNjdiNzY4Zi0yMzM4LTQ1MTItYmRmOC03NzJkMjJiYWY1ZmQiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKE1hY2ludG9zaCkiIHN0RXZ0OndoZW49IjIwMjMtMDMtMjdUMTI6NDY6NTErMDE6MDAiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTExODM2YzgtODk2Yy00ODlhLTkwMjQtNTE1MzNjNWU1Mjc5IiBzdEV2dDphY3Rpb249ImNyZWF0ZWQiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9wbmcgdG8gaW1hZ2UvanBlZyIvPiA8cmRmOmxpIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyNS4wIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIiBzdEV2dDp3aGVuPSIyMDIzLTA5LTE1VDEwOjM5OjE3KzAxOjAwIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjI2N2I3NjhmLTIzMzgtNDUxMi1iZGY4LTc3MmQyMmJhZjVmZCIgc3RFdnQ6YWN0aW9uPSJzYXZlZCIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PgD/7QBkUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAACwcAVoAAxslRxwCAAACAAIcAj4ACDIwMjMwMzI3HAI/AAsxMjQ2NTErMDEwMDhCSU0EJQAAAAAAELKIJmvHqy84zgwfr2LARPv/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwAFBQUFBQUIBQUICwgICAsPCwsLCw8TDw8PDw8TFxMTExMTExcXFxcXFxcXHBwcHBwcISEhISElJSUlJSUlJSUl/9sAQwEGBgYJCQkQCQkQJhoVGiYmJiYm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',
      headers: { ...responseHeaders, 'Content-Type': 'image/jpeg' },
    },
  })

export const johnSmithStaffContacts = () =>
  stubFor({
    name: 'john-smith-staff-contacts',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/staff-contacts',
      method: 'GET',
    },
    response: {
      headers: responseHeaders,
      status: 200,
      jsonBody: {
        primaryPom: { name: 'David Jones' },
        secondaryPom: { name: 'Barbara Winter' },
        com: { name: 'John Doe' },
        keyWorker: null,
      },
    },
  })

export const johnSmithCaseNotes = () =>
  stubFor({
    name: 'john-smith-case-notes',
    request: {
      url: '/rpApi/resettlement-passport/case-notes/A8731DY?page=0&size=10&sort=occurenceDateTime%2CDESC&days=0&pathwayType=All',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        content: [
          {
            caseNoteId: '47041356',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T18:08:43.322997385',
            occurenceDateTime: '2024-04-02T18:08:43',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Finance and ID Pre-release report\\n\\nuij',
          },
          {
            caseNoteId: '47041355',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T18:08:43.16034987',
            occurenceDateTime: '2024-04-02T18:08:43',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Education, skills and work Pre-release report\\n\\nui',
          },
          {
            caseNoteId: '47041357',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T18:08:43.479647039',
            occurenceDateTime: '2024-04-02T18:08:43',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Health Pre-release report\\n\\ng',
          },
          {
            caseNoteId: '47041352',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T18:08:42.647197381',
            occurenceDateTime: '2024-04-02T18:08:42',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Attitudes, thinking and behaviour Pre-release report\\n\\nf',
          },
          {
            caseNoteId: '47041354',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T18:08:42.989484866',
            occurenceDateTime: '2024-04-02T18:08:42',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Drugs and alcohol Pre-release report\\n\\nou\\r\\n]hi',
          },
          {
            caseNoteId: '47041351',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T18:08:42.420725451',
            occurenceDateTime: '2024-04-02T18:08:42',
            createdBy: 'Boobier, James',
            text: 'Case note summary from Accommodation Pre-release report\\n\\nPutting back in progress (testing)',
          },
          {
            caseNoteId: '47041353',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T18:08:42.825820244',
            occurenceDateTime: '2024-04-02T18:08:42',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Children, families and communities Pre-release report\\n\\nsdf\\r\\njhkb',
          },
          {
            caseNoteId: '47041350',
            pathway: 'ACCOMMODATION',
            creationDateTime: '2024-04-02T18:07:16.82079488',
            occurenceDateTime: '2024-04-02T18:07:16',
            createdBy: 'Boobier, James',
            text: 'Resettlement status set to: Done. This is a test,',
          },
          {
            caseNoteId: '47041336',
            pathway: 'OTHER',
            creationDateTime: '2024-04-02T10:41:37.562169416',
            occurenceDateTime: '2024-04-02T10:41:37',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Accommodation Pre-release report\\n\\nsr',
          },
          {
            caseNoteId: '47041332',
            pathway: 'DRUGS_AND_ALCOHOL',
            creationDateTime: '2024-04-02T10:38:29.087589618',
            occurenceDateTime: '2024-04-02T10:38:29',
            createdBy: 'Arugonda, Usharani',
            text: 'Case note summary from Drugs and alcohol BCST2 report\\n\\nou\\r\\n]hi',
          },
        ],
        pageSize: 10,
        page: 0,
        sortName: 'occurenceDateTime,DESC',
        totalElements: 364,
        last: false,
      },
    },
  })

export const johnSmithRiskMappa = () =>
  stubFor({
    name: 'john-smith-risk-mappa',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/risk/mappa',
      method: 'GET',
    },
    response: {
      headers: responseHeaders,
      status: 200,
      jsonBody: {
        level: 1,
        levelDescription: 'MAPPA Level 1',
        category: 3,
        categoryDescription: 'MAPPA Cat 3',
        startDate: '2023-01-27',
        reviewDate: '2023-04-27',
      },
    },
  })

export const johnSmithRiskRosh = () =>
  stubFor({
    name: 'john-smith-risk-rosh',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/risk/rosh',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        riskInCommunity: { CHILDREN: 'HIGH', PUBLIC: 'HIGH', KNOWN_ADULT: 'HIGH', STAFF: 'MEDIUM', PRISONERS: 'LOW' },
        overallRiskLevel: 'HIGH',
        assessedOn: '2023-07-29T03:07:38',
      },
    },
  })

export const johnSmithRiskScores = () =>
  stubFor({
    name: 'john-smith-risk-scores',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/risk/scores',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        completedDate: '2023-07-29T03:07:38',
        assessmentStatus: 'Complete',
        groupReconvictionScore: { oneYear: 10, twoYears: 20, scoreLevel: 'LOW' },
        violencePredictorScore: {
          ovpStaticWeightedScore: 2,
          ovpDynamicWeightedScore: 3,
          ovpTotalWeightedScore: 4,
          oneYear: 12,
          twoYears: 13,
          ovpRisk: 'LOW',
        },
        generalPredictorScore: {
          ogpStaticWeightedScore: 40,
          ogpDynamicWeightedScore: 50,
          ogpTotalWeightedScore: 60,
          ogp1Year: 20,
          ogp2Year: 30,
          ogpRisk: 'HIGH',
        },
        riskOfSeriousRecidivismScore: { percentageScore: 4, staticOrDynamic: 'STATIC', scoreLevel: 'LOW' },
        sexualPredictorScore: {
          ospIndecentPercentageScore: 50,
          ospContactPercentageScore: 78,
          ospIndecentScoreLevel: 'MEDIUM',
          ospContactScoreLevel: 'MEDIUM',
        },
      },
    },
  })

export const johnSmithAppointments = () =>
  stubFor({
    name: 'john-smith-appointments',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/appointments',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        results: [
          {
            title: 'Appointment with CRS Staff (NS)',
            contact: 'CRSUATU Staff',
            date: '2024-09-14',
            time: '14:05:00',
            location: {
              buildingName: '',
              buildingNumber: '77',
              streetName: 'High Street',
              district: '',
              town: 'EDINBURGH',
              county: '',
              postcode: 'EH50 2GR',
              description: null,
            },
            contactEmail: 'CRSUATU.staff@test.com',
            duration: null,
            note: null,
          },
          {
            title: 'Appointment with Charity ABC',
            contact: 'Bob Example',
            date: '2024-09-18',
            time: '09:00:00',
            location: {
              buildingName: '',
              buildingNumber: '',
              streetName: '',
              district: '',
              town: '',
              county: 'Swansea',
              postcode: 'SA1 1JG',
              description: null,
            },
            contactEmail: 'charity@test.com',
            duration: 30,
            note: null,
          },
          {
            title: 'Appointment with Jobs centre plus',
            contact: 'CRSUATU Staff',
            date: '2024-09-18',
            time: '14:46:00',
            location: {
              buildingName: '',
              buildingNumber: 'Unit 7',
              streetName: 'Parc Tawe North',
              district: '',
              town: 'Swansea',
              county: 'Swansea',
              postcode: 'SA1 2AA',
              description: null,
            },
            contactEmail: 'CRSUATU.staff@test.com',
            duration: 60,
            note: null,
          },
        ],
      },
    },
  })

export const johnSmithLicenseConditions = () =>
  stubFor({
    name: 'john-smith-license-conditions',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/licence-condition',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        licenceId: 101,
        status: 'ACTIVE',
        standardLicenceConditions: [
          {
            id: 1001,
            image: false,
            text: 'Be of good behaviour and not behave in a way which undermines the purpose of the licence period.',
          },
          {
            id: 1002,
            image: false,
            text: 'Not commit any offence.',
          },
          {
            id: 1003,
            image: false,
            text: 'Keep in touch with the supervising officer in accordance with instructions given by the supervising officer.',
          },
        ],
        otherLicenseConditions: [
          {
            id: 1007,
            image: false,
            text: 'You must reside overnight within London probation region while of no fixed abode, unless otherwise approved by your supervising officer.',
          },
          {
            id: 1008,
            image: true,
            text: 'Not to enter the area of dsdsds, as defined by the attached map, without the prior approval of your supervising officer.',
          },
          {
            id: 1009,
            image: false,
            text: 'Report to staff at Sasasa at 01:01 am and 01:01 am Daily, unless otherwise authorised by your supervising officer. This condition will be reviewed by your supervising officer on a monthly basis and may be amended or removed if it is felt that the level of risk you present has reduced appropriately.',
          },
          {
            id: 1010,
            image: false,
            text: 'Attend a location, as required by your supervising officer, to give a sample of oral fluid / urine in order to test whether you have any specified Class A and specified Class B drugs in your body, for the purpose of ensuring that you are complying with the condition of your licence requiring you to be of good behaviour. Do not take any action that could hamper or frustrate the drug testing process.',
          },
          {
            id: 1011,
            image: false,
            text: 'Allow person(s) as designated by your supervising officer to install an electronic monitoring tag on you and access to install any associated equipment in your property, and for the purpose of ensuring that equipment is functioning correctly. You must not damage or tamper with these devices and ensure that the tag is charged, and report to your supervising officer and the EM provider immediately if the tag or the associated equipment are not working correctly. This will be for the purpose of monitoring your [INSERT TYPES OF CONDITIONS TO BE ELECTRONICALLY MONITORED HERE] licence condition(s) unless otherwise authorised by your supervising officer.',
          },
          {
            id: 1012,
            image: false,
            text: 'You will be subject to trail monitoring. Your whereabouts will be electronically monitored by GPS Satellite Tagging, ending on [INSERT END DATE], and you must cooperate with the monitoring as directed by your supervising officer unless otherwise authorised by your supervising officer.',
          },
          {
            id: 1013,
            image: false,
            text: 'You must let the police search you if they ask. You must also let them search a vehicle you are with, like a car or a motorbike.',
          },
        ],
      },
    },
  })
export const johnSmithDefaults = () => [
  johnSmithImage(),
  johnSmithStaffContacts(),
  johnSmithCaseNotes(),
  johnSmithRiskMappa(),
  johnSmithRiskRosh(),
  johnSmithRiskScores(),
  johnSmithAppointments(),
  johnSmithLicenseConditions(),
]
