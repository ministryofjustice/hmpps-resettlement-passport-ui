import SupportNeedUpdateForm from './supportNeedUpdateForm'
import { PrisonerSupportNeedDetails } from '../../data/model/supportNeeds'

describe('Support Need Update Form', () => {
  const existingPrisonerNeed: PrisonerSupportNeedDetails = {
    title: 'title',
    isPrisonResponsible: true,
    isProbationResponsible: false,
    status: 'NOT_STARTED',
    previousUpdates: [],
  }

  it('should show defaults if no submitted form', async () => {
    const form = new SupportNeedUpdateForm(existingPrisonerNeed, {}, null)

    expect(form.renderArgs).toEqual({
      updateStatus: 'NOT_STARTED',
      responsibleStaff: ['PRISON'],
      additionalDetails: '',
      errors: null,
    })
  })

  it('should show form values if the form was submitted', async () => {
    const form = new SupportNeedUpdateForm(existingPrisonerNeed, { updateStatus: 'IN_PROGRESS' }, null)

    expect(form.renderArgs).toEqual({
      updateStatus: 'IN_PROGRESS',
      errors: null,
    })
  })
})
