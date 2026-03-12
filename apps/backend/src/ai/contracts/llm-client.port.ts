/**
 * Defines the contract for text generation providers.
 */
export interface LlmClientPort {
  /**
   * Generates text from a plain prompt.
   */
  generateTextWithJsonResponse(prompt: string): Promise<string>;
}
