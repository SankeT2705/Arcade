/**
 * Scribble Duel — Word Bank
 * 100+ words across 2 difficulty levels (easy/hard).
 */

const words = [
  // ─── Easy Words ────────────────────────────────────────
  { word: 'cat', difficulty: 'easy', category: 'animals' },
  { word: 'dog', difficulty: 'easy', category: 'animals' },
  { word: 'fish', difficulty: 'easy', category: 'animals' },
  { word: 'bird', difficulty: 'easy', category: 'animals' },
  { word: 'house', difficulty: 'easy', category: 'objects' },
  { word: 'tree', difficulty: 'easy', category: 'nature' },
  { word: 'sun', difficulty: 'easy', category: 'nature' },
  { word: 'moon', difficulty: 'easy', category: 'nature' },
  { word: 'star', difficulty: 'easy', category: 'nature' },
  { word: 'pizza', difficulty: 'easy', category: 'food' },
  { word: 'guitar', difficulty: 'easy', category: 'objects' },
  { word: 'book', difficulty: 'easy', category: 'objects' },
  { word: 'clock', difficulty: 'easy', category: 'objects' },
  { word: 'phone', difficulty: 'easy', category: 'objects' },
  { word: 'car', difficulty: 'easy', category: 'objects' },
  { word: 'boat', difficulty: 'easy', category: 'objects' },
  { word: 'hat', difficulty: 'easy', category: 'objects' },
  { word: 'flower', difficulty: 'easy', category: 'nature' },
  { word: 'balloon', difficulty: 'easy', category: 'objects' },
  { word: 'cake', difficulty: 'easy', category: 'food' },
  { word: 'bicycle', difficulty: 'easy', category: 'objects' },
  { word: 'rainbow', difficulty: 'easy', category: 'nature' },
  { word: 'snowman', difficulty: 'easy', category: 'objects' },
  { word: 'umbrella', difficulty: 'easy', category: 'objects' },
  { word: 'camera', difficulty: 'easy', category: 'objects' },
  { word: 'apple', difficulty: 'easy', category: 'food' },
  { word: 'banana', difficulty: 'easy', category: 'food' },
  { word: 'chair', difficulty: 'easy', category: 'objects' },
  { word: 'table', difficulty: 'easy', category: 'objects' },
  { word: 'cup', difficulty: 'easy', category: 'objects' },
  { word: 'shoe', difficulty: 'easy', category: 'objects' },
  { word: 'sock', difficulty: 'easy', category: 'objects' },
  { word: 'door', difficulty: 'easy', category: 'objects' },
  { word: 'window', difficulty: 'easy', category: 'objects' },
  { word: 'key', difficulty: 'easy', category: 'objects' },
  { word: 'bed', difficulty: 'easy', category: 'objects' },
  { word: 'pillow', difficulty: 'easy', category: 'objects' },
  { word: 'lamp', difficulty: 'easy', category: 'objects' },
  { word: 'pencil', difficulty: 'easy', category: 'objects' },
  { word: 'computer', difficulty: 'easy', category: 'objects' },
  { word: 'mouse', difficulty: 'easy', category: 'objects' },
  { word: 'keyboard', difficulty: 'easy', category: 'objects' },
  { word: 'television', difficulty: 'easy', category: 'objects' },
  { word: 'radio', difficulty: 'easy', category: 'objects' },
  { word: 'bus', difficulty: 'easy', category: 'objects' },
  { word: 'train', difficulty: 'easy', category: 'objects' },
  { word: 'airplane', difficulty: 'easy', category: 'objects' },
  { word: 'helicopter', difficulty: 'easy', category: 'objects' },
  { word: 'cloud', difficulty: 'easy', category: 'nature' },
  { word: 'rain', difficulty: 'easy', category: 'nature' },
  { word: 'snow', difficulty: 'easy', category: 'nature' },
  { word: 'fire', difficulty: 'easy', category: 'nature' },
  { word: 'water', difficulty: 'easy', category: 'nature' },
  { word: 'mountain', difficulty: 'easy', category: 'nature' },
  { word: 'ocean', difficulty: 'easy', category: 'nature' },
  { word: 'beach', difficulty: 'easy', category: 'nature' },
  { word: 'sand', difficulty: 'easy', category: 'nature' },
  { word: 'grass', difficulty: 'easy', category: 'nature' },
  { word: 'leaf', difficulty: 'easy', category: 'nature' },
  { word: 'bridge', difficulty: 'easy', category: 'objects' },

  // ─── Hard Words ────────────────────────────────────────
  { word: 'democracy', difficulty: 'hard', category: 'concepts' },
  { word: 'nostalgia', difficulty: 'hard', category: 'concepts' },
  { word: 'gravity', difficulty: 'hard', category: 'science' },
  { word: 'evolution', difficulty: 'hard', category: 'science' },
  { word: 'telescope', difficulty: 'hard', category: 'objects' },
  { word: 'orchestra', difficulty: 'hard', category: 'concepts' },
  { word: 'volcano', difficulty: 'hard', category: 'nature' },
  { word: 'labyrinth', difficulty: 'hard', category: 'concepts' },
  { word: 'astronaut', difficulty: 'hard', category: 'people' },
  { word: 'lighthouse', difficulty: 'hard', category: 'objects' },
  { word: 'parachute', difficulty: 'hard', category: 'objects' },
  { word: 'skeleton', difficulty: 'hard', category: 'science' },
  { word: 'treasure', difficulty: 'hard', category: 'concepts' },
  { word: 'hurricane', difficulty: 'hard', category: 'nature' },
  { word: 'backpack', difficulty: 'hard', category: 'objects' },
  { word: 'fireworks', difficulty: 'hard', category: 'objects' },
  { word: 'compass', difficulty: 'hard', category: 'objects' },
  { word: 'waterfall', difficulty: 'hard', category: 'nature' },
  { word: 'calendar', difficulty: 'hard', category: 'objects' },
  { word: 'hourglass', difficulty: 'hard', category: 'objects' },
  { word: 'microscope', difficulty: 'hard', category: 'objects' },
  { word: 'thermometer', difficulty: 'hard', category: 'objects' },
  { word: 'magnet', difficulty: 'hard', category: 'objects' },
  { word: 'satellite', difficulty: 'hard', category: 'objects' },
  { word: 'submarine', difficulty: 'hard', category: 'objects' },
  { word: 'skyscraper', difficulty: 'hard', category: 'objects' },
  { word: 'pyramid', difficulty: 'hard', category: 'objects' },
  { word: 'statue', difficulty: 'hard', category: 'objects' },
  { word: 'museum', difficulty: 'hard', category: 'objects' },
  { word: 'library', difficulty: 'hard', category: 'objects' },
  { word: 'theater', difficulty: 'hard', category: 'objects' },
  { word: 'stadium', difficulty: 'hard', category: 'objects' },
  { word: 'hospital', difficulty: 'hard', category: 'objects' },
  { word: 'airport', difficulty: 'hard', category: 'objects' },
  { word: 'restaurant', difficulty: 'hard', category: 'objects' },
  { word: 'supermarket', difficulty: 'hard', category: 'objects' },
  { word: 'factory', difficulty: 'hard', category: 'objects' },
  { word: 'farm', difficulty: 'hard', category: 'objects' },
  { word: 'forest', difficulty: 'hard', category: 'nature' },
  { word: 'jungle', difficulty: 'hard', category: 'nature' },
  { word: 'desert', difficulty: 'hard', category: 'nature' },
  { word: 'island', difficulty: 'hard', category: 'nature' },
  { word: 'canyon', difficulty: 'hard', category: 'nature' },
  { word: 'cave', difficulty: 'hard', category: 'nature' },
  { word: 'glacier', difficulty: 'hard', category: 'nature' },
  { word: 'tornado', difficulty: 'hard', category: 'nature' },
  { word: 'earthquake', difficulty: 'hard', category: 'nature' },
  { word: 'tsunami', difficulty: 'hard', category: 'nature' },
];

/**
 * Get random words for a game session.
 * @param {number} count - Number of words to pick
 * @param {string} [difficulty] - Optional difficulty filter ('easy' or 'hard')
 * @returns {Array}
 */
export function getRandomWords(count = 6, difficulty = null) {
  let pool = difficulty ? words.filter((w) => w.difficulty === difficulty) : [...words];

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, Math.min(count, pool.length));
}

/**
 * Levenshtein distance for typo tolerance in guesses.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function levenshteinDistance(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

export default words;
