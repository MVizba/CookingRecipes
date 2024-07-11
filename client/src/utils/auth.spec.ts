import { getUserFromToken } from './auth'

describe('getUserFromToken', () => {
  it('should return the user object from a valid JWT token', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMTIzNDU2Nzg5MCJ9LCJpYXQiOjE2MzIwMjQwMjMsImV4cCI6MTYzMjAyNzYyM30.5Z8zJfJ6JzJvJzJ6JzJvJzJ6JzJvJzJ6JzJvJzJ6JzJvJzJ6JzJvJzJ6JzJvJzJvJzJ6JzJvJzJ6JzJvJw'

    const user = getUserFromToken(token)
    expect(user).toEqual({
      id: '1234567890',
    })
  })

  it('should throw an error for an invalid token', () => {
    const token = 'invalid-token'
    expect(() => getUserFromToken(token)).toThrow()
  })
})
