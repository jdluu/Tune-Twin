import { logger } from '../logger';

interface RetryOptions {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    factor?: number;
}

/**
 * Executes a function with exponential backoff retry logic.
 *
 * @param fn - The async function to execute.
 * @param options - Configuration options for retries.
 * @returns The result of the function execution.
 * @throws The last error encountered if all retries fail.
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxRetries = 3,
        initialDelay = 500,
        maxDelay = 5000,
        factor = 2
    } = options;

    let delay = initialDelay;
    let lastError: unknown;

    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await fn();
        } catch (error: unknown) {
            lastError = error;
            if (i === maxRetries) break;

            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.warn({ 
                msg: `Retry attempt ${i + 1}/${maxRetries} failed`, 
                error: errorMessage,
                delay 
            });

            await new Promise(resolve => setTimeout(resolve, delay));
            delay = Math.min(delay * factor, maxDelay);
        }
    }

    throw lastError;
}
