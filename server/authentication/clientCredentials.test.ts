import generateOauthClientToken from './clientCredentials'

describe('generateOauthClientToken', () => {
  it('Token can be generated using default client id and secret', () => {
    expect(generateOauthClientToken()).toMatch(/^Basic [-A-Za-z0-9+/]*={0,3}/)
  })

  it('Token can be generated when given explicit client id and secret', () => {
    expect(generateOauthClientToken('bob', 'password1')).toBe('Basic Ym9iOnBhc3N3b3JkMQ==')
  })

  it('Token can be generated with special characters', () => {
    const value = generateOauthClientToken('bob', "p@'s&sw/o$+ rd1")
    const decoded = Buffer.from(value.substring(6), 'base64').toString('utf-8')

    expect(decoded).toBe("bob:p@'s&sw/o$+ rd1")
  })
})
