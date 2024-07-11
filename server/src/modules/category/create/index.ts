import { Category, categoryInsertSchema } from '@server/entities/category'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(categoryInsertSchema.omit({ userId: true }))
  .mutation(async ({ input: categoryData, ctx: { authUser, db } }) => {
    const category = {
      ...categoryData,
      userId: authUser.id,
    }

    const categoryCreated = await db.getRepository(Category).save(category)

    return categoryCreated
  })
