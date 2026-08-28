/**
 * Shared utility functions.
 */

/**
 * Generate a unique player ID (persisted in localStorage).
 * @returns {string}
 */
export function getPlayerId() {
  const key = 'duo-arcade-player-id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = 'p_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem(key, id);
  }
  return id;
}

/**
 * Get/set player name (persisted in localStorage).
 * @param {string} [name] - If provided, saves the name
 * @returns {string}
 */
export function getPlayerName(name) {
  const key = 'duo-arcade-player-name';
  if (name) {
    localStorage.setItem(key, name);
    return name;
  }
  return localStorage.getItem(key) || '';
}

/**
 * Generate a random fun default name.
 * @returns {string}
 */
export function generateDefaultName() {
  const adjectives = ['Swift', 'Bold', 'Chill', 'Epic', 'Keen', 'Rad', 'Slick', 'Turbo', 'Neon', 'Pixel'];
  const nouns = ['Fox', 'Hawk', 'Panda', 'Tiger', 'Wolf', 'Bear', 'Lynx', 'Otter', 'Raven', 'Shark'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}`;
}

/**
 * Conditionally join class names.
 * @param  {...any} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format milliseconds to MM:SS.
 * @param {number} ms
 * @returns {string}
 */
export function formatTime(ms) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Copy text to clipboard.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

/**
 * Throttle a function to run at most once every `limit` ms
 * @param {Function} func
 * @param {number} limit
 * @returns {Function}
 */
export function throttle(func, limit) {
  let inThrottle = false;
  let lastArgs = null;
  let lastContext = null;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          func.apply(lastContext, lastArgs);
          lastArgs = null;
          lastContext = null;
        }
      }, limit);
    } else {
      lastArgs = args;
      lastContext = this;
    }
  };
}

