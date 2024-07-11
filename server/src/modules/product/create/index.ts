import { Product, productInsertSchema } from '@server/entities/product'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { Recipe } from '@server/entities/recipe'

export default authenticatedProcedure
  .use(provideRepos({ Product, Recipe }))
  .input(productInsertSchema)
  .mutation(async ({ input: productData, ctx: { authUser, repos } }) => {
    const recipe = await repos.Recipe.findOne({
      where: { id: productData.recipeId, category: { userId: authUser.id } },
      relations: ['category'],
    })

    if (!recipe) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Recipe does not belong to the user',
      })
    }

    const product = repos.Product.create({
      ...productData,
      recipe,
    })

    const productCreated = await repos.Product.save(product)

    return productCreated
  })
