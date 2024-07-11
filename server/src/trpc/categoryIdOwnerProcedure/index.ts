import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { Category } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '../provideRepos'

export const categoryIdOwnerProcedure = authenticatedProcedure
  .use(provideRepos({ Category }))
  .input(
    z.object({
      categoryId: z.number(),
    })
  )
  .use(async ({ input: { categoryId }, ctx: { authUser, repos }, next }) => {
    const category = await repos.Category.findOne({
      select: {
        userId: true,
      },
      where: {
        id: categoryId,
      },
    })

    if (!category) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Category not found',
      })
    }

    if (category.userId !== authUser.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Category does not belong to the user',
      })
    }

    return next()
  })
