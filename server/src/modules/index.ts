import { router } from '../trpc'
import user from './user'
import category from './category'
import recipe from './recipe'
import product from './product'

export const appRouter = router({
  user,
  category,
  recipe,
  product,
})

export type AppRouter = typeof appRouter
