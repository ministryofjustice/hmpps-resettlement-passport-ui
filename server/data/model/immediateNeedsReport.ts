export type NextPage = {
  nextPageId?: string
  error?: string
}

export type QuestionOptions = {
  id: string
  displayText: string
  description?: string
  exclusive?: boolean
  nestedQuestions?: QuestionsAndAnswers[]
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

export type QuestionsAndAnswers = {
  question: {
    id: string
    title?: string
    subTitle?: string
    type?: string
    options?: QuestionOptions[]
    validationType?: ValidationType
    customValidation?: CustomValidation
  }
  answer?: Answer
  originalPageId: string
}

export type AssessmentPage = {
  error?: string
  id?: string
  title?: string
  questionsAndAnswers?: QuestionsAndAnswers[]
}

export type SubmittedQuestionAndAnswer = {
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

export type SubmittedInput = {
  questionsAndAnswers?: SubmittedQuestionAndAnswer[]
  version: number
}

export type ResettlementAssessmentVersion = {
  version: number
}

export type CustomValidation = {
  regex: string
  message: string
}
