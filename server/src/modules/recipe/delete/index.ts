import { Recipe } from '@server/entities/recipe'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const recipeIdSchema = z.number()

export default authenticatedProcedure
  .input(recipeIdSchema)
  .mutation(async ({ input: recipeId, ctx: { db, authUser } }) => {
    const recipe = await db.getRepository(Recipe).findOne({
      where: {
        id: recipeId,
        category: {
          userId: authUser.id,
        },
      },
      relations: ['category'],
    })

    if (!recipe || recipe.category.userId !== authUser.id) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Recipe with id ${recipeId} was not found or does not belong to the authenticated user through category ownership`,
      })
    }

    await db.getRepository(Recipe).remove(recipe)

    return { success: true }
  })
