import { groupSupportNeedsByCategory } from './groupSupportNeedsByCategory'
import { SupportNeedsCache, GroupedSupportNeeds } from '../data/model/supportNeeds'

describe('groupSupportNeedsByCategory', () => {
  it.each([
    ['Empty data', { needs: [] }, []],
    [
      'Single category, single support need',
      {
        needs: [
          {
            uuid: '1',
            supportNeedId: 1,
            existingPrisonerSupportNeedId: 0,
            title: 'Health Need',
            otherSupportNeedText: '',
            status: 'active',
            isPrisonResponsible: false,
            isProbationResponsible: true,
            updateText: '',
            category: 'Health',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: true,
          },
        ],
      },
      [
        {
          category: 'Health',
          supportNeeds: [
            {
              uuid: '1',
              supportNeedId: 1,
              existingPrisonerSupportNeedId: 0,
              title: 'Health Need',
              otherSupportNeedText: '',
              status: 'active',
              isPrisonResponsible: false,
              isProbationResponsible: true,
              updateText: '',
              category: 'Health',
              allowUserDesc: false,
              isOther: false,
              isUpdatable: true,
              isSelected: true,
            },
          ],
          exclusiveOption: null,
        },
      ],
    ],
    [
      'Exclusive option handling',
      {
        needs: [
          {
            uuid: '2',
            supportNeedId: 4,
            existingPrisonerSupportNeedId: 0,
            title: 'Employment Support',
            otherSupportNeedText: '',
            status: 'active',
            isPrisonResponsible: true,
            isProbationResponsible: false,
            updateText: '',
            category: 'Employment',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: false,
            isSelected: true,
          },
          {
            uuid: '3',
            supportNeedId: 5,
            existingPrisonerSupportNeedId: 1,
            title: 'Employment Training',
            otherSupportNeedText: '',
            status: 'active',
            isPrisonResponsible: false,
            isProbationResponsible: true,
            updateText: '',
            category: 'Employment',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: true,
            isSelected: true,
          },
        ],
      },
      [
        {
          category: 'Employment',
          supportNeeds: [
            {
              uuid: '3',
              supportNeedId: 5,
              existingPrisonerSupportNeedId: 1,
              title: 'Employment Training',
              otherSupportNeedText: '',
              status: 'active',
              isPrisonResponsible: false,
              isProbationResponsible: true,
              updateText: '',
              category: 'Employment',
              allowUserDesc: false,
              isOther: false,
              isUpdatable: true,
              isSelected: true,
            },
          ],
          exclusiveOption: {
            uuid: '2',
            supportNeedId: 4,
            existingPrisonerSupportNeedId: 0,
            title: 'Employment Support',
            otherSupportNeedText: '',
            status: 'active',
            isPrisonResponsible: true,
            isProbationResponsible: false,
            updateText: '',
            category: 'Employment',
            allowUserDesc: false,
            isOther: false,
            isUpdatable: false,
            isSelected: true,
          },
        },
      ],
    ],
  ])('%s', (_: string, input: SupportNeedsCache, expected: GroupedSupportNeeds) => {
    expect(groupSupportNeedsByCategory(input)).toEqual(expected)
  })
})
