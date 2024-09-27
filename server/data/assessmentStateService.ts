import AssessmentStore, { StateKey } from './assessmentStore'
import { createRedisClient } from './redisClient'
import {
  ApiAssessmentPage,
  ApiQuestionsAndAnswer,
  BackupCachedAssessment,
  CachedAssessment,
  CachedQuestionAndAnswer,
  PageWithQuestions,
  WorkingCachedAssessment,
} from './model/immediateNeedsReport'
import { toCachedQuestionAndAnswer } from '../utils/formatAssessmentResponse'
import {
  convertQuestionsAndAnswersToCacheFormat,
  findOtherNestedQuestions,
  getPagesFromCheckYourAnswers,
} from '../utils/utils'

export function createAssessmentStateService() {
  return new AssessmentStateService(new AssessmentStore(createRedisClient()))
}

export class AssessmentStateService {
  constructor(private readonly store: AssessmentStore) {
    // no-op
  }

  async getWorkingAssessment(key: StateKey): Promise<WorkingCachedAssessment> {
    return this.store.getWorkingAssessment(key)
  }

  async answer(key: StateKey, assessmentToSave: CachedAssessment, apiAssessmentPage: ApiAssessmentPage) {
    // get previous Q&A's
    const existingAssessmentFromCache = await this.getWorkingAssessment(key)
    assessmentToSave.questionsAndAnswers.forEach((newQandA: CachedQuestionAndAnswer) => {
      const index = existingAssessmentFromCache.assessment.questionsAndAnswers
        ? existingAssessmentFromCache.assessment.questionsAndAnswers.findIndex(
            (existingQandA: CachedQuestionAndAnswer) => {
              return existingQandA.question === newQandA.question
            },
          )
        : -1

      if (index !== -1) {
        // Replace the existing question with the new one
        existingAssessmentFromCache.assessment.questionsAndAnswers[index] = newQandA
      } else {
        // Delete any other nested question under the same parent question
        const otherNestedQuestionsToDelete = findOtherNestedQuestions(
          newQandA,
          existingAssessmentFromCache,
          apiAssessmentPage,
        )
        otherNestedQuestionsToDelete.forEach(qa => {
          existingAssessmentFromCache.assessment.questionsAndAnswers.splice(
            existingAssessmentFromCache.assessment.questionsAndAnswers.indexOf(qa),
            1,
          )
        })
        // Add the new question
        existingAssessmentFromCache.assessment.questionsAndAnswers.push(newQandA)
      }
    })

    await this.store.setWorkingAssessment(key, existingAssessmentFromCache)
  }

  async checkForConvergence(key: StateKey, pageWithQuestions: PageWithQuestions): Promise<boolean> {
    const workingAssessment = await this.store.getWorkingAssessment(key)
    const backupAssessment = await this.store.getBackupAssessment(key)

    // Check if we're in an edit - we're in an edit if a backupAssessment exists
    const edit = backupAssessment !== null

    if (!edit || backupAssessment.startEditPageId === pageWithQuestions.pageId) {
      return false
    }

    const answeredPages = [...new Set(workingAssessment.assessment.questionsAndAnswers.map(it => it.pageId))]
    if (answeredPages.includes(pageWithQuestions.pageId)) {
      const extraAnsweredPages = backupAssessment.pageLoadHistory.slice(
        backupAssessment.pageLoadHistory.indexOf(
          backupAssessment.pageLoadHistory.find(it => it.pageId === pageWithQuestions.pageId),
        ),
        backupAssessment.pageLoadHistory.length,
      )
      workingAssessment.pageLoadHistory.push(...extraAnsweredPages)
      await this.store.setWorkingAssessment(key, workingAssessment)
      return true
    }
    return false
  }

  async onComplete(key: StateKey) {
    await this.store.deleteWorkingAssessment(key)
    await this.store.deleteBackupAssessment(key)
  }

  async initialiseCache(
    stateKey: StateKey,
    configVersion: number,
    checkYourAnswersQuestionsAndAnswers: ApiQuestionsAndAnswer[],
  ) {
    const existingWorkingAssessment = await this.getWorkingAssessment(stateKey)

    if (!existingWorkingAssessment) {
      const initialAssessment = {
        assessment: {
          questionsAndAnswers: convertQuestionsAndAnswersToCacheFormat(checkYourAnswersQuestionsAndAnswers),
          version: configVersion,
        },
        pageLoadHistory: getPagesFromCheckYourAnswers(checkYourAnswersQuestionsAndAnswers),
      } as WorkingCachedAssessment
      await this.store.setWorkingAssessment(stateKey, initialAssessment)
      return initialAssessment
    }
    if (checkYourAnswersQuestionsAndAnswers.length > 0) {
      existingWorkingAssessment.pageLoadHistory = getPagesFromCheckYourAnswers(checkYourAnswersQuestionsAndAnswers)
      await this.store.setWorkingAssessment(stateKey, existingWorkingAssessment)
    }
    return existingWorkingAssessment
  }

  async startEdit(key: StateKey, pageToEdit: string) {
    const workingCachedAssessment = await this.getWorkingAssessment(key)

    await this.store.setBackupAssessment(key, {
      assessment: workingCachedAssessment.assessment,
      pageLoadHistory: workingCachedAssessment.pageLoadHistory,
      startEditPageId: pageToEdit,
    })

    const indexOfPageToEdit = workingCachedAssessment.pageLoadHistory.findIndex(it => it.pageId === pageToEdit)

    await this.store.setWorkingAssessment(key, {
      assessment: {
        questionsAndAnswers: workingCachedAssessment.assessment.questionsAndAnswers,
        version: workingCachedAssessment.assessment.version,
      },
      pageLoadHistory: workingCachedAssessment.pageLoadHistory.slice(0, indexOfPageToEdit),
    })
  }

