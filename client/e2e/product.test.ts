import { test, expect } from '@playwright/test'
import { loginNewUser } from './utils/api'
import { fakeUser, fakeCategory, fakeRecipe, fakeProduct } from './utils/fakeData'

const user = fakeUser()
const category = fakeCategory()
const recipe = fakeRecipe()
const product = fakeProduct()

test.describe.serial('Create a category, recipe, product, and delete a category', () => {
  test.beforeEach(async ({ page }) => {
    try {
      await loginNewUser(page, user)
      console.log('User logged in successfully')
    } catch (error) {
      console.log('Error in beforeEach:', error)
      throw error
    }
  })

  test('user can create a category', async ({ page }) => {
    await page.goto('/dashboard')

    await page.getByRole('textbox').click()
    await page.getByRole('textbox').fill(category.name)
    await page.getByRole('textbox').press('Enter')

    await page
      .getByTestId('categoryList')
      .locator('div')
      .filter({ hasText: category.name })
      .nth(0)
      .click()

    await expect(page.locator(`h3:has-text("${category.name}")`).first()).toBeVisible()
  })

  test('user can create a recipe', async ({ page }) => {
    await page.goto('/dashboard')

    await page.getByRole('textbox').click()
    await page.getByRole('textbox').fill(category.name)
    await page.getByRole('textbox').press('Enter')

    await page
      .getByTestId('categoryList')
      .locator('div')
      .filter({ hasText: category.name })
      .nth(0)
      .click()

    await expect(page.locator(`h3:has-text("${category.name}")`).first()).toBeVisible()

    await page.waitForSelector(`h3:has-text("${category.name}")`, { timeout: 15000 })
    await page.locator(`h3:has-text("${category.name}")`).first().click()

    await page.getByRole('button', { name: 'New Recipe' }).click()
    await page.getByRole('textbox').click()
    await page.getByRole('textbox').fill(recipe.name)
    await page.getByRole('textbox').press('Enter')

    await page.waitForSelector(`h3:has-text("${recipe.name}")`, { timeout: 15000 })
    await page.locator(`h3:has-text("${recipe.name}")`).first().click()
  })

  test('user can create a product', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('textbox').click()
    await page.getByRole('textbox').fill(category.name)
    await page.getByRole('textbox').press('Enter')

    await page
      .getByTestId('categoryList')
      .locator('div')
      .filter({ hasText: category.name })
      .nth(0)
      .click()

    await expect(page.locator(`h3:has-text("${category.name}")`).first()).toBeVisible()

    await page.waitForSelector(`h3:has-text("${category.name}")`, { timeout: 15000 })
    await page.locator(`h3:has-text("${category.name}")`).first().click()

    await page.getByRole('button', { name: 'New Recipe' }).click()
    await page.getByRole('textbox').click()
    await page.getByRole('textbox').fill(recipe.name)
    await page.getByRole('textbox').press('Enter')

    await page.waitForSelector(`h3:has-text("${recipe.name}")`, { timeout: 15000 })
    await page.locator(`h3:has-text("${recipe.name}")`).first().click()

    await page.getByRole('button', { name: 'Add Product' }).click()

    await page.getByRole('spinbutton').click()
    await page.getByRole('spinbutton').fill(product.cookingTime)

    await page.getByRole('textbox').first().click()
    await page.getByRole('textbox').first().fill(product.ingredients[0])
    await page.getByRole('textbox').first().press('Enter')

    await page.getByRole('textbox').nth(1).click()
    await page.getByRole('textbox').nth(1).fill(product.ingredients[1])
    await page.getByRole('textbox').nth(1).press('Enter')

    await page.getByRole('textbox').nth(2).click()
    await page.getByRole('textbox').nth(2).fill(product.ingredients[2])
    await page.getByRole('textbox').nth(2).press('Enter')

    await page.getByRole('img', { name: 'Delete' }).nth(2).click()

    await page.locator('textarea').click()
    await page.locator('textarea').fill(product.instructions)

    await page.getByRole('button', { name: 'Save' }).click()

    await expect(
      page.locator('div').filter({ hasText: new RegExp(`^${product.cookingTime} min\\.$`) })
    ).toBeVisible()
  })

  test('user can create and delete a category', async ({ page }) => {
    const newCategory = fakeCategory()

    await page.goto('/dashboard')
    await page.getByRole('textbox').click()
    await page.getByRole('textbox').fill(newCategory.name)
    await page.getByRole('textbox').press('Enter')
    await page
      .getByTestId('categoryList')
      .locator('div')
      .filter({ hasText: newCategory.name })
      .nth(0)
      .click()
    await expect(page.locator(`h3:has-text("${newCategory.name}")`).first()).toBeVisible()

    await page.getByRole('img', { name: 'Delete' }).nth(3).click()
    await page.getByRole('button', { name: 'Yes' }).click()
    await expect(page.locator(`h3:has-text("${newCategory.name}")`).first()).not.toBeVisible()
  })
})
