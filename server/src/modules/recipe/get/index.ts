import { Recipe, recipeSchema } from '@server/entities/recipe'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ Recipe }))
  .input(recipeSchema.shape.id)
  .query(async ({ input: recipeId, ctx: { authUser, repos } }) => {
    const recipe = await repos.Recipe.findOne({
      where: {
        id: recipeId,
        category: {
          userId: authUser.id,
        },
      },
      relations: ['product'],
    })

    if (!recipe) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Recipe was not found`,
      })
    }

    return recipe
  })
