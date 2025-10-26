import { Ollama } from 'ollama';
import { OLLAMA_BASE_URL, OLLAMA_TIMEOUT, FALLBACK_MODELS } from './constants';

export interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
}

export interface OllamaListResponse {
  models: OllamaModel[];
}

/**
 * Custom error class for Ollama-related errors
 */
export class OllamaError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'OllamaError';
  }
}

/**
 * Initialize Ollama client with configured base URL and timeout
 */
export function initOllamaClient(): Ollama {
  return new Ollama({
    host: OLLAMA_BASE_URL,
  });
}

/**
 * Validates that Ollama is running and accessible at the configured URL
 * @throws {OllamaError} If Ollama is not running or not accessible
 */
export async function validateOllamaConnection(): Promise<void> {
  const client = initOllamaClient();

  try {
    // Try to list models as a simple health check
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT);

    await client.list();
    clearTimeout(timeoutId);
  } catch (error) {
    if (error instanceof Error) {
      // Check for common connection errors
      if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
        throw new OllamaError(
          `Cannot connect to Ollama at ${OLLAMA_BASE_URL}. Is Ollama running?\n` +
          `Start Ollama with: ollama serve`,
          error
        );
      }

      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        throw new OllamaError(
          `Connection to Ollama timed out after ${OLLAMA_TIMEOUT / 1000} seconds`,
          error
        );
      }

      throw new OllamaError(`Failed to connect to Ollama: ${error.message}`, error);
    }

    throw new OllamaError('Failed to connect to Ollama: Unknown error', error);
  }
}

/**
 * Fetches list of available models from Ollama
 */
export async function getAvailableModels(): Promise<string[]> {
  const client = initOllamaClient();

  try {
    const response = await client.list();
    return response.models.map(model => model.name);
  } catch (error) {
    throw new OllamaError(
      'Failed to fetch available models',
      error
    );
  }
}

/**
 * Checks if a specific model is available in Ollama
 */
export async function checkModelAvailability(modelName: string): Promise<boolean> {
  const availableModels = await getAvailableModels();

  // Normalize model names for comparison (some might not have :latest suffix)
  const normalizedRequested = normalizeModelName(modelName);

  return availableModels.some(model => {
    const normalizedAvailable = normalizeModelName(model);
    return normalizedAvailable === normalizedRequested;
  });
}

/**
 * Normalizes model name for comparison
 * Ensures consistent format with :latest tag if no tag is specified
 */
function normalizeModelName(modelName: string): string {
  // If model already has a tag (contains :), return as-is
  if (modelName.includes(':')) {
    return modelName;
  }
  // Otherwise, add :latest tag
  return `${modelName}:latest`;
}

/**
 * Finds the best available model from the requested model or fallback list
 * @param requestedModel The model requested by the user
 * @returns The best available model name
 * @throws {OllamaError} If no models are available
 */
export async function findBestAvailableModel(requestedModel: string): Promise<string> {
  // First, try the requested model
  const isRequestedAvailable = await checkModelAvailability(requestedModel);
  if (isRequestedAvailable) {
    return normalizeModelName(requestedModel);
  }

  // If requested model is not available, try fallbacks
  for (const fallbackModel of FALLBACK_MODELS) {
    const isAvailable = await checkModelAvailability(fallbackModel);
    if (isAvailable) {
      return fallbackModel;
    }
  }

  // No models available - provide helpful error
  const availableModels = await getAvailableModels();

  if (availableModels.length === 0) {
    throw new OllamaError(
      `No models available in Ollama.\n` +
      `Pull a model with: ollama pull ${requestedModel}`
    );
  }

  throw new OllamaError(
    `Model "${requestedModel}" not found and no fallback models available.\n` +
    `Available models: ${availableModels.join(', ')}\n` +
    `Pull the requested model with: ollama pull ${requestedModel}`
  );
}

/**
 * Generates a completion from Ollama with the specified model and prompt
 * @param model The model to use for generation
 * @param prompt The prompt to send to the model
 * @returns The generated text response
 */
export async function generateCompletion(
  model: string,
  prompt: string
): Promise<string> {
  const client = initOllamaClient();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT);

    const response = await client.generate({
      model,
      prompt,
      stream: false,
    });

    clearTimeout(timeoutId);

    return response.response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        throw new OllamaError(
          `Request timed out after ${OLLAMA_TIMEOUT / 1000} seconds`,
          error
        );
      }

      throw new OllamaError(`Failed to generate completion: ${error.message}`, error);
    }

    throw new OllamaError('Failed to generate completion: Unknown error', error);
  }
}
