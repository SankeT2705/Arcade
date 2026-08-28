import config from '../config.js';

/**
 * Rate limiter middleware for Socket.IO and HTTP.
 * Uses token-bucket per IP for room creation, and per-socket for events.
 */

const ipBuckets = new Map();
const socketBuckets = new Map();

/**
 * Clean up stale entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of ipBuckets) {
    if (now - bucket.lastReset > config.rateLimit.roomCreationWindowMs * 2) {
      ipBuckets.delete(key);
    }
  }
  for (const [key, bucket] of socketBuckets) {
    if (now - bucket.lastReset > config.rateLimit.socketEventWindowMs * 10) {
      socketBuckets.delete(key);
    }
  }
}, 30_000);

/**
 * Check rate limit for room creation (per IP).
 * @param {string} ip
 * @returns {boolean} true if allowed, false if rate limited
 */
export function checkRoomCreationLimit(ip) {
  const now = Date.now();
  let bucket = ipBuckets.get(ip);

  if (!bucket || now - bucket.lastReset > config.rateLimit.roomCreationWindowMs) {
    bucket = { count: 0, lastReset: now };
    ipBuckets.set(ip, bucket);
  }

  bucket.count++;
  return bucket.count <= config.rateLimit.roomCreationMax;
}

/**
 * Check rate limit for socket events (per socket).
 * @param {string} socketId
 * @returns {boolean} true if allowed, false if rate limited
 */
export function checkSocketEventLimit(socketId) {
  const now = Date.now();
  let bucket = socketBuckets.get(socketId);

  if (!bucket || now - bucket.lastReset > config.rateLimit.socketEventWindowMs) {
    bucket = { count: 0, lastReset: now };
    socketBuckets.set(socketId, bucket);
  }

  bucket.count++;
  return bucket.count <= config.rateLimit.socketEventMax;
}

/**
 * Clean up a socket's rate limit bucket when they disconnect.
 * @param {string} socketId
 */
export function cleanupSocketLimit(socketId) {
  socketBuckets.delete(socketId);
}
