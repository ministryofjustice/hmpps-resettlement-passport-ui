import { validateAssessmentSkipForm } from './assessmentSkipController'

describe('validateAssessmentSkipForm', () => {
  it.each(['COMPLETED_IN_OASYS', 'COMPLETED_IN_ANOTHER_PRISON', 'EARLY_RELEASE', 'TRANSFER', 'OTHER'])(
    'Returns null on a valid form where %s is chosen',
    choice => {
      expect(validateAssessmentSkipForm({ whySkipChoice: choice })).toBeNull()
    },
  )

  it('gives an error for missing whySkipChoice', () => {
    expect(validateAssessmentSkipForm({ somethingElse: 'earlyRelease' })).toEqual({
      whySkipChoice: 'This field is required',
    })
  })

  it('gives an error for unexpected whySkipChoice', () => {
    expect(validateAssessmentSkipForm({ whySkipChoice: 'potato' })).toEqual({
      whySkipChoice: 'This field is required',
    })
  })

  it('gives an error for empty', () => {
    expect(validateAssessmentSkipForm({})).toEqual({
      whySkipChoice: 'This field is required',
    })
  })
})
