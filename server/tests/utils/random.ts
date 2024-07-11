import { Chance } from 'chance'
import config from '@server/config'

// Chance is a lightweight fake data generator.
// Faker.js is another popular library, but it is relatively slow to import.
// Also, if we are running tests in CI server, we want to use the same seed
// every time to make the tests deterministic.
export const random = config.isCi ? Chance(1) : Chance()
