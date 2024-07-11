import { authContext } from '@tests/utils/context'
import { fakeUser, fakeCategory } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Category, User } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import categoryRouter from '..'
import { DataSource } from 'typeorm'

const createCaller = createCallerFactory(categoryRouter)

describe('Category Deletion Endpoint', () => {
  let db: DataSource

  beforeAll(async () => {
    db = await createTestDatabase()
  })

  afterAll(async () => {
    await db.close()
  })

  it('should delete a category if owned by user', async () => {
    const user = await db.getRepository(User).save(fakeUser())
    const category = await db
      .getRepository(Category)
      .save(fakeCategory({ userId: user.id }))

    const { delete: deleteCategory } = createCaller(authContext({ db }, user))

    const result = await deleteCategory(category.id)

    expect(result).toEqual({ success: true })

    const deletedCategory = await db
      .getRepository(Category)
      .findOne({ where: { id: category.id } })
    expect(deletedCategory).toBeNull()
  })

  it('error if the category is not users', async () => {
    const user = await db.getRepository(User).save(fakeUser())
    const otherUser = await db.getRepository(User).save(fakeUser())
    const category = await db
      .getRepository(Category)
      .save(fakeCategory({ userId: otherUser.id }))

    const { delete: deleteCategory } = createCaller(authContext({ db }, user))

    await expect(deleteCategory(category.id)).rejects.toThrowError(
      `Category with id ${category.id} was not found or does not belong to the authenticated user`
    )
  })
})
