import { router } from '@server/trpc'
import create from './create'
import find from './find'
import get from './get'
import deleteCategory from './delete'

export default router({
  create,
  find,
  get,
  delete: deleteCategory,
})
