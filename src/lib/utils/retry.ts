import { logger } from '../logger';

interface RetryOptions {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    factor?: number;
}

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
    let lastError: any;

    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            if (i === maxRetries) break;

            logger.warn({ 
                msg: `Retry attempt ${i + 1}/${maxRetries} failed`, 
                error: error.message,
                delay 
            });

            await new Promise(resolve => setTimeout(resolve, delay));
            delay = Math.min(delay * factor, maxDelay);
        }
    }

    throw lastError;
}
