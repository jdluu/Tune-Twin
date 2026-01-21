import { logger } from '../logger';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitData {
  count: number;
  resetTime: number;
}

// Use temp directory for rate limit data
const RATE_LIMIT_DIR = path.join(os.tmpdir(), 'tune-twin-rate-limits');
const CLEANUP_INTERVAL = 60000; // 1 minute

// Ensure directory exists
async function ensureDir() {
  try {
    await fs.mkdir(RATE_LIMIT_DIR, { recursive: true });
  } catch {
    // Directory might already exist, ignore
  }
}

// Get file path for a key
function getFilePath(key: string): string {
  // Sanitize key to be filesystem-safe
  const sanitized = key.replace(/[^a-zA-Z0-9-_]/g, '_');
  return path.join(RATE_LIMIT_DIR, `${sanitized}.json`);
}

// Read rate limit data from file
async function readData(key: string): Promise<RateLimitData | null> {
  try {
    const filePath = getFilePath(key);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as RateLimitData;
  } catch {
    return null;
  }
}

// Write rate limit data to file
async function writeData(key: string, data: RateLimitData): Promise<void> {
  try {
    await ensureDir();
    const filePath = getFilePath(key);
    await fs.writeFile(filePath, JSON.stringify(data), 'utf-8');
  } catch (error) {
    logger.error({ msg: 'Failed to write rate limit data', key, error });
  }
}


export async function isRateLimited(key: string, config: RateLimitConfig): Promise<boolean> {
  const now = Date.now();
  const userData = await readData(key);

  if (!userData || now > userData.resetTime) {
    // Create new rate limit window
    await writeData(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return false;
  }

  // Increment count
  userData.count++;
  
  if (userData.count > config.maxRequests) {
    logger.warn({ msg: 'Rate limit exceeded', key, count: userData.count });
    await writeData(key, userData);
    return true;
  }

  await writeData(key, userData);
  return false;
}

// Cleanup expired files periodically
async function cleanupExpiredFiles() {
  try {
    await ensureDir();
    const files = await fs.readdir(RATE_LIMIT_DIR);
    const now = Date.now();

    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(RATE_LIMIT_DIR, file);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content) as RateLimitData;
        
        if (now > data.resetTime) {
          await fs.unlink(filePath);
        }
      } catch {
        // Ignore errors for individual files
      }
    }
  } catch (error) {
    logger.error({ msg: 'Cleanup failed', error });
  }
}

// Start cleanup interval (only in Node.js environment)
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredFiles, CLEANUP_INTERVAL);
}
