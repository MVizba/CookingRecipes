import { authContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import categoryRouter from '..'

const createCaller = createCallerFactory(categoryRouter)

it('should create a persisted project', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const { create } = createCaller(authContext({ db }, user))

  const categoryCreated = await create({
    category_name: 'My Category name',
  })

  expect(categoryCreated).toMatchObject({
    id: expect.any(Number),
    category_name: 'My Category name',
    userId: user.id,
  })
})
