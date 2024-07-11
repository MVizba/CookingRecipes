import { authContext } from '@tests/utils/context'
import {
  fakeUser,
  fakeCategory,
  fakeRecipe,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Category, User, Recipe } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import recipeRouter from '..'
import { DataSource } from 'typeorm'

const createCaller = createCallerFactory(recipeRouter)

describe('Recipe Deletion Endpoint', () => {
  let db: DataSource

  beforeAll(async () => {
    db = await createTestDatabase()
  })

  afterAll(async () => {
    await db.close()
  })

  it('should delete a recipe if owned by user', async () => {
    const user = await db.getRepository(User).save(fakeUser())
    const category = await db
      .getRepository(Category)
      .save(fakeCategory({ userId: user.id }))
    const recipe = await db
      .getRepository(Recipe)
      .save(fakeRecipe({ categoryId: category.id }))

    const { delete: deleteRecipe } = createCaller(authContext({ db }, user))

    const result = await deleteRecipe(recipe.id)

    expect(result).toEqual({ success: true })

    const deletedRecipe = await db
      .getRepository(Recipe)
      .findOne({ where: { id: recipe.id } })
    expect(deletedRecipe).toBeNull()
  })

  it('should be an error if the recipe does not belong to the user', async () => {
    const user = await db.getRepository(User).save(fakeUser())
    const otherUser = await db.getRepository(User).save(fakeUser())
    const category = await db
      .getRepository(Category)
      .save(fakeCategory({ userId: otherUser.id }))
    const recipe = await db
      .getRepository(Recipe)
      .save(fakeRecipe({ categoryId: category.id }))

    const { delete: deleteRecipe } = createCaller(authContext({ db }, user))

    await expect(deleteRecipe(recipe.id)).rejects.toThrowError(
      `Recipe with id ${recipe.id} was not found or does not belong to the authenticated user through category ownership`
    )
  })
})
