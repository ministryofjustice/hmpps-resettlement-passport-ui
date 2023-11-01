export type EducationSkillsWorkResponse = {
  error?: string
  results?: EducationSkillsWork[]
}

export type EducationSkillsWork = {
  workReadinessStatus: string
  details: string[]
}
