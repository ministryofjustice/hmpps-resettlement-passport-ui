import { SupportNeedsCache } from '../data/model/supportNeeds'
import { CUSTOM_OTHER_PREFIX, SUPPORT_NEED_OPTION_PREFIX } from '../routes/support-needs/supportNeedsContants'

export const updateSupportNeedsWithRequestBody = (
  currentCacheStatus: SupportNeedsCache,
  body: Record<string, string>,
): SupportNeedsCache => {
  const selectedSupportNeedIds: string[] = []
  const selectedOthers: { supportNeedId: string; supportNeedText: string }[] = []

  for (const key in body) {
    if (key.startsWith(SUPPORT_NEED_OPTION_PREFIX)) {
      const value = body[key]

      if (Array.isArray(value)) {
        selectedSupportNeedIds.push(...value.map(String))
      } else {
        selectedSupportNeedIds.push(value)
      }
    } else if (key.startsWith(CUSTOM_OTHER_PREFIX)) {
      const otherText = body[key]
      if (otherText.length > 0) {
        // get "other" support need option's id from key
        const otherOptionId = key.replace(CUSTOM_OTHER_PREFIX, '')
        const cachedOtherOption = currentCacheStatus.needs.find(need => need.uuid === otherOptionId)

        if (cachedOtherOption) {
          selectedOthers.push({
            supportNeedId: otherOptionId,
            supportNeedText: otherText,
          })
        }
      }
    }
  }

  return {
    needs: currentCacheStatus.needs.map(need => {
      const selectedOther = selectedOthers.find(other => other.supportNeedId === need.uuid)
      return {
        ...need,
        isSelected: selectedSupportNeedIds.includes(need.uuid),
        otherSupportNeedText: selectedOther?.supportNeedText || null,
      }
    }),
  }
}
