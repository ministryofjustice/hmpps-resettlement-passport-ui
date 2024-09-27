export type NextPage = {
  nextPageId?: string
  error?: string
}

export type ApiQuestionOption = {
  id: string
  displayText: string
  description?: string
  exclusive?: boolean
  nestedQuestions?: ApiQuestionsAndAnswer[]
  freeText?: boolean
}

export type AnswerType = 'StringAnswer' | 'MapAnswer' | 'ListAnswer'

export type Answer = {
  answer?: string | string[] | { [key: string]: string }[]
  '@class'?: AnswerType
}

export type ValidationType = 'MANDATORY' | 'OPTIONAL'

export type ValidationErrorType =
  | 'MANDATORY_INPUT'
  | 'MAX_CHARACTER_LIMIT_SHORT_TEXT'
  | 'MAX_CHARACTER_LIMIT_LONG_TEXT'
  | 'MAX_CHARACTER_LIMIT_ADDRESS'
  | 'CUSTOM'

export type ValidationError = {
  validationType: ValidationErrorType
  questionId: string
  customErrorMessage?: string
}

export type ValidationErrors = ValidationError[] | null

export type ApiQuestionsAndAnswer = {
  question: {
    id: string
    title?: string
    subTitle?: string
    type?: string
    options?: ApiQuestionOption[]
    validationType?: ValidationType
    customValidation?: CustomValidation
  }
  answer?: Answer
  originalPageId: string
}

export type ApiAssessmentPage = {
  error?: string
  id?: string
  title?: string
  questionsAndAnswers?: ApiQuestionsAndAnswer[]
}

export type CachedQuestionAndAnswer = {
  question: string
  questionTitle: string
  pageId: string
  questionType: string
  answer: {
    answer: string | string[] | { [key: string]: string }[]
    displayText: string | string[]
    '@class': AnswerType
  }
}

export type CachedAssessment = {
  questionsAndAnswers: CachedQuestionAndAnswer[]
  version: number
}

export type WorkingCachedAssessment = {
  assessment: CachedAssessment
  pageLoadHistory: PageWithQuestions[]
}

export type BackupCachedAssessment = {
  assessment: CachedAssessment
  pageLoadHistory: PageWithQuestions[]
  startEditPageId: string
}

export type ResettlementAssessmentVersion = {
  version: number
}

export type CustomValidation = {
  regex: string
  message: string
}

export type PageWithQuestions = {
  pageId: string
  questions: string[]
}
