import { router } from '@server/trpc'
import create from './create'
import get from './get'
import deleteProduct from './delete'

export default router({
  create,
  get,
  delete: deleteProduct,
})
