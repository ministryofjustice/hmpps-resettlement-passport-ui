import { SupportNeedsCache } from '../data/model/supportNeeds'

export const updateSupportNeedsWithRequestBody = (
  currentCacheStatus: SupportNeedsCache,
  body: Record<string, string>,
): SupportNeedsCache => {
  const selectedSupportNeedIds: string[] = []

  for (const key in body) {
    if (key.startsWith('support-need-option-')) {
      const value = body[key]

      if (Array.isArray(value)) {
        selectedSupportNeedIds.push(...value.map(String))
      } else {
        selectedSupportNeedIds.push(value)
      }
    }
  }

  return {
    needs: currentCacheStatus.needs.map(need => {
      return {
        ...need,
        isSelected: selectedSupportNeedIds.includes(need.uuid),
      }
    }),
  }
}
