import { KeyValue, errorProperties } from './analytics'

describe('Analytics', () => {
  afterAll(() => {
    jest.resetAllMocks()
  })

  describe('errorProperties', () => {
    it('should combine mapped errors with user data', () => {
      const errors: Express.ValidationError[] = [
        { text: 'otp-error-date-3', href: '#dob' },
        { text: 'otp-error-date-1', href: '#otp' },
      ]
      const id = 'asdasdasdasddsadsa'

      const expected: KeyValue[] = [
        { key: 'errorField', value: '#dob' },
        { key: 'errorField', value: '#otp' },
        { key: 'userId', value: id },
      ]

      const result = errorProperties(errors, id)

      expect(result).toEqual(expected)
    })

    it('should handle no user data', () => {
      const expected: KeyValue[] = [{ key: 'userId', value: null }]
      const result = errorProperties([], null)
      expect(result).toEqual(expected)
    })
  })
})
