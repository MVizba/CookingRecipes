import { Category, type CategoryBare } from '@server/entities/category'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(
  async ({ ctx: { authUser, db } }) => {
    const userId = authUser.id

    const categories = (await db.getRepository(Category).find({
      where: { userId },
      order: { id: 'ASC' },
    })) as CategoryBare[]

    return categories
  }
)
