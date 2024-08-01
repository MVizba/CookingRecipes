import { Chance } from 'chance'

export const random = process.env.CI ? Chance(1) : Chance()

export const fakeUser = () => ({
  email: random.email(),
  password: 'password.123',
})

export const fakeCategory = () => ({
  name: random.company(),
})

export const fakeRecipe = () => ({
  name: `Recipe ${random.word()}`,
})

export const fakeProduct = () => ({
  cookingTime: random.integer({ min: 1, max: 120 }).toString(),
  ingredients: [random.word(), random.word(), random.word()],
  instructions: random.sentence(),
  url: '',
})
