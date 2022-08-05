export class InvalidConfigurationError extends Error {
  constructor(message: string) {
    super(`[seo-tools] Invalid configuration\n${message}`)
  }
}