import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { fakeCategory, fakeUser } from '@server/entities/tests/fakes'
import { User } from '@server/entities'
import { createCallerFactory, router } from '..'
import { categoryIdOwnerProcedure } from '.'

const routes = router({
  testCall: categoryIdOwnerProcedure.query(() => 'passed'),
})

const db = await createTestDatabase()

const [
  {
    categories: [categoryOne],
    ...userOne
  },
  {
    categories: [categoryTwo],
  },
] = await db.getRepository(User).save([
  fakeUser({
    categories: [fakeCategory()],
  }),
  fakeUser({
    categories: [fakeCategory()],
  }),
])

const createCaller = createCallerFactory(routes)
const authenticated = createCaller(authContext({ db }, userOne))

it('should pass if category belongs to the user', async () => {
  const response = await authenticated.testCall({ categoryId: categoryOne.id })

  expect(response).toEqual('passed')
})

it('should throw an error if categorytId is not provided', async () => {
  // casting to any to allow calling without type safe input
  await expect((authenticated.testCall as any)({})).rejects.toThrow(/category/i)
})

it('should throw an error if user provides a non-existing categoryId', async () => {
  // casting to any to allow calling without type safe input
  await expect(
    (authenticated.testCall as any)({ categoryId: 999 })
  ).rejects.toThrow(/category/i)
})

it('should throw an error if user provides null categoryId', async () => {
  await expect(
    authenticated.testCall({ categoryId: null as any })
  ).rejects.toThrow(/category/i)
})

it('should throw an error if category does not belong to the user', async () => {
  await expect(
    authenticated.testCall({ categoryId: categoryTwo.id })
  ).rejects.toThrow(/category/i)
})
