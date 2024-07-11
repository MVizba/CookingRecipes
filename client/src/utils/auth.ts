import type { AuthUser } from '@mono/server/src/shared/entities'

const TOKEN_KEY = 'token'

export function getStoredAccessToken(storage: Storage): string | null {
  return storage.getItem(TOKEN_KEY)
}

export function clearStoredAccessToken(storage: Storage) {
  storage.removeItem(TOKEN_KEY)
}

export function storeAccessToken(storage: Storage, token: string) {
  storage.setItem(TOKEN_KEY, token)
}

export function getUserFromToken(token: string): AuthUser {
  return JSON.parse(atob(token.split('.')[1])).user
}

export function getUserIdFromToken(token: string) {
  return getUserFromToken(token).id
}
