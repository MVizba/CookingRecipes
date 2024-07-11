import { Chance } from 'chance'

// Chance is a lightweight fake data generator.
// Faker.js is another popular library, but it is relatively slow to import.
// Also, if we are running tests in CI server, we want to use the same seed
// every time to make the tests deterministic.
export const random = process.env.CI ? Chance(1) : Chance()

/**
 * Creates a new user with a random email and password. We want a random email
 * as our E2E tests can run against a real database, and we don't want to
 * our tests to fail because of a duplicate email.
 */
export const fakeUser = () => ({
  email: random.email(),
  password: 'password.123',
})
