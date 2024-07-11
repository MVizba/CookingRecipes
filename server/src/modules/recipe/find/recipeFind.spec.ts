import { authContext } from '@tests/utils/context'
import { Category, User, Recipe } from '@server/entities'
import {
  fakeCategory,
  fakeUser,
  fakeRecipe,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import recipeRouter from '..'

const createCaller = createCallerFactory(recipeRouter)

it('should return a list of recipes for the authenticated user', async () => {
  const db = await createTestDatabase()
  const [user, userOther] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  const category1 = await db
    .getRepository(Category)
    .save(fakeCategory({ userId: user.id }))
  const category2 = await db
    .getRepository(Category)
    .save(fakeCategory({ userId: userOther.id }))

  await db
    .getRepository(Recipe)
    .save([
      fakeRecipe({ categoryId: category1.id }),
      fakeRecipe({ categoryId: category2.id }),
    ])

  const { find } = createCaller(authContext({ db }, user))
  const userRecipes = await find()

  expect(userRecipes).toHaveLength(1)
  expect(userRecipes[0]).toMatchObject({
    id: expect.any(Number),
    categoryId: category1.id,
  })
})
