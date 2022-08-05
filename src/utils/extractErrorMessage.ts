export function extractErrorMessage<Err = any>(error: Err) {
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error instanceof Error) return error.message;
  return String(error)
}