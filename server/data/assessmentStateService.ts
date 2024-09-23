import AssessmentStore, { StateKey } from './assessmentStore'
import { createRedisClient } from './redisClient'
import {
  ApiQuestionsAndAnswer,
  BackupCachedAssessment,
  CachedAssessment,
  CachedQuestionAndAnswer,
  WorkingCachedAssessment,
} from './model/immediateNeedsReport'
import { toCachedQuestionAndAnswer } from '../utils/formatAssessmentResponse'

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

  async answer(
    key: StateKey,
    assessmentToSave: CachedAssessment,
    allAvailableQuestionsFromApi: string[],
    pageId: string,
  ) {
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
        // Add the new question if it doesn't exist
        existingAssessmentFromCache.assessment.questionsAndAnswers.push(newQandA)
      }
    })

    await this.store.setWorkingAssessment(key, existingAssessmentFromCache)
  }

  // async sortQuestions(key: StateKey, questions: CachedQuestionAndAnswer[]) {
  //   const workingAssessment = await this.store.getWorkingAssessment(key)
  //   const { pageLoadHistory } = workingAssessment
  //   questions.sort((a, b) => pageLoadHistory.indexOf(a.pageId) - pageLoadHistory.indexOf(b.pageId))
  //   return questions
  // }

  async checkForConvergence(key: StateKey, currentPage: string): Promise<boolean> {
    const workingAssessment = await this.store.getWorkingAssessment(key)
    const backupAssessment = await this.store.getBackupAssessment(key)

    // Check if we're in an edit - we're in an edit if a backupAssessment exists
    const edit = backupAssessment !== null

    if (!edit || backupAssessment.startEditPageId === currentPage) {
      return false
    }

    const answeredPages = [...new Set(workingAssessment.assessment.questionsAndAnswers.map(it => it.pageId))]
    if (answeredPages.includes(currentPage)) {
      const extraAnsweredPages = backupAssessment.pageLoadHistory.slice(
        backupAssessment.pageLoadHistory.indexOf(currentPage),
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

  async initialiseCache(stateKey: StateKey, configVersion: number, apiQuestionsAndAnswers: ApiQuestionsAndAnswer[]) {
    const existingWorkingAssessment = await this.getWorkingAssessment(stateKey)

    if (!existingWorkingAssessment) {
      const initialAssessment = {
        assessment: {
          questionsAndAnswers: this.convertQuestionsAndAnswersToCacheFormat(apiQuestionsAndAnswers),
          version: configVersion,
        },
        pageLoadHistory: this.getPagesFromApiQuestionsAndAnswers(apiQuestionsAndAnswers),
      } as WorkingCachedAssessment
      await this.store.setWorkingAssessment(stateKey, initialAssessment)
      return initialAssessment
    }
    if (apiQuestionsAndAnswers.length > 0) {
      existingWorkingAssessment.pageLoadHistory = this.getPagesFromApiQuestionsAndAnswers(apiQuestionsAndAnswers)
      await this.store.setWorkingAssessment(stateKey, existingWorkingAssessment)
    }
    return existingWorkingAssessment
  }

  convertQuestionsAndAnswersToCacheFormat(prefillFromApi: ApiQuestionsAndAnswer[]) {
    if (prefillFromApi.length > 0) {
      return prefillFromApi.map(it => toCachedQuestionAndAnswer(it))
    }
    return []
  }

  getPagesFromApiQuestionsAndAnswers(apiQuestionsAndAnswers: ApiQuestionsAndAnswer[]) {
    if (apiQuestionsAndAnswers.length > 0) {
      return [...new Set(apiQuestionsAndAnswers.map(it => it.originalPageId))]
    }
    return []
  }

  async startEdit(key: StateKey, pageToEdit: string) {
    const workingCachedAssessment = await this.getWorkingAssessment(key)

    await this.store.setBackupAssessment(key, {
      assessment: workingCachedAssessment.assessment,
      pageLoadHistory: workingCachedAssessment.pageLoadHistory,
      startEditPageId: pageToEdit,
    })

    const indexOfPageToEdit = workingCachedAssessment.pageLoadHistory.findIndex(it => it === pageToEdit)

    await this.store.setWorkingAssessment(key, {
      assessment: {
        questionsAndAnswers: workingCachedAssessment.assessment.questionsAndAnswers,
        version: workingCachedAssessment.assessment.version,
      },
      pageLoadHistory: workingCachedAssessment.pageLoadHistory.slice(0, indexOfPageToEdit + 1),
    })
  }

  async getMergedQuestionsAndAnswers(stateKey: StateKey, questionsAndAnswersFromApi: ApiQuestionsAndAnswer[]) {
    const assessmentFromCache = await this.getWorkingAssessment(stateKey)

    // Merge together answers from API and cache
    const mergedQuestionsAndAnswers = assessmentFromCache ? [...assessmentFromCache.assessment.questionsAndAnswers] : []
    questionsAndAnswersFromApi.forEach(qAndA => {
      const questionAndAnswerFromCache = assessmentFromCache.assessment.questionsAndAnswers.find(
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
        const nestedQuestionAndAnswerFromCache = assessmentFromCache.assessment.questionsAndAnswers.find(
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
        answeredQuestions.push(...assessment.assessment.questionsAndAnswers.filter(qa => page === qa.pageId))
      })
      return {
        questionsAndAnswers: answeredQuestions,
        version: assessment.assessment.version,
      } as CachedAssessment
    }
    return null
  }

  async updatePageLoadHistory(stateKey: StateKey, currentPageId: string) {
    const workingCachedAssessment = await this.getWorkingAssessment(stateKey)
    const { pageLoadHistory } = workingCachedAssessment
    // If this is a page we haven't loaded before add to the end of the array, otherwise remove any items after
    if (!pageLoadHistory.find(it => it === currentPageId)) {
      pageLoadHistory.push(currentPageId)
    } else {
      pageLoadHistory.splice(pageLoadHistory.indexOf(currentPageId) + 1, pageLoadHistory.length)
    }

    // Overwrite the pageLoadHistory
    workingCachedAssessment.pageLoadHistory = pageLoadHistory
    await this.store.setWorkingAssessment(stateKey, workingCachedAssessment)
  }

  async getWorkingAssessmentVersion(stateKey: StateKey) {
    return (await this.store.getWorkingAssessment(stateKey)).assessment.version
  }

  async resetWorkingCacheToBackupCache(stateKey: StateKey) {
    const backupCachedAssessment = await this.getWorkingAssessment(stateKey)
    await this.store.setWorkingAssessment(stateKey, {
      assessment: backupCachedAssessment.assessment,
      pageLoadHistory: backupCachedAssessment.pageLoadHistory,
    })
  }

  async clearDownCaches(stateKey: StateKey, mergedQuestionsAndAnswers: CachedQuestionAndAnswer[]) {
    await this.store.deleteBackupAssessment(stateKey)
    const workingCachedAssessment = await this.getWorkingAssessment(stateKey)
    workingCachedAssessment.assessment.questionsAndAnswers = mergedQuestionsAndAnswers
    await this.store.setWorkingAssessment(stateKey, workingCachedAssessment)
  }

  async getBackupAssessment(stateKey: StateKey) {
    return this.store.getBackupAssessment(stateKey)
  }
}
