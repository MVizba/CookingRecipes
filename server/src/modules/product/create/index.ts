import { Product, productInsertSchema } from '@server/entities/product'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { Recipe } from '@server/entities/recipe'
import { z } from 'zod'

// Define a new schema that includes recipeId
const productCreateSchema = productInsertSchema.extend({
  recipeId: z.number().int().positive(),
})

export default authenticatedProcedure
  .use(provideRepos({ Product, Recipe }))
  .input(productCreateSchema) // Use the new schema
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
      cookingTime: productData.cookingTime,
      product: productData.product,
      instructions: productData.instructions,
      recipe,
    })

    const productCreated = await repos.Product.save(product)

    return productCreated
  })
