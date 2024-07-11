import { Product, productSchema } from '@server/entities/product'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ Product }))
  .input(productSchema.shape.id)
  .query(async ({ input: productId, ctx: { authUser, repos } }) => {
    const product = await repos.Product.findOne({
      where: {
        id: productId,
        recipe: { category: { userId: authUser.id } },
      },
      relations: ['recipe', 'recipe.category'],
    })

    if (!product) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product was not found`,
      })
    }

    return product
  })
