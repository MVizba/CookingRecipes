import { Recipe, recipeInsertSchema } from '@server/entities/recipe'
import { Category } from '@server/entities/category'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ Recipe, Category }))
  .input(recipeInsertSchema)
  .mutation(async ({ input: recipeData, ctx: { authUser, repos } }) => {
    const category = await repos.Category.findOne({
      where: {
        id: recipeData.categoryId,
        userId: authUser.id,
      },
    })

    if (!category) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You do not own this category',
      })
    }

    const recipe = {
      ...recipeData,
      category,
    }

    const recipeCreated = await repos.Recipe.save(recipe)

    return recipeCreated
  })
