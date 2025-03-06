import { SupportNeedsCache } from '../data/model/supportNeeds'

export const updateSupportNeedsWithRequestBody = (
  currentCacheStatus: SupportNeedsCache,
  body: Record<string, string>,
): SupportNeedsCache => {
  const selectedSupportNeedIds: string[] = []
  const selectedOthers: { supportNeedId: string; supportNeedText: string }[] = []
  const OTHER_SUPPORT_NEED_PREFIX = 'custom-other-'

  for (const key in body) {
    if (key.startsWith('support-need-option-')) {
      const value = body[key]

      if (Array.isArray(value)) {
        selectedSupportNeedIds.push(...value.map(String))
      } else {
        selectedSupportNeedIds.push(value)
      }
    } else if (key.startsWith(OTHER_SUPPORT_NEED_PREFIX)) {
      const otherText = body[key]
      if (otherText.length > 0) {
        // get "other" support need option's id from key
        const otherOptionId = key.replace(OTHER_SUPPORT_NEED_PREFIX, '')
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
        isOther: Boolean(selectedOther),
        otherSupportNeedText: selectedOther?.supportNeedText || null,
      }
    }),
  }
}
