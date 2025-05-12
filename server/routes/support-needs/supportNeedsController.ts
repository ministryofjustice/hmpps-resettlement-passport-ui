import { RequestHandler } from 'express'
import createError from 'http-errors'
import { ValidationError, validationResult } from 'express-validator'
import {
  getEnumByURL,
  findPreviousSelectedSupportNeed,
  convertStringToId,
  validatePathwaySupportNeeds,
} from '../../utils/utils'
import { PrisonerSupportNeedsPost, SupportNeedCache, SupportNeedsCategoryGroup } from '../../data/model/supportNeeds'
import { SupportNeedStateService } from '../../data/supportNeedStateService'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import RpService from '../../services/rpService'
import { groupSupportNeedsByCategory } from '../../utils/groupSupportNeedsByCategory'
import { updateSupportNeedsWithRequestBody } from '../../utils/updateSupportNeedsWithRequestBody'
import SupportNeedForm from './supportNeedsForm'
import { CustomValidationError } from '../../@types/express'
import { CUSTOM_OTHER_PREFIX, SUPPORT_NEED_OPTION_PREFIX } from './supportNeedsContants'
import { handleSupportNeedsNotFoundRedirect } from './supportNeedsControllerErrorHandler'

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
      const { prisonerData } = req
      const { prisonerNumber } = prisonerData.personalDetails
      const pathwayEnum = getEnumByURL(pathway)
      const edit = req.query.edit === 'true'

      const errors = req.flash('errors') as unknown as CustomValidationError[]
      const formValuesOnError = req.flash('formValues')?.[0] as unknown as Record<string, string | string[]>

      const stateKey = {
        prisonerNumber,
        userId: req.user.username,
        pathway: pathwayEnum,
      }

      const currentCacheState = await this.supportNeedStateService.getSupportNeeds(stateKey)

      const supportNeeds = groupSupportNeedsByCategory(currentCacheState, errors, formValuesOnError)

      const pathwaySupportNeeds = await this.rpService.getPathwaySupportNeedsSummary(prisonerNumber, pathwayEnum)

      const backLink = edit
        ? `/support-needs/${pathway}/check-answers/?prisonerNumber=${prisonerNumber}`
        : `/${pathway}/?prisonerNumber=${prisonerNumber}#support-needs`

      res.render('pages/support-needs', {
        pathway,
        supportNeeds,
        prisonerData,
        pathwaySupportNeeds,
        backLink,
        SUPPORT_NEED_OPTION_PREFIX,
        CUSTOM_OTHER_PREFIX,
        errors,
      })
    } catch (err) {
      handleSupportNeedsNotFoundRedirect(err, req, res, next)
    }
  }

  submitSupportNeeds: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway } = req.params
      const pathwayEnum = getEnumByURL(pathway)
      const { prisonerData } = req
      const { prisonerNumber } = prisonerData.personalDetails

      if (req.validationErrors?.length > 0) {
        req.flash('errors', req.validationErrors)
        req.flash('formValues', req.body)
        return res.redirect(`/support-needs/${pathway}?prisonerNumber=${prisonerNumber}`)
      }

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
      return handleSupportNeedsNotFoundRedirect(err, req, res, next)
    }
  }

  getSupportNeedsStatus: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway, uuid } = req.params
      const edit = req.query.edit === 'true'
      const pathwayEnum = getEnumByURL(pathway)
      const { prisonerData } = req
      const { prisonerNumber } = prisonerData.personalDetails

      const stateKey = {
        prisonerNumber,
        userId: req.user.username,
        pathway: pathwayEnum,
      }

      const currentCacheState = await this.supportNeedStateService.getSupportNeeds(stateKey)

      // Validate supportNeed exists in cache and is selected
      const supportNeed = currentCacheState.needs.find(need => need.uuid === uuid)
      if (!supportNeed) {
        return next(createError(404, `Need with UUID ${uuid} not found in cache`))
      }
      if (!supportNeed.isSelected) {
        res.status(404)
        return res.render('pages/support-needs-error', { pathway, prisonerData })
      }

      const previousSupportNeed = findPreviousSelectedSupportNeed(currentCacheState, uuid)

      const getBackLink = () => {
        if (edit) {
          return `/support-needs/${pathway}/check-answers/?prisonerNumber=${prisonerNumber}`
        }
        if (previousSupportNeed) {
          return `/support-needs/${pathway}/status/${previousSupportNeed.uuid}/?prisonerNumber=${prisonerNumber}`
        }
        return `/support-needs/${pathway}/?prisonerNumber=${prisonerNumber}`
      }

      const backLink = getBackLink()

      const errors = req.flash('errors') as unknown as ValidationError[]
      const formValues = req.flash('formValues')?.[0] || {}
      const form = new SupportNeedForm(supportNeed, formValues, errors)

      return res.render('pages/support-needs-status', {
        pathway,
        prisonerData,
        supportNeed,
        edit,
        backLink,
        ...form.renderArgs,
      })
    } catch (err) {
      return handleSupportNeedsNotFoundRedirect(err, req, res, next)
    }
  }

  submitSupportNeedsStatus: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway, uuid } = req.params
      const pathwayEnum = getEnumByURL(pathway)
      const { prisonerData } = req
      const { prisonerNumber } = prisonerData.personalDetails

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        req.flash('errors', errors.array())
        req.flash('formValues', req.body)
        return res.redirect(`/support-needs/${pathway}/status/${uuid}/?prisonerNumber=${prisonerNumber}`)
      }

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
      const { status, updateText, responsibleStaff = [], edit } = req.body

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
      if (!nextUpdatableSupportNeed || edit === 'true') {
        return res.redirect(`/support-needs/${pathway}/check-answers/?prisonerNumber=${prisonerNumber}`)
      }

      const nextUpdatableSupportNeedPageId = nextUpdatableSupportNeed.uuid

      // Go to the next supportNeed which is `isUpdatable`
      return res.redirect(
        `/support-needs/${pathway}/status/${nextUpdatableSupportNeedPageId}/?prisonerNumber=${prisonerNumber}`,
      )
    } catch (err) {
      return handleSupportNeedsNotFoundRedirect(err, req, res, next)
    }
  }

  getCheckAnswers: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway } = req.params
      const pathwayEnum = getEnumByURL(pathway)
      const { prisonerData } = req
      const { prisonerNumber } = prisonerData.personalDetails

      const stateKey = {
        prisonerNumber,
        userId: req.user.username,
        pathway: pathwayEnum,
      }

      const currentCacheState = await this.supportNeedStateService.getSupportNeeds(stateKey)

      const supportNeedsCategories: SupportNeedsCategoryGroup[] = []

      currentCacheState.needs.forEach(need => {
        if (!need.isSelected) return

        let categoryGroup = supportNeedsCategories.find(group => group.categoryName === need.category)

        if (!categoryGroup) {
          categoryGroup = { categoryName: need.category, supportNeeds: [] }
          supportNeedsCategories.push(categoryGroup)
        }

        // Check if there's any non-updatable support need in the category
        if (need.isUpdatable === false) {
          categoryGroup.supportNeeds = null
          categoryGroup.noNeeds = true
        } else if (categoryGroup.supportNeeds !== null) {
          // Only add the need if supportNeeds array is not null (i.e., no non-updatable needs found)
          categoryGroup.supportNeeds.push(need)
        }
      })

      const lastSelectedSupportNeedId = currentCacheState.needs.findLast(
        need => need.isSelected && need.isUpdatable,
      )?.uuid
      const backLink = `/support-needs/${pathway}/status/${lastSelectedSupportNeedId}/?prisonerNumber=${prisonerNumber}`

      return res.render('pages/support-needs-check-answers', {
        pathway,
        prisonerNumber,
        supportNeedsCategories,
        backLink,
      })
    } catch (err) {
      return handleSupportNeedsNotFoundRedirect(err, req, res, next)
    }
  }

  finaliseSupportNeeds: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway } = req.params
      const { prisonerData } = req
      const { prisonerNumber } = prisonerData.personalDetails
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
      await this.supportNeedStateService.deleteSupportNeeds(stateKey)

      res.redirect(`/${pathway}/?prisonerNumber=${prisonerNumber}#support-needs`)
    } catch (err) {
      handleSupportNeedsNotFoundRedirect(err, req, res, next)
    }
  }

  deleteSupportNeed: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway, uuid } = req.params
      const edit = req.body.edit === 'true'
      const { prisonerData } = req
      const { prisonerNumber } = prisonerData.personalDetails
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
      return handleSupportNeedsNotFoundRedirect(err, req, res, next)
    }
  }

  setPrisonerData: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      req.prisonerData = req.body.prisonerNumber
        ? await this.prisonerDetailsService.loadPrisonerDetailsFromBody(req, res, false)
        : await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, false)

      if (req.prisonerData.supportNeedsLegacyProfile) {
        return next(Error('Unable to access support needs for a legacy profile'))
      }
      return next()
    } catch (err) {
      return next(err)
    }
  }

  validatePathwayAndFeatureFlag: RequestHandler = async (req, _res, next): Promise<void> => {
    try {
      const { pathway } = req.params
      await validatePathwaySupportNeeds(pathway)

      return next()
    } catch (err) {
      return next(err)
    }
  }

  validateSupportNeeds: RequestHandler = async (req, _res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { pathway } = req.params
      const pathwayEnum = getEnumByURL(pathway)

      const { prisonerNumber } = prisonerData.personalDetails

      const stateKey = {
        prisonerNumber,
        userId: req.user.username,
        pathway: pathwayEnum,
      }
      const currentCacheState = await this.supportNeedStateService.getSupportNeeds(stateKey)

      const supportNeedsCategories: SupportNeedsCategoryGroup[] = []

      currentCacheState.needs.forEach(need => {
        let categoryGroup = supportNeedsCategories.find(group => group.categoryName === need.category)
        if (!categoryGroup) {
          categoryGroup = { categoryName: need.category, supportNeeds: [] }
          supportNeedsCategories.push(categoryGroup)
        }
        categoryGroup.supportNeeds.push(need)
      })

      const categoriesToValidate = supportNeedsCategories.filter(category =>
        category.supportNeeds.find(sn => !sn.isUpdatable),
      )

      const reqBody = req.body as Record<string, string | string[]>
      const selectedCategories = Object.keys(reqBody)
        .filter(it => it.startsWith(SUPPORT_NEED_OPTION_PREFIX))
        .map(it => it.replace(SUPPORT_NEED_OPTION_PREFIX, ''))

      const validationErrors: CustomValidationError[] = []

      // User must make a selection
      if (categoriesToValidate.length === 0 && selectedCategories.length === 0) {
        validationErrors.push({
          type: 'SUPPORT_NEEDS_NO_SELECTION',
          id: null,
          text: 'Select one or more support needs',
          href: '#support-needs-form',
        })
      } else {
        // For each section, if the "No support needs identified" option is available we need to check that something is selected
        categoriesToValidate.forEach(category => {
          if (!selectedCategories.includes(category.categoryName)) {
            validationErrors.push({
              type: 'SUPPORT_NEEDS_MISSING_SELECTION_IN_CATEGORY',
              id: category.categoryName,
              text: `Select support needs, or select '${category.supportNeeds.find(it => !it.isUpdatable).title}'`,
              href: `#${convertStringToId(category.categoryName)}`,
            })
          }
        })

        // If any OTHER checkbox has been checked, the other field must be provided and not exceed the character count
        const selectedNeeds = Object.entries(reqBody)
          .filter(it => it[0].startsWith(SUPPORT_NEED_OPTION_PREFIX))
          .flatMap(it => it[1])

        const requiredOtherFields = Object.keys(reqBody)
          .filter(it => it.startsWith(CUSTOM_OTHER_PREFIX))
          .filter(it => selectedNeeds.includes(it.replace(CUSTOM_OTHER_PREFIX, '')))

        requiredOtherFields.forEach(it => {
          if (!reqBody[it]) {
            validationErrors.push({
              type: 'SUPPORT_NEEDS_MISSING_OTHER_TEXT',
              id: it,
              text: 'Enter other support need',
              href: `#other-${it.replace(CUSTOM_OTHER_PREFIX, '')}`,
            })
          } else if (reqBody[it].length > 100) {
            validationErrors.push({
              type: 'SUPPORT_NEEDS_OTHER_TOO_LONG',
              id: it,
              text: 'Other support need must be 100 characters or less',
              href: `#other-${it.replace(CUSTOM_OTHER_PREFIX, '')}`,
            })
          }
        })
      }

      req.validationErrors = validationErrors
      return next()
    } catch (err) {
      return handleSupportNeedsNotFoundRedirect(err, req, _res, next)
    }
  }
}
