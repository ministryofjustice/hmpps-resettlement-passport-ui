import { RequestHandler } from 'express'
import { validatePathwaySupportNeeds, getEnumByURL } from '../../utils/utils'
import { PrisonerSupportNeedsPost, SupportNeedCache } from '../../data/model/supportNeeds'
import { SupportNeedStateService } from '../../data/supportNeedStateService'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import RpService from '../../services/rpService'
import { groupSupportNeedsByCategory } from '../../utils/groupSupportNeedsByCategory'
import { updateSupportNeedsWithRequestBody } from '../../utils/updateSupportNeedsWithRequestBody'

export default class SupportNeedsController {
  constructor(
    private readonly rpService: RpService,
    private readonly supportNeedStateService: SupportNeedStateService,
    private readonly prisonerDetailsService: PrisonerDetailsService,
  ) {
    // no op
  }

  checkLegacyProfile: RequestHandler = async (req, res, next): Promise<void> => {
    req.prisonerData = req.body.prisonerNumber
      ? await this.prisonerDetailsService.loadPrisonerDetailsFromBody(req, res, false)
      : await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, false)

    if (req.prisonerData.supportNeedsLegacyProfile) {
      next(new Error('Unable to access support needs for a legacy profile'))
    } else {
      next()
    }
  }

  startForm: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway } = req.params
      await validatePathwaySupportNeeds(pathway)
      const pathwayEnum = getEnumByURL(pathway)
      const { prisonerData } = req
      const { prisonerNumber } = prisonerData.personalDetails
      const stateKey = {
        prisonerNumber,
        userId: req.user.username,
        pathway: pathwayEnum,
      }

      await this.supportNeedStateService.deleteSupportNeeds(stateKey)

      // INITIATE CACHE WITH SUPPORT NEEDS
      const supportNeedsResponse = await this.rpService.getPathwaySupportNeeds(prisonerNumber, pathwayEnum)

      const initSupportNeedsCacheData: SupportNeedCache[] = supportNeedsResponse.supportNeeds.map(
        (need): SupportNeedCache => {
          const { allowUserDesc, category, existingPrisonerSupportNeedId, id, title, isPreSelected, isUpdatable } = need
          return {
            uuid: crypto.randomUUID(),
            supportNeedId: id,
            existingPrisonerSupportNeedId,
            allowUserDesc,
            category,
            isOther: false,
            title,
            isUpdatable,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected,
          }
        },
      )

      const supportNeedsCache = { needs: initSupportNeedsCacheData }

      await this.supportNeedStateService.setSupportNeeds(stateKey, supportNeedsCache)

      res.redirect(`/support-needs/${pathway}/?prisonerNumber=${prisonerNumber}`)
    } catch (err) {
      next(err)
    }
  }

  getSupportNeeds: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway } = req.params
      await validatePathwaySupportNeeds(pathway)
      const { prisonerData } = req
      const { prisonerNumber } = prisonerData.personalDetails
      const pathwayEnum = getEnumByURL(pathway)

      const stateKey = {
        prisonerNumber,
        userId: req.user.username,
        pathway: pathwayEnum,
      }

      const currentCacheState = await this.supportNeedStateService.getSupportNeeds(stateKey)

      const supportNeeds = groupSupportNeedsByCategory(currentCacheState)

      res.render('pages/support-needs', { pathway, supportNeeds, prisonerData })
    } catch (err) {
      next(err)
    }
  }

  submitSupportNeeds: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway } = req.params
      await validatePathwaySupportNeeds(pathway)
      const pathwayEnum = getEnumByURL(pathway)
      const { prisonerData } = req
      const { prisonerNumber } = prisonerData.personalDetails

      const stateKey = {
        prisonerNumber,
        userId: req.user.username,
        pathway: pathwayEnum,
      }

      const currentCacheStatus = await this.supportNeedStateService.getSupportNeeds(stateKey)
      const updatedCachedSupportNeeds = updateSupportNeedsWithRequestBody(currentCacheStatus, req.body)

      await this.supportNeedStateService.setSupportNeeds(stateKey, updatedCachedSupportNeeds)

      // Get first supportNeed which is `isUpdatable` and `isSelected`
      const firstUpdatablePage = updatedCachedSupportNeeds.needs.find(need => need.isUpdatable && need.isSelected)

      // If no supportNeeds identified go to check answers page
      if (!firstUpdatablePage) {
        return res.redirect(`/support-needs/${pathway}/check-answers/?prisonerNumber=${prisonerNumber}`)
      }

      const firstUpdatablePageId = firstUpdatablePage.uuid

      return res.redirect(`/support-needs/${pathway}/status/${firstUpdatablePageId}/?prisonerNumber=${prisonerNumber}`)
    } catch (err) {
      return next(err)
    }
  }

  getSupportNeedsStatus: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway, uuid } = req.params
      const edit = req.query.edit === 'true'
      await validatePathwaySupportNeeds(pathway)
      const pathwayEnum = getEnumByURL(pathway)
      const { prisonerData } = req
      const { prisonerNumber } = prisonerData.personalDetails

      const stateKey = {
        prisonerNumber,
        userId: req.user.username,
        pathway: pathwayEnum,
      }

      const currentCacheState = await this.supportNeedStateService.getSupportNeeds(stateKey)

      // Validate supportNeed exists in cache
      const supportNeed = currentCacheState.needs.find(need => need.uuid === uuid)
      if (!supportNeed) {
        throw new Error('Support need not found')
      }

      res.render('pages/support-needs-status', { pathway, prisonerData, supportNeed, edit })
    } catch (err) {
      next(err)
    }
  }

  submitSupportNeedsStatus: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway, uuid } = req.params
      await validatePathwaySupportNeeds(pathway)
      const pathwayEnum = getEnumByURL(pathway)
      const { prisonerData } = req
      const { prisonerNumber } = prisonerData.personalDetails

      const stateKey = {
        prisonerNumber,
        userId: req.user.username,
        pathway: pathwayEnum,
      }
      const currentCacheState = await this.supportNeedStateService.getSupportNeeds(stateKey)
      const currentIndex = currentCacheState.needs.findIndex(need => need.uuid === uuid)

      // Validate supportNeed exists in cache
      if (currentIndex === -1) {
        throw new Error('Support need not found')
      }

      // UPDATE CACHE WITH VALUES FROM REQ.BODY
      const { status, updateText, responsibleStaff = [] } = req.body

      const isPrisonResponsible = responsibleStaff.includes('PRISON')
      const isProbationResponsible = responsibleStaff.includes('PROBATION')

      currentCacheState.needs[currentIndex] = {
        ...currentCacheState.needs[currentIndex],
        status,
        isPrisonResponsible,
        isProbationResponsible,
        updateText,
      }

      // Save updated state back to cache
      await this.supportNeedStateService.setSupportNeeds(stateKey, currentCacheState)

      // get the next supportNeed which is `isUpdatable` and `isSelected`
      const nextUpdatableSupportNeed =
        currentCacheState.needs.slice(currentIndex + 1).find(need => need.isUpdatable && need.isSelected) || null

      // If no more updatable supportNeeds, go to check answers page
      if (!nextUpdatableSupportNeed) {
        return res.redirect(`/support-needs/${pathway}/check-answers/?prisonerNumber=${prisonerNumber}`)
      }

      const nextUpdatableSupportNeedPageId = nextUpdatableSupportNeed.uuid

      // Go to the next supportNeed which is `isUpdatable`
      return res.redirect(
        `/support-needs/${pathway}/status/${nextUpdatableSupportNeedPageId}/?prisonerNumber=${prisonerNumber}`,
      )
    } catch (err) {
      return next(err)
    }
  }

  getCheckAnswers: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway } = req.params
      await validatePathwaySupportNeeds(pathway)
      const pathwayEnum = getEnumByURL(pathway)
      const { prisonerData } = req
      const { prisonerNumber } = prisonerData.personalDetails

      const stateKey = {
        prisonerNumber,
        userId: req.user.username,
        pathway: pathwayEnum,
      }

      const currentCacheState = await this.supportNeedStateService.getSupportNeeds(stateKey)
      const supportNeeds = currentCacheState.needs.filter(
        supportNeed => supportNeed.isSelected && supportNeed.isUpdatable,
      )

      res.render('pages/support-needs-check-answers', { pathway, prisonerNumber, supportNeeds })
    } catch (err) {
      next(err)
    }
  }

  finaliseSupportNeeds: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway } = req.params
      const { prisonerData } = req
      const { prisonerNumber } = prisonerData.personalDetails
      await validatePathwaySupportNeeds(pathway)
      const pathwayEnum = getEnumByURL(pathway)

      const stateKey = {
        prisonerNumber,
        userId: req.user.username,
        pathway: pathwayEnum,
      }

      const currentCacheState = await this.supportNeedStateService.getSupportNeeds(stateKey)

      const supportNeedsToSubmit: PrisonerSupportNeedsPost = {
        needs: currentCacheState.needs
          .filter(need => need.isSelected)
          .map(
            ({
              supportNeedId,
              updateText,
              status,
              isPrisonResponsible,
              isProbationResponsible,
              existingPrisonerSupportNeedId,
              otherSupportNeedText,
            }: SupportNeedCache) => ({
              needId: supportNeedId,
              prisonerSupportNeedId: existingPrisonerSupportNeedId,
              otherDesc: otherSupportNeedText,
              text: updateText,
              status,
              isPrisonResponsible,
              isProbationResponsible,
            }),
          ),
      }

      await this.rpService.postSupportNeeds(prisonerNumber, supportNeedsToSubmit)

      res.redirect(`/${pathway}/?prisonerNumber=${prisonerNumber}#support-needs`)
    } catch (err) {
      next(err)
    }
  }

  deleteSupportNeed: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway, uuid } = req.params
      const edit = req.body.edit === 'true'
      const { prisonerData } = req
      const { prisonerNumber } = prisonerData.personalDetails
      await validatePathwaySupportNeeds(pathway)
      const pathwayEnum = getEnumByURL(pathway)

      const stateKey = {
        prisonerNumber,
        userId: req.user.username,
        pathway: pathwayEnum,
      }

      const needsInCache = await this.supportNeedStateService.getSupportNeeds(stateKey)

      // Get the support need from the cache and set isSelected=false and user input fields to null
      const needToDelete = needsInCache.needs.find(it => {
        return it.uuid === uuid
      })
      const currentIndex = needsInCache.needs.indexOf(needToDelete)

      needToDelete.isSelected = false
      needToDelete.status = null
      needToDelete.isPrisonResponsible = null
      needToDelete.isProbationResponsible = null
      needToDelete.updateText = null
      needToDelete.otherSupportNeedText = null

      // Ensure that if we've deleted the last support need in a section, we add in the "No support needs identified" option (if available)
      const supportNeedsInSection = needsInCache.needs.filter(
        need => need.category === needToDelete.category && need.isSelected,
      )
      if (supportNeedsInSection.length === 0) {
        const noSupportNeedsIdentified = needsInCache.needs.find(
          need => need.category === needToDelete.category && !need.isUpdatable,
        )
        if (noSupportNeedsIdentified) {
          noSupportNeedsIdentified.isSelected = true
        }
      }

      // Save the support needs back to the cache
      await this.supportNeedStateService.setSupportNeeds(stateKey, needsInCache)

      // Depending on the contents of the cache we'll need to redirect the user to the right place
      const nextUpdatableSupportNeed =
        needsInCache.needs.slice(currentIndex + 1).find(need => need.isUpdatable && need.isSelected) || null
      if (nextUpdatableSupportNeed != null && !edit) {
        // If there is a "next" support need and it's not an edit, redirect user to this otherwise go to check your answers
        return res.redirect(
          `/support-needs/${pathway}/status/${nextUpdatableSupportNeed.uuid}/?prisonerNumber=${prisonerNumber}`,
        )
      }
      return res.redirect(`/support-needs/${pathway}/check-answers?prisonerNumber=${prisonerNumber}`)
    } catch (err) {
      return next(err)
    }
  }
}
