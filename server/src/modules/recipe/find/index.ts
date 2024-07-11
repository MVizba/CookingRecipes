import { Recipe, type RecipeBare } from '@server/entities/recipe'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { Category } from '@server/entities/category'
import { In } from 'typeorm'

export default authenticatedProcedure.query(
  async ({ ctx: { authUser, db } }) => {
    const userCategories = await db.getRepository(Category).find({
      where: { userId: authUser.id },
      select: ['id'],
    })

    const categoryIds = userCategories.map((category) => category.id)

    const recipes = (await db.getRepository(Recipe).find({
      where: {
        category: In(categoryIds),
      },
      order: { id: 'ASC' },
    })) as RecipeBare[]

    return recipes
  }
)
