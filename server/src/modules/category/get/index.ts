import { Category, categorySchema } from '@server/entities/category'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ Category }))
  .input(categorySchema.shape.id)
  .query(async ({ input: categoryId, ctx: { authUser, repos } }) => {
    const category = await repos.Category.findOne({
      where: { id: categoryId, userId: authUser.id },
      relations: ['recipes', 'recipes.product'],
    })

    if (!category) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Category was not found`,
      })
    }

    return category
  })
