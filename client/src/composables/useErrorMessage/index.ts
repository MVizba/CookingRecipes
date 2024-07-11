import { withError } from './error'
import { ref, type Ref } from 'vue'

/**
 * A composable function that wraps a function with error handling logic.
 *
 * @param {T} fn - The original function to wrap with error handling logic.
 * @returns {[T, Ref<string>]} - A tuple containing the wrapped function and
 * a `Ref` object that holds an error message string.
 */
export default function useErrorMessage<
  Args extends unknown[],
  Return,
  T extends (...args: Args) => Return,
>(fn: T): [T, Ref<string>] {
  const errorMessage = ref('')

  return [withError(errorMessage, fn), errorMessage]
}
