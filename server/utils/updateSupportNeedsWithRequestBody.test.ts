import { SupportNeedsCache } from '../data/model/supportNeeds'
import { updateSupportNeedsWithRequestBody } from './updateSupportNeedsWithRequestBody'

describe('updateSupportNeedsWithRequestBody', () => {
  it.each([
    [
      'Empty body',
      {
        needs: [
          {
            uuid: '1',
            supportNeedId: 101,
            existingPrisonerSupportNeedId: 201,
            title: 'Need 1',
            otherSupportNeedText: null,
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category A',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: true,
          },
          {
            uuid: '2',
            supportNeedId: 102,
            existingPrisonerSupportNeedId: 202,
            title: 'Need 2',
            otherSupportNeedText: null,
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category B',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: false,
          },
        ],
      },
      {},
      {
        needs: [
          {
            uuid: '1',
            supportNeedId: 101,
            existingPrisonerSupportNeedId: 201,
            title: 'Need 1',
            otherSupportNeedText: null,
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category A',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: false,
          },
          {
            uuid: '2',
            supportNeedId: 102,
            existingPrisonerSupportNeedId: 202,
            title: 'Need 2',
            otherSupportNeedText: null,
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category B',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: false,
          },
        ],
      },
    ],
    [
      'Multiple selected needs with array and single values',
      {
        needs: [
          {
            uuid: 'edd176fe-9b70-418c-8f1a-cf37c8e73c6d',
            supportNeedId: 103,
            existingPrisonerSupportNeedId: 203,
            title: 'Need A',
            otherSupportNeedText: null,
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category X',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: false,
          },
          {
            uuid: 'f1dfa2d1-35cd-418d-9c45-1ec409cdbcaa',
            supportNeedId: 104,
            existingPrisonerSupportNeedId: 204,
            title: 'Need B',
            otherSupportNeedText: null,
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category Y',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: false,
          },
          {
            uuid: '20f65cf4-bfd7-4074-bcf2-d1e9c295b642',
            supportNeedId: 105,
            existingPrisonerSupportNeedId: 205,
            title: 'Need C',
            otherSupportNeedText: null,
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category Z',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: false,
          },
        ],
      },
      {
        'support-need-option-Accommodation before custody': [
          'edd176fe-9b70-418c-8f1a-cf37c8e73c6d',
          'f1dfa2d1-35cd-418d-9c45-1ec409cdbcaa',
        ],
        'support-need-option-Moving to new accommodation': '20f65cf4-bfd7-4074-bcf2-d1e9c295b642',
        'support-need-option-Accommodation related debt and arrears': '172f6077-0f52-462c-b795-2159518fd178',
        _csrf: 'xjM2bce6-Fxszy6zsKw7Uv4osAIBvob_IYuI',
        prisonerNumber: 'A8731DY',
      },
      {
        needs: [
          {
            uuid: 'edd176fe-9b70-418c-8f1a-cf37c8e73c6d',
            supportNeedId: 103,
            existingPrisonerSupportNeedId: 203,
            title: 'Need A',
            otherSupportNeedText: null,
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category X',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: true,
          },
          {
            uuid: 'f1dfa2d1-35cd-418d-9c45-1ec409cdbcaa',
            supportNeedId: 104,
            existingPrisonerSupportNeedId: 204,
            title: 'Need B',
            otherSupportNeedText: null,
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category Y',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: true,
          },
          {
            uuid: '20f65cf4-bfd7-4074-bcf2-d1e9c295b642',
            supportNeedId: 105,
            existingPrisonerSupportNeedId: 205,
            title: 'Need C',
            otherSupportNeedText: null,
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category Z',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: true,
          },
        ],
      },
    ],
    [
      'Selected custom Other support needs',
      {
        needs: [
          {
            uuid: 'edd176fe-9b70-418c-8f1a-cf37c8e73c6d',
            supportNeedId: 103,
            existingPrisonerSupportNeedId: 203,
            title: 'Other',
            otherSupportNeedText: null,
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category X',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: false,
          },
          {
            uuid: 'f1dfa2d1-35cd-418d-9c45-1ec409cdbcaa',
            supportNeedId: 104,
            existingPrisonerSupportNeedId: 204,
            title: 'Other',
            otherSupportNeedText: null,
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category Y',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: false,
          },
          {
            uuid: '20f65cf4-bfd7-4074-bcf2-d1e9c295b642',
            supportNeedId: 105,
            existingPrisonerSupportNeedId: 205,
            title: 'Need C',
            otherSupportNeedText: null,
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category Z',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: false,
          },
        ],
      },
      {
        'support-need-option-Accommodation before custody': [
          'edd176fe-9b70-418c-8f1a-cf37c8e73c6d',
          'f1dfa2d1-35cd-418d-9c45-1ec409cdbcaa',
        ],
        'support-need-option-Moving to new accommodation': '20f65cf4-bfd7-4074-bcf2-d1e9c295b642',
        'custom-other-edd176fe-9b70-418c-8f1a-cf37c8e73c6d': 'A custom support need text',
        'custom-other-f1dfa2d1-35cd-418d-9c45-1ec409cdbcaa': 'Other support need text',
        'custom-other-172f6077-0f52-462c-b795-2159518fd178': '',
        _csrf: 'xjM2bce6-Fxszy6zsKw7Uv4osAIBvob_IYuI',
        prisonerNumber: 'A8731DY',
      },
      {
        needs: [
          {
            uuid: 'edd176fe-9b70-418c-8f1a-cf37c8e73c6d',
            supportNeedId: 103,
            existingPrisonerSupportNeedId: 203,
            title: 'Other',
            otherSupportNeedText: 'A custom support need text',
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category X',
            allowUserDesc: false,
            isOther: true,
            isUpdatable: true,
            isSelected: true,
          },
          {
            uuid: 'f1dfa2d1-35cd-418d-9c45-1ec409cdbcaa',
            supportNeedId: 104,
            existingPrisonerSupportNeedId: 204,
            title: 'Other',
            otherSupportNeedText: 'Other support need text',
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category Y',
            allowUserDesc: false,
            isOther: true,
            isUpdatable: true,
            isSelected: true,
          },
          {
            uuid: '20f65cf4-bfd7-4074-bcf2-d1e9c295b642',
            supportNeedId: 105,
            existingPrisonerSupportNeedId: 205,
            title: 'Need C',
            otherSupportNeedText: null,
            status: 'open',
            isPrisonResponsible: false,
            isProbationResponsible: false,
            updateText: '',
            category: 'Category Z',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: true,
          },
        ],
      },
    ],
  ])(
    '%s',
    (_: string, currentCacheStatus: SupportNeedsCache, body: Record<string, string>, expected: SupportNeedsCache) => {
      expect(updateSupportNeedsWithRequestBody(currentCacheStatus, body)).toEqual(expected)
    },
  )
})
