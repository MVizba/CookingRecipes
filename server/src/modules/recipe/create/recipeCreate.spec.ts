import { authContext } from '@tests/utils/context'
import { fakeUser, fakeCategory } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Category, User, Recipe } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import recipeRouter from '..'
import { DataSource } from 'typeorm'

const createCaller = createCallerFactory(recipeRouter)

describe('Recipe Creation Endpoint', () => {
  let db: DataSource

  beforeAll(async () => {
    db = await createTestDatabase()
  })

  afterAll(async () => {
    await db.close()
  })

  it('should create a recipe successfully', async () => {
    const user = await db.getRepository(User).save(fakeUser())
    const category = await db
      .getRepository(Category)
      .save(fakeCategory({ userId: user.id }))
    const { create } = createCaller(authContext({ db }, user))

    const recipeData = {
      recipe_name: 'receptas',
      categoryId: category.id,
    }

    const recipeCreated = await create(recipeData)

    expect(recipeCreated).toBeDefined()
    expect(recipeCreated.id).toBeGreaterThan(0)
    expect(recipeCreated.recipe_name).toBe('receptas')
    expect(recipeCreated.categoryId).toBe(category.id)

    const savedRecipe = await db
      .getRepository(Recipe)
      .findOneBy({ id: recipeCreated.id })
    expect(savedRecipe).not.toBeNull()
    if (savedRecipe) {
      expect(savedRecipe.recipe_name).toBe('receptas')
      expect(savedRecipe.categoryId).toBe(category.id)
    }
  })
})
