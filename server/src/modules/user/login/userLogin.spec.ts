import { createCallerFactory } from '@server/trpc'
import userRouter from '..'

const createCaller = createCallerFactory(userRouter)

const userSeed = {
  id: 12345,
  email: 'existing@user.com',
  // We could mock out the bcrypt though in this case it would
  // make our tests a less readable. If we would need to perform
  // lots of bcrypt calls, then we should consider mocking it out.
  // Hash for 'password.123' (PASSWORD_CORRECT).
  password: '$2b$10$sD53fzWIQBjXWfSDzuwmMOyY1ZAygLpRZlLxxPhcNG5r9BFWrNaDC',
}

// Example using a mocked out db.
const db = {
  getRepository: () => ({
    findOne: ({ where: { email } }: any) =>
      email === userSeed.email ? userSeed : null,
  }),
}

// The same mocked db, but with a more declarative utility function,
// which is easier to work with if we would have multiple repositories.
// const db = createMockDatabase({
//   User: {
//     findOne: ({ where: { email } }: any) =>
//       email === userSeed.email ? userSeed : null,
//   },
// })

const { login } = createCaller({ db } as any)

const PASSWORD_CORRECT = 'password.123'

it('returns a token if the password matches', async () => {
  const { accessToken } = await login({
    email: userSeed.email,
    password: PASSWORD_CORRECT,
  })

  // jwt
  expect(accessToken).toEqual(expect.any(String))
  expect(accessToken.slice(0, 3)).toEqual('eyJ')
})

it('should throw an error for non-existant user', async () => {
  await expect(
    login({
      email: 'nonexisting@user.com',
      password: PASSWORD_CORRECT,
    })
  ).rejects.toThrow() // some error
})

it('should throw an error for incorrect password', async () => {
  expect(
    login({
      email: userSeed.email,
      password: 'password.123!',
    })
  ).rejects.toThrow(/password/i)
})

it('throws an error for invalid email', async () => {
  await expect(
    login({
      email: 'not-an-email',
      password: PASSWORD_CORRECT,
    })
  ).rejects.toThrow(/email/)
})

it('throws an error for a short password', async () => {
  await expect(
    login({
      email: userSeed.email,
      password: 'short',
    })
  ).rejects.toThrow(/password/)
})

it('allows logging in with different email case', async () => {
  await expect(
    login({
      email: userSeed.email.toUpperCase(),
      password: PASSWORD_CORRECT,
    })
  ).resolves.toEqual(expect.anything())
})

it('allows logging in with surrounding white space', async () => {
  await expect(
    login({
      email: ` \t ${userSeed.email}\t `, // tabs and spaces
      password: PASSWORD_CORRECT,
    })
  ).resolves.toEqual(expect.anything())
})
