import type { User } from '@server/entities/user'
import type { Category } from '@server/entities/category'
import type { Recipe } from '@server/entities/recipe'
import type { Product } from '@server/entities/product'
import { random } from '@tests/utils/random'

const randomId = () => random.integer({ min: 1, max: 2147483647 })

/**
 * Generates a fake user with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeUser = <T extends Partial<User>>(overrides: T = {} as T) => ({
  id: randomId(),
  email: random.email(),
  password: 'Password.123!',
  ...overrides,
})

/**
 * Generates a fake category with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeCategory = <T extends Partial<Category>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  userId: randomId(),
  category_name: random.string(),
  ...overrides,
})

/**
 * Generates a fake recipe with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeRecipe = <T extends Partial<Recipe>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  categoryId: randomId(),
  recipe_name: random.string(),
  ...overrides,
})

/**
 * Generates a fake product with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeProduct = <T extends Partial<Product>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  recipeId: randomId(),
  name: random.string(),
  product: random.string(),
  instructions: random.sentence(),
  ...overrides,
})
