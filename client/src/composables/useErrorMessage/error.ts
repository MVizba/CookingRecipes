import { DEFAULT_SERVER_ERROR } from '@/consts'
import { TRPCClientError } from '@trpc/client'
import type { Ref } from 'vue'

/**
 * Calls the provided function and handles any errors that may occur.
 * If an error occurs, the error message is set to the provided `errorMessage` ref.
 *
 * @param errorMessage - A ref to a string that will hold the error message if an error occurs.
 * @param fn - The function to call.
 * @param doRethrow - Whether or not to re-throw the error after handling it.
 * @returns The result of the provided function, if no error occurred.
 * @throws The error that occurred, if `doRethrow` is `true`.
 */
export async function handleError(errorMessage: Ref<string>, fn: Function, doRethrow = false) {
  try {
    const result = await fn()

    // clear error message
    errorMessage.value = ''

    return result
  } catch (error) {
    errorMessage.value = getErrorMessage(error)

    if (doRethrow) throw error
  }
}

/**
 * Wraps the provided function in a try/catch block and sets the error message to
 * the provided `errorMessage` ref if an error occurs.
 */
export function withError<Args extends any[], Return, T extends (...args: Args) => Return>(
  errorMessage: Ref<string>,
  fn: T,
  doRethrow = false
): T {
  return ((...args: Args) => handleError(errorMessage, () => fn(...args), doRethrow)) as T
}

function getErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return DEFAULT_SERVER_ERROR
  }

  if (!(error instanceof TRPCClientError)) {
    return error.message
  }

  return error.data.message || error.message
}
