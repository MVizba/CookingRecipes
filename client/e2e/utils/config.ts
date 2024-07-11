import 'dotenv/config'

export const apiOrigin = process.env.VITE_API_ORIGIN as string
export const apiPath = process.env.VITE_API_PATH as string

if (typeof apiOrigin !== 'string') {
  throw new Error('VITE_API_ORIGIN is not defined')
}

if (typeof apiPath !== 'string') {
  throw new Error('VITE_API_PATH is not defined')
}
