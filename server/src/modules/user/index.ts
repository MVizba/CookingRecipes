import { router } from '@server/trpc'
import login from './login'
import signup from './signup'

export default router({
  login,

  // We could name it create, signup, createUser, signupUser...
  // This time we have chosen to name it signup. Then, this name
  // suggests that this is public user signup procedure, in contrast
  // to a possible direct user creation, which might be available
  // some time in the future for administators.
  signup,
})
