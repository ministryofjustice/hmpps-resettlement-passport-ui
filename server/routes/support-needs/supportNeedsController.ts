import { RequestHandler } from 'express'
import { ErrorMessage } from '../view'
import { validatePathwaySupportNeeds, getEnumByURL, getFeatureFlagBoolean } from '../../utils/utils'
import SupportNeedsView from './supportNeedsView'
import { SupportNeedCache } from '../../data/model/supportNeeds'
import { FEATURE_FLAGS, PATHWAY_DICTIONARY } from '../../utils/constants'
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

  startForm: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway } = req.params
      await validatePathwaySupportNeeds(pathway)
      const pathwayEnum = getEnumByURL(pathway)
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, false)
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
          const { allowUserDesc, category, existingPrisonerSupportNeedId, id, isOther, title, isUpdatable } = need
          return {
            uuid: crypto.randomUUID(),
            supportNeedId: id,
            existingPrisonerSupportNeedId,
            allowUserDesc,
            category,
            isOther,
            title,
            isUpdatable,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
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
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, false)
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
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromBody(req, res, false)
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
      await validatePathwaySupportNeeds(pathway)
      const pathwayEnum = getEnumByURL(pathway)
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, false)
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

      res.render('pages/support-needs-status', { pathway, prisonerData, supportNeed })
    } catch (err) {
      next(err)
    }
  }

  submitSupportNeedsStatus: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway, uuid } = req.params
      await validatePathwaySupportNeeds(pathway)
      const pathwayEnum = getEnumByURL(pathway)
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromBody(req, res, false)
      const { prisonerNumber } = prisonerData.personalDetails

      // TODO: UPDATE CACHE WITH VALUES FROM REQ.BODY
      // const { status, isPrisonResponsible, isProbationResponsible, updateText, otherSupportNeedText } = req.body

      const stateKey = {
        prisonerNumber,
        userId: req.user.username,
        pathway: pathwayEnum,
      }
      const currentCacheState = await this.supportNeedStateService.getSupportNeeds(stateKey)

      // get the next supportNeed which is `isUpdatable` and `isSelected`
      const currentIndex = currentCacheState.needs.findIndex(need => need.uuid === uuid)
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
    const { pathway } = req.params
    const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, false)
    const { prisonerNumber } = prisonerData.personalDetails

    res.render('pages/support-needs-check-answers', { pathway, prisonerNumber })
  }

  finaliseSupportNeeds: RequestHandler = async (req, res, next): Promise<void> => {
    const { pathway } = req.params
    const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, false)
    const { prisonerNumber } = prisonerData.personalDetails

    res.redirect(`/${pathway}/?prisonerNumber=${prisonerNumber}`)
  }
}
