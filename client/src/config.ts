export const apiOrigin = (import.meta.env.VITE_API_ORIGIN as string) || window.location.origin
export const apiPath = (import.meta.env.VITE_API_PATH as string) || '/api/v1/trpc'
export const apiBase = `${apiOrigin}${apiPath}`

if (typeof apiOrigin !== 'string') {
  throw new Error('VITE_API_ORIGIN is not defined')
}

if (typeof apiPath !== 'string') {
  throw new Error('VITE_API_PATH is not defined')
}
