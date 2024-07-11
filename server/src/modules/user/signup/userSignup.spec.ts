import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import { fakeUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import userRouter from '..'

const db = await createTestDatabase()
const userRepository = db.getRepository(User)
const createCaller = createCallerFactory(userRouter)
const { signup } = createCaller({ db })

it('should save a user', async () => {
  const user = fakeUser()
  const response = await signup(user)

  const userCreated = (await userRepository.findOneOrFail({
    select: {
      id: true,
      email: true,
      password: true,
    },
    where: {
      email: user.email,
    },
  })) as Pick<User, 'id' | 'email' | 'password'>

  expect(userCreated).toEqual({
    id: expect.any(Number),
    email: user.email,
    password: expect.not.stringContaining(user.password),
  })

  expect(userCreated.password).toHaveLength(60)

  expect(response).toEqual({
    id: expect.any(Number),
    email: user.email,
  })

  expect(response.id).toEqual(userCreated!.id)
})

it('should require a valid email', async () => {
  await expect(
    signup({
      email: 'user-email-invalid',
      password: 'password.123',
    })
  ).rejects.toThrow(/email/i) // throws out some error complaining about "email"
})

it('should require a password with at least 8 characters', async () => {
  await expect(
    signup({
      email: 'user2@domain.com',
      password: 'pas.123',
    })
  ).rejects.toThrow(/password/i) // throws out some error complaining about "password"
})

it('throws an error for invalid email', async () => {
  await expect(
    signup({
      email: 'not-an-email',
      password: 'some-password',
    })
  ).rejects.toThrow(/email/)
})

it('stores lowercased email', async () => {
  const user = fakeUser()
  await signup({
    ...user,
    email: user.email.toUpperCase(),
  })

  await expect(
    userRepository.findOneByOrFail({
      email: user.email,
    })
  ).resolves.not.toBeNull()
})

it('stores email with trimmed whitespace', async () => {
  const user = fakeUser()
  await signup({
    ...user,
    email: ` \t ${user.email}\t `, // tabs and spaces
  })

  await expect(
    userRepository.findOneByOrFail({
      email: user.email,
    })
  ).resolves.not.toBeNull()
})
