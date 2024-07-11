import { Category } from '@server/entities/category'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const categoryIdSchema = z.number()

export default authenticatedProcedure
  .input(categoryIdSchema)
  .mutation(async ({ input: categoryId, ctx: { db, authUser } }) => {
    const category = await db.getRepository(Category).findOne({
      where: {
        id: categoryId,
        userId: authUser.id,
      },
      relations: ['user'],
    })

    if (!category || category.userId !== authUser.id) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Category with id ${categoryId} was not found or does not belong to the authenticated user`,
      })
    }

    await db.getRepository(Category).remove(category)

    return { success: true }
  })
