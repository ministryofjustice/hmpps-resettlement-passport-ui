interface PrisonerOverviewData {
  status: string
  value: Array<
    | {
        licenceId: number
        status: string
        startDate: string
        expiryDate: string
        standardLicenceConditions: Array<{
          id: number
          image: boolean
          text: string
          sequence: number
        }>
        otherLicenseConditions: Array<{
          id: number
          image: boolean
          text: string
          sequence: number
        }>
      }
    | {
        completedDate: string
        assessmentStatus: string
        groupReconvictionScore: {
          oneYear: number
          twoYears: number
          scoreLevel: string
        }
        violencePredictorScore: {
          ovpStaticWeightedScore: number
          ovpDynamicWeightedScore: number
          ovpTotalWeightedScore: number
          oneYear: number
          twoYears: number
          ovpRisk: string
        }
        generalPredictorScore: {
          ogpStaticWeightedScore: number
          ogpDynamicWeightedScore: number
          ogpTotalWeightedScore: number
          ogp1Year: number
          ogp2Year: number
          ogpRisk: string
        }
        riskOfSeriousRecidivismScore: {
          percentageScore: number
          staticOrDynamic: string
          scoreLevel: string
        }
        sexualPredictorScore: {
          ospIndecentPercentageScore: number
          ospContactPercentageScore: number
          ospIndecentScoreLevel: string
          ospContactScoreLevel: string
        }
      }
    | {
        riskInCommunity: {
          CHILDREN: string
          PUBLIC: string
          KNOWN_ADULT: string
          STAFF: string
          PRISONERS: string
        }
        overallRiskLevel: string
        assessedOn: string
      }
    | {
        level: number
        levelDescription: string
        category: number
        categoryDescription: string
        startDate: string
        reviewDate: string
      }
    | {
        content: Array<{
          caseNoteId: string
          pathway: string
          creationDateTime: string
          occurenceDateTime: string
          createdBy: string
          text: string
        }>
      }
  >
}
