import { DataSource } from 'typeorm'
import { authContext } from '@tests/utils/context'
import { Category, User } from '@server/entities'
import { fakeCategory, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import categoryRouter from '..'

const createCaller = createCallerFactory(categoryRouter)

describe('Category Router', () => {
  let db: DataSource

  beforeAll(async () => {
    db = await createTestDatabase()
  })

  afterAll(async () => {
    await db.destroy()
  })

  it('should return a list of categories', async () => {
    const [user, userOther] = await db
      .getRepository(User)
      .save([fakeUser(), fakeUser()])

    await db
      .getRepository(Category)
      .save([
        fakeCategory({ userId: user.id }),
        fakeCategory({ userId: userOther.id }),
      ])

    const { find } = createCaller(authContext({ db }, user))
    const userCategory = await find()

    expect(userCategory).toHaveLength(1)
    expect(userCategory[0]).toMatchObject({
      id: expect.any(Number),
      userId: user.id,
      category_name: expect.any(String),
    })
  })
})
