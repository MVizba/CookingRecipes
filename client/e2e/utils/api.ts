import { apiOrigin, apiPath } from './config'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@mono/server/src/shared/trpc'
import { fakeUser } from './fakeData'
import type { Page } from '@playwright/test'
import superjson from 'superjson'

const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${apiOrigin}${apiPath}`,
    }),
  ],
})

/**
 * Logs in a new user by signing them up and logging them in with the provided
 * user login information.
 */
export async function loginNewUser(page: Page, userLogin = fakeUser()) {
  try {
    await trpc.user.signup.mutate(userLogin)
  } catch (error) {
    // ignore cases when user already exists
  }

  const { accessToken } = await trpc.user.login.mutate(userLogin)

  await page.goto('/')

  // unfortunate that we are dealing with page internals and
  // implementation details here, but as long as we make sure that
  // this logic is in one place and it does not spill into tests,
  // we should be fine.
  await page.evaluate(
    ({ accessToken }) => {
      localStorage.setItem('token', accessToken)
    },
    { accessToken }
  )

  // returning the only thing that was generated inside (fakeUser)
  // in case we want to make assertions based on generated user data
  return userLogin
}

export const reportBug = trpc.bug.report.mutate
