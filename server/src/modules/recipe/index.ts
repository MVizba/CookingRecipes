import { router } from '@server/trpc'
import create from './create'
import find from './find'
import get from './get'
import deleteRecipe from './delete'

export default router({
  create,
  find,
  get,
  delete: deleteRecipe,
})
