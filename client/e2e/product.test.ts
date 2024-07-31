import { test, expect } from '@playwright/test'
import { loginNewUser } from './utils/api'
import { fakeUser, random } from './utils/fakeData'

const fakeProduct = () => ({
  cookingTime: random.integer({ min: 1, max: 120 }).toString(),
  ingredients: [random.word(), random.word(), random.word()],
  instructions: random.sentence(),
  url: '',
})

const fakeCategory = () => ({
  name: random.company(),
})

const user = fakeUser()

const { email, password } = fakeUser()

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

test.describe.serial('User can create a category, recipe, and product', () => {
  const category = fakeCategory()
  const product = fakeProduct()

  test.beforeEach(async ({ page }) => {
    await loginNewUser(page, user)
  })

  test('user can create a category', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('button', { name: 'Add a new category' }).click()
    const categoryInput = page.locator('input[name="categoryName"]') // Adjust the name attribute to match your input field
    await categoryInput.fill(category.name)
    await categoryInput.press('Enter')
    await expect(page.getByRole('heading', { name: category.name })).toBeVisible()
  })

  test('user can create a recipe', async ({ page }) => {
    await page.getByRole('heading', { name: category.name }).click()
    await page.getByRole('button', { name: 'New Recipe' }).click()
    const recipeInput = page.locator('input[name="recipeName"]') // Adjust the name attribute to match your input field
    await recipeInput.fill('Test Recipe')
    await recipeInput.press('Enter')
    await expect(page.getByRole('heading', { name: 'Test Recipe' })).toBeVisible()
  })

  test('user can create a product', async ({ page }) => {
    await page.getByRole('heading', { name: 'Test Recipe' }).click()
    await page.getByRole('button', { name: 'Add Product' }).click()

    const cookingTimeInput = page.locator('input[name="cookingTime"]') // Adjust the name attribute to match your input field
    await cookingTimeInput.fill(product.cookingTime)

    for (const ingredient of product.ingredients) {
      const ingredientInput = page.locator('input[name="ingredient"]') // Adjust the name attribute to match your input field
      await ingredientInput.fill(ingredient)
      await ingredientInput.press('Enter')
    }

    const instructionsTextarea = page.locator('textarea[name="instructions"]')
    await instructionsTextarea.fill(product.instructions)

    const urlInput = page.locator('input[name="url"]')
    await urlInput.fill(product.url)

    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText(product.instructions)).toBeVisible()
  })

  test('user can delete the product and category', async ({ page }) => {
    await page.getByRole('button', { name: 'Return to Category' }).click()
    await page.getByRole('button', { name: 'Return' }).click()
    await expect(page.getByRole('heading', { name: category.name })).toBeVisible()

    // Delete the category
    await page.getByRole('img', { name: 'Delete' }).click()
    await page.getByRole('button', { name: 'Yes' }).click()
    await expect(page.getByRole('heading', { name: category.name })).not.toBeVisible()
  })
})
