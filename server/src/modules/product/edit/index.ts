import { Product, productSchema } from '@server/entities/product'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

const editProductSchema = productSchema.pick({
  id: true,
  cookingTime: true,
  product: true,
  instructions: true,
  url: true,
})

export default authenticatedProcedure
  .use(provideRepos({ Product }))
  .input(editProductSchema)
  .mutation(async ({ input, ctx: { authUser, repos } }) => {
    const { id, cookingTime, product, instructions, url } = input

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
    existingProduct.url = url

    await repos.Product.save(existingProduct)

    return existingProduct
  })
