import {
  GroupedSupportNeeds,
  SupportNeedCache,
  SupportNeedCheckbox,
  SupportNeedsCache,
} from '../data/model/supportNeeds'
import { ValidationError } from '../@types/express'
import { CUSTOM_OTHER_PREFIX, SUPPORT_NEED_OPTION_PREFIX } from '../routes/support-needs/supportNeedsContants'
import { convertStringToId } from './utils'

export function groupSupportNeedsByCategory(
  supportNeedsCache: SupportNeedsCache,
  errors: ValidationError[],
  formValuesOnError: Record<string, string | string[]>,
): GroupedSupportNeeds {
  const groupedSupportNeeds: GroupedSupportNeeds = []

  const selectedUUIDsOnError = formValuesOnError
    ? Object.entries(formValuesOnError)
        .filter(it => it[0].startsWith(SUPPORT_NEED_OPTION_PREFIX))
        .flatMap(it => it[1])
    : null

  const otherTextMappingOnError = formValuesOnError
    ? Object.entries(formValuesOnError)
        .filter(it => it[0].startsWith(CUSTOM_OTHER_PREFIX))
        .map(it => {
          return {
            uuid: it[0].replace(CUSTOM_OTHER_PREFIX, ''),
            otherText: it[1] as string,
          }
        })
    : null

  // Iterate over each support need and group them by category
  supportNeedsCache.needs.forEach(supportNeed => {
    let categoryGroup = groupedSupportNeeds.find(group => group.category === supportNeed.category)

    if (!categoryGroup) {
      const validationError = errors?.find(
        it => it.type === 'SUPPORT_NEEDS_MISSING_SELECTION_IN_CATEGORY' && it.id === supportNeed.category,
      )

      categoryGroup = {
        category: supportNeed.category,
        id: convertStringToId(supportNeed.category),
        supportNeeds: [],
        exclusiveOption: null,
        error: validationError?.text,
      }
      groupedSupportNeeds.push(categoryGroup)
    }

    // If this supportNeed is the exclusive option and none exists yet, set it
    if (!supportNeed.isUpdatable && !categoryGroup.exclusiveOption) {
      categoryGroup.exclusiveOption = convertFromSupportNeedCacheToSupportNeedCheckbox(
        supportNeed,
        errors,
        selectedUUIDsOnError,
        otherTextMappingOnError,
      )
    } else {
      categoryGroup.supportNeeds.push(
        convertFromSupportNeedCacheToSupportNeedCheckbox(
          supportNeed,
          errors,
          selectedUUIDsOnError,
          otherTextMappingOnError,
        ),
      )
    }
  })

  // Sort support needs within each category
  groupedSupportNeeds.forEach(group => {
    group.supportNeeds.sort((a, b) => {
      // Move "Other" to the end
      if (a.allowUserDesc) return 1
      if (b.allowUserDesc) return -1

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

function convertFromSupportNeedCacheToSupportNeedCheckbox(
  supportNeed: SupportNeedCache,
  errors: ValidationError[],
  selectedUUIDs: string[],
  otherMapping: { uuid: string; otherText: string }[],
): SupportNeedCheckbox {
  const otherFromUser = otherMapping?.find(it => it.uuid === supportNeed.uuid)?.otherText
  return {
    uuid: supportNeed.uuid,
    supportNeedId: supportNeed.supportNeedId,
    title: supportNeed.title,
    otherSupportNeedText: otherFromUser !== undefined ? otherFromUser : supportNeed.otherSupportNeedText,
    category: supportNeed.category,
    allowUserDesc: supportNeed.allowUserDesc,
    isSelected: selectedUUIDs === null ? supportNeed.isSelected : selectedUUIDs.includes(supportNeed.uuid),
    isPreSelected: supportNeed.isPreSelected,
    error: errors?.find(
      it =>
        (it.type === 'SUPPORT_NEEDS_MISSING_OTHER_TEXT' || it.type === 'SUPPORT_NEEDS_OTHER_TOO_LONG') &&
        it.id === `${CUSTOM_OTHER_PREFIX}${supportNeed.uuid}`,
    )?.text,
  }
}
