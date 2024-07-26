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

describe('Product Edit Endpoint', () => {
  let db: DataSource

  beforeAll(async () => {
    db = await createTestDatabase()
  })

  afterAll(async () => {
    await db.close()
  })

  it('should edit a product successfully if it belongs to a recipe owned by the authenticated user', async () => {
    const db = await createTestDatabase()
    const user = await db.getRepository(User).save(fakeUser())
    const category = await db
      .getRepository(Category)
      .save(fakeCategory({ userId: user.id }))
    const recipe = await db
      .getRepository(Recipe)
      .save(fakeRecipe({ categoryId: category.id }))
    const product = await db
      .getRepository(Product)
      .save(fakeProduct({ recipe }))

    recipe.product = product
    await db.getRepository(Recipe).save(recipe)

    const { edit } = createCaller(authContext({ db }, user))

    const updatedProductData = {
      id: product.id,
      cookingTime: 60,
      product: 'Updated Product Ingredient',
      instructions: 'Updated Instructions',
    }

    const editedProduct = await edit(updatedProductData)

    expect(editedProduct).toMatchObject({
      id: product.id,
      cookingTime: updatedProductData.cookingTime,
      product: updatedProductData.product,
      instructions: updatedProductData.instructions,
    })
  })

  it('should throw an error if the product does not belong to a recipe owned by the authenticated user', async () => {
    const db = await createTestDatabase()
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
      .save(fakeProduct({ recipe }))

    recipe.product = product
    await db.getRepository(Recipe).save(recipe)

    const { edit } = createCaller(authContext({ db }, user))

    const updatedProductData = {
      id: product.id,
      cookingTime: 60,
      product: 'Updated Product Ingredient',
      instructions: 'Updated Instructions',
    }

    await expect(edit(updatedProductData)).rejects.toThrowError(
      `Product not found or does not belong to the authenticated user`
    )
  })
})
