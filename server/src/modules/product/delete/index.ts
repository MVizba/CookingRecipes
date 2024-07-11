import { Product } from '@server/entities/product'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const productIdSchema = z.number()

export default authenticatedProcedure
  .input(productIdSchema)
  .mutation(async ({ input: productId, ctx: { db, authUser } }) => {
    const product = await db.getRepository(Product).findOne({
      where: {
        id: productId,
        recipe: {
          category: {
            userId: authUser.id,
          },
        },
      },
      relations: ['recipe', 'recipe.category'],
    })

    if (!product || product.recipe.category.userId !== authUser.id) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with id ${productId} was not found or does not belong to the authenticated user through recipe ownership`,
      })
    }

    await db.getRepository(Product).remove(product)

    return { success: true }
  })
