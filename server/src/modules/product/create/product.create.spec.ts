import { authContext } from '@tests/utils/context'
import {
  fakeUser,
  fakeCategory,
  fakeRecipe,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User, Category, Recipe } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import productRouter from '..'

const createCaller = createCallerFactory(productRouter)

it('should create a persisted product', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const category = await db
    .getRepository(Category)
    .save(fakeCategory({ userId: user.id }))
  const recipe = await db
    .getRepository(Recipe)
    .save(fakeRecipe({ categoryId: category.id }))
  const { create } = createCaller(authContext({ db }, user))

  const productCreated = await create({
    name: 'Sample Product',
    product: 'Sample Ingredient',
    instructions: 'Sample Instructions',
    recipeId: recipe.id,
  })

  expect(productCreated).toMatchObject({
    id: expect.any(Number),
    name: 'Sample Product',
    product: 'Sample Ingredient',
    instructions: 'Sample Instructions',
    recipeId: recipe.id,
  })
})
