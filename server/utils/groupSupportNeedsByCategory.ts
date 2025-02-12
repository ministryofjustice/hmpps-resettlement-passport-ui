import { GroupedSupportNeeds, SupportNeedsCache } from '../data/model/supportNeeds'

export function groupSupportNeedsByCategory(data: SupportNeedsCache): GroupedSupportNeeds {
  const groupedSupportNeeds: GroupedSupportNeeds = []

  // Iterate over each support need and group them by category
  data.needs.forEach(supportNeed => {
    let categoryGroup = groupedSupportNeeds.find(group => group.category === supportNeed.category)

    if (!categoryGroup) {
      categoryGroup = { category: supportNeed.category, supportNeeds: [], exclusiveOption: null }
      groupedSupportNeeds.push(categoryGroup)
    }

    // If this supportNeed is the exclusive option and none exists yet, set it
    if (!supportNeed.isUpdatable && !categoryGroup.exclusiveOption) {
      categoryGroup.exclusiveOption = supportNeed
    } else {
      categoryGroup.supportNeeds.push(supportNeed)
    }
  })

  // Sort support needs within each category
  groupedSupportNeeds.forEach(group => {
    group.supportNeeds.sort((a, b) => {
      // Move "Other" to the end
      if (a.allowUserDesc) return 1
      if (b.allowUserDesc) return -1

      // Sort `isOther` supportNeeds by `existingPrisonerSupportNeedId`
      if (a.isOther && !b.isOther) return 1
      if (!a.isOther && b.isOther) return -1
      if (a.isOther && b.isOther) return a.existingPrisonerSupportNeedId - b.existingPrisonerSupportNeedId

      // Otherwise, sort by ID
      return a.supportNeedId - b.supportNeedId
    })
  })

  // Sort categories by the lowest `supportNeed.supportNeedId` in each category
  groupedSupportNeeds.sort((a, b) => {
    const firstA = Math.min(...a.supportNeeds.map(s => s.supportNeedId))
    const firstB = Math.min(...b.supportNeeds.map(s => s.supportNeedId))
    return firstA - firstB
  })

  return groupedSupportNeeds
}