  async getMergedQuestionsAndAnswers(stateKey: StateKey, questionsAndAnswersFromApi: ApiQuestionsAndAnswer[]) {
    const assessmentFromCache = await this.getWorkingAssessment(stateKey)

    // Merge together answers from API and cache
    const mergedQuestionsAndAnswers = assessmentFromCache.assessment.questionsAndAnswers
      ? [...assessmentFromCache.assessment.questionsAndAnswers]
      : []
    questionsAndAnswersFromApi.forEach(qAndA => {
      const questionAndAnswerFromCache = assessmentFromCache.assessment.questionsAndAnswers?.find(
        it => it?.question === qAndA.question.id,
      )
      // Only add if not present in cache
      if (!questionAndAnswerFromCache) {
        mergedQuestionsAndAnswers.push(toCachedQuestionAndAnswer(qAndA))
      }
      // Find any answered nested question and add to cache if it's not present
      const nestedAnsweredQuestion = qAndA.question.options
        ?.flatMap(it => it.nestedQuestions)
        .find(it => it?.answer?.answer)
      if (nestedAnsweredQuestion) {
        const nestedQuestionAndAnswerFromCache = assessmentFromCache.assessment.questionsAndAnswers?.find(
          it => it?.question === nestedAnsweredQuestion?.question.id,
        )
        if (!nestedQuestionAndAnswerFromCache) {
          mergedQuestionsAndAnswers.push(toCachedQuestionAndAnswer(nestedAnsweredQuestion))
        }
      }
    })

    return mergedQuestionsAndAnswers
  }

  async getAllAnsweredQuestionsFromCache(stateKey: StateKey, workingOrBackupCache: 'working' | 'backup') {
    let assessment: WorkingCachedAssessment | BackupCachedAssessment
    switch (workingOrBackupCache) {
      case 'working':
        assessment = await this.getWorkingAssessment(stateKey)
        break
      case 'backup':
        assessment = await this.getBackupAssessment(stateKey)
        break
      default:
        break
    }

    if (assessment) {
      const answeredQuestions: CachedQuestionAndAnswer[] = []
      assessment.pageLoadHistory.forEach(page => {
        page.questions.forEach(question => {
          const questionFromCache = assessment.assessment.questionsAndAnswers.find(it => it.question === question)
          if (questionFromCache) {
            answeredQuestions.push(questionFromCache)
          }
        })
      })
      return {
        questionsAndAnswers: answeredQuestions,
        version: assessment.assessment.version,
      } as CachedAssessment
    }
    return null
  }

  async updatePageLoadHistory(stateKey: StateKey, pageWithQuestions: PageWithQuestions) {
    const workingCachedAssessment = await this.getWorkingAssessment(stateKey)
    const { pageLoadHistory } = workingCachedAssessment
    // If this is a page we haven't loaded before add to the end of the array, otherwise remove any items after
    const pageWithQuestionFromCache = pageLoadHistory.find(it => it.pageId === pageWithQuestions.pageId)
    if (!pageWithQuestionFromCache) {
      pageLoadHistory.push(pageWithQuestions)
    } else {
      pageLoadHistory.splice(pageLoadHistory.indexOf(pageWithQuestionFromCache) + 1)
    }

    // Overwrite the pageLoadHistory
    workingCachedAssessment.pageLoadHistory = pageLoadHistory
    await this.store.setWorkingAssessment(stateKey, workingCachedAssessment)
  }

  async getWorkingAssessmentVersion(stateKey: StateKey) {
    return (await this.store.getWorkingAssessment(stateKey)).assessment.version
  }

  async resetWorkingCacheToBackupCache(stateKey: StateKey) {
    const backupCachedAssessment = await this.getBackupAssessment(stateKey)
    await this.store.setWorkingAssessment(stateKey, {
      assessment: backupCachedAssessment.assessment,
      pageLoadHistory: backupCachedAssessment.pageLoadHistory,
    })
  }

  async updateCachesOnCheckYourAnswers(stateKey: StateKey, mergedQuestionsAndAnswers: CachedQuestionAndAnswer[]) {
    await this.store.deleteBackupAssessment(stateKey)
    const workingCachedAssessment = await this.getWorkingAssessment(stateKey)
    if (mergedQuestionsAndAnswers) {
      workingCachedAssessment.assessment.questionsAndAnswers = mergedQuestionsAndAnswers
    }
    if (!workingCachedAssessment.pageLoadHistory.find(it => it.pageId === 'CHECK_ANSWERS')) {
      workingCachedAssessment.pageLoadHistory.push({ pageId: 'CHECK_ANSWERS', questions: [] })
    }
    await this.store.setWorkingAssessment(stateKey, workingCachedAssessment)
  }

  async getBackupAssessment(stateKey: StateKey) {
    return this.store.getBackupAssessment(stateKey)
  }

  async getFirstPageAndResetPageLoadHistory(stateKey: StateKey) {
    const workingAssessment = await this.store.getWorkingAssessment(stateKey)
    const firstPage = workingAssessment.pageLoadHistory[0]?.pageId
    workingAssessment.pageLoadHistory = []
    await this.store.setWorkingAssessment(stateKey, workingAssessment)
    return firstPage
  }
}
