import { Product, productSchema } from '@server/entities/product'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { z } from 'zod'

const editProductSchema = productSchema.pick({
  id: true,
  cookingTime: true,
  product: true,
  instructions: true,
})

export default authenticatedProcedure
  .use(provideRepos({ Product }))
  .input(editProductSchema)
  .mutation(async ({ input, ctx: { authUser, repos } }) => {
    const { id, cookingTime, product, instructions } = input

    const existingProduct = await repos.Product.findOne({
      where: {
        id,
        recipe: {
          category: {
            userId: authUser.id,
          },
        },
      },
      relations: ['recipe', 'recipe.category'],
    })

    if (!existingProduct) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message:
          'Product not found or does not belong to the authenticated user',
      })
    }

    existingProduct.cookingTime = cookingTime
    existingProduct.product = product
    existingProduct.instructions = instructions

    await repos.Product.save(existingProduct)

    return existingProduct
  })
