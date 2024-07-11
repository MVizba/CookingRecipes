import { authContext, requestContext } from '@tests/utils/context'
import { createCallerFactory, router } from '..'
import { authenticatedProcedure } from '.'

const routes = router({
  testCall: authenticatedProcedure.query(() => 'passed'),
})

const createCaller = createCallerFactory(routes)

const VALID_TOKEN = 'valid-token'

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: (token: string) => {
      if (token !== VALID_TOKEN) throw new Error('Invalid token')

      return { user: { id: 2, email: 'valid@email.com' } }
    },
  },
}))

// we do not need a database for this test
const db = {} as any
const authenticated = createCaller(authContext({ db }))

it('should pass if user is already authenticated', async () => {
  const response = await authenticated.testCall()

  expect(response).toEqual('passed')
})

it('should pass if user provides a valid token', async () => {
  const usingValidToken = createCaller({
    db,
    req: {
      header: () => `Bearer ${VALID_TOKEN}`,
    } as any,
  })

  const response = await usingValidToken.testCall()

  expect(response).toEqual('passed')
})

it('should throw an error if user is not logged in', async () => {
  const unauthenticated = createCaller(requestContext({ db }))

  await expect(unauthenticated.testCall()).rejects.toThrow(
    // any authentication-like error
    /login|log in|logged in|authenticate|unauthorized/i
  )
})

it('should throw an error if it is run without access to headers', async () => {
  const invalidToken = createCaller(
    requestContext({
      db,
      req: undefined as any,
    })
  )

  await expect(invalidToken.testCall()).rejects.toThrow(/Express/i)
})

it('should throw an error if user provides invalid token', async () => {
  const invalidToken = createCaller(
    requestContext({
      db,
      req: {
        header: () => 'Bearer invalid-token',
      } as any,
    })
  )

  await expect(invalidToken.testCall()).rejects.toThrow(/token/i)
})
