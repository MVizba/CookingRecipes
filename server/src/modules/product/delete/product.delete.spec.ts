import { authContext } from '@tests/utils/context'
import {
  fakeUser,
  fakeCategory,
  fakeRecipe,
  fakeProduct,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User, Category, Recipe, Product } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import productRouter from '..'
import { DataSource } from 'typeorm'

const createCaller = createCallerFactory(productRouter)

describe('Product Deletion Endpoint', () => {
  let db: DataSource

  beforeAll(async () => {
    db = await createTestDatabase()
  })

  afterAll(async () => {
    await db.close()
  })

  it('should delete a product successfully if it belongs to a recipe owned by the authenticated user', async () => {
    const user = await db.getRepository(User).save(fakeUser())
    const category = await db
      .getRepository(Category)
      .save(fakeCategory({ userId: user.id }))
    const recipe = await db
      .getRepository(Recipe)
      .save(fakeRecipe({ categoryId: category.id }))
    const product = await db
      .getRepository(Product)
      .save(fakeProduct({ recipeId: recipe.id }))

    const { delete: deleteProduct } = createCaller(authContext({ db }, user))

    const result = await deleteProduct(product.id)

    expect(result).toEqual({ success: true })

    const deletedProduct = await db
      .getRepository(Product)
      .findOne({ where: { id: product.id } })
    expect(deletedProduct).toBeNull()
  })

  it('should throw an error if the product does not belong to a recipe owned by the authenticated user', async () => {
    const user = await db.getRepository(User).save(fakeUser())
    const otherUser = await db.getRepository(User).save(fakeUser())
    const category = await db
      .getRepository(Category)
      .save(fakeCategory({ userId: otherUser.id }))
    const recipe = await db
      .getRepository(Recipe)
      .save(fakeRecipe({ categoryId: category.id }))
    const product = await db
      .getRepository(Product)
      .save(fakeProduct({ recipeId: recipe.id }))

    const { delete: deleteProduct } = createCaller(authContext({ db }, user))

    await expect(deleteProduct(product.id)).rejects.toThrowError(
      `Product with id ${product.id} was not found or does not belong to the authenticated user through recipe ownership`
    )
  })
})
