import { test, expect } from '@playwright/test'
import { loginNewUser, reportBug } from './utils/api'
import { random, fakeUser } from './utils/fakeData'

const fakeProject = () => ({
  name: random.company(),
})

test.describe.serial('see a project and its bugs', () => {
  const project = fakeProject()
  const user = fakeUser()

  test('user can create a project', async ({ page }) => {
    await loginNewUser(page, user)
    await page.goto('/dashboard')

    const projectList = page.getByTestId('projectList')
    await expect(projectList).toBeHidden()

    // click on a button to create a new project
    await page.getByTestId('createProject').click()

    // enter a project name
    const form = page.getByRole('form', { name: 'Project' })
    await form.getByRole('textbox', { name: 'Project name' }).fill(project.name)

    // click on a button to create a project
    // we are using a specific locator
    await form.locator('button[type="submit"]').click()

    // expect to see the project name in the list of projects
    await expect(projectList).toContainText(project.name)
  })

  test('can see project bugs', async ({ page }) => {
    // Give (Arrange)
    await loginNewUser(page, user)
    await page.goto('/dashboard')
    await page.getByTestId('viewProjectBugs').click()

    // expect to see the project id as the last part of the URL
    // slight coupling to the implementation, but it's fine for now
    await page.waitForURL(/.+\/\d+$/)
    const projectId = Number(page.url().split('/').pop())
    expect(projectId).toBeGreaterThan(0) // sanity check

    const bug = {
      projectId,
      code: '500',
      name: random.word({ capitalize: true }),
      stacktrace: random.sentence({ words: 10 }),
    }

    // creating a bug directly through the API
    const bugCreated = await reportBug(bug)
    expect(bugCreated).toMatchObject(bug) // sanity check

    // When (Act)
    // reload page to see fresh data
    await page.reload()

    // Then (Assert)
    // expect to see our created bug in the list of bugs
    const bugList = page.getByRole('list', { name: 'Bugs' })
    const bugLatest = bugList.getByRole('listitem').first()
    await expect(bugLatest).toContainText(bug.name)
    await expect(bugLatest).toContainText(bug.stacktrace)
  })

  test('can mark a bug as resolved', async ({ page }) => {
    // Give (Arrange)
    await loginNewUser(page, user)
    await page.goto('/dashboard')
    await page.getByTestId('viewProjectBugs').click()

    // When (Act)
    const bugList = page.getByRole('list', { name: 'Bugs' })
    const bugLatest = bugList.getByRole('listitem').first()
    // expect to see our created bug in the list of bugs
    // click on the button to mark the bug as resolved
    await bugLatest.getByTestId('resolveBug').click()

    // Then (Assert)
    // expect to see the bug marked as resolved
    await expect(bugLatest.getByTestId('bugResolved')).toContainText('Resolved')
  })
})
