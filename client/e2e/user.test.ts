import { test, expect } from '@playwright/test'
import { loginNewUser } from 'utils/api'
import { fakeUser } from 'utils/fakeData'

const { email, password } = fakeUser()

// We are grouping these tests in a serial block to clearly
// indicate that these tests should be run in the provided order.
// However, ideally we would like to run each test in isolation.
// That would allow us to develop faster and to see more clearly
// which part of our flow is broken.
// In this particular case, we might want to run the signup and
// login tests one after the other because we want to make sure
// that the signup + login flow works.
test.describe.serial('signup and login sequence', () => {
  test('visitor can signup', async ({ page }) => {
    // Given (ARRANGE)
    await page.goto('/signup')
    const successMessage = page.getByTestId('successMessage')
    await expect(successMessage).toBeHidden() // sanity check

    // When (ACT)
    const form = page.getByRole('form', { name: 'Signup' })
    await form.locator('input[type="email"]').fill(email)
    await form.locator('input[type="password"]').fill(password)
    await form.locator('button[type="submit"]').click()

    // Then (ASSERT)
    await expect(successMessage).toBeVisible()
  })

  test('visitor can not access dashboard before login', async ({ page }) => {
    await page.goto('/dashboard')

    // user is redirected to login page
    await page.waitForURL('/login')
  })

  test('visitor can login', async ({ page }) => {
    // Given (ARRANGE)
    await page.goto('/login')
    const dashboardLink = page.getByRole('link', { name: 'Dashboard' })
    await expect(dashboardLink).toBeHidden()

    // When (ACT)
    const form = page.getByRole('form', { name: 'Login' })
    await form.locator('input[type="email"]').fill(email)
    await form.locator('input[type="password"]').fill(password)
    await form.locator('button[type="submit"]').click()

    // Then (ASSERT)
    await expect(dashboardLink).toBeVisible()

    // Refresh the page to make sure that the user is still logged in.
    await page.reload()
    await expect(dashboardLink).toBeVisible()
  })
})

// Running logout test in isolation.
test('visitor can logout', async ({ page }) => {
  // Given (ARRANGE)
  await loginNewUser(page)

  await page.goto('/dashboard')
  const logoutLink = page.getByRole('link', { name: 'Logout' })

  // When (ACT)
  await logoutLink.click()

  // Then (ASSERT)
  await expect(logoutLink).toBeHidden()

  // Ensure that we are redirected to the login page.
  // This test would break if we changed the login page URL,
  // but this is a signifcant change that we would want to
  // be aware of.
  await expect(page).toHaveURL('/login')

  // Refresh the page to make sure that the user is still logged out.
  await page.goto('/dashboard')
  await expect(logoutLink).toBeHidden()
  await expect(page).toHaveURL('/login')
})
