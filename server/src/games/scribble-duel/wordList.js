/**
 * Scribble Duel — Word Bank
 * 150+ common, easily recognizable sketching words (3-5 letters & fun concepts).
 */

const words = [
  // ─── Short & Common 3-5 Letter Objects & Animals ───────────
  { word: 'car', difficulty: 'easy', category: 'objects' },
  { word: 'bat', difficulty: 'easy', category: 'objects' },
  { word: 'cat', difficulty: 'easy', category: 'animals' },
  { word: 'dog', difficulty: 'easy', category: 'animals' },
  { word: 'sun', difficulty: 'easy', category: 'nature' },
  { word: 'hat', difficulty: 'easy', category: 'objects' },
  { word: 'cup', difficulty: 'easy', category: 'objects' },
  { word: 'bed', difficulty: 'easy', category: 'objects' },
  { word: 'pen', difficulty: 'easy', category: 'objects' },
  { word: 'box', difficulty: 'easy', category: 'objects' },
  { word: 'bag', difficulty: 'easy', category: 'objects' },
  { word: 'bus', difficulty: 'easy', category: 'objects' },
  { word: 'van', difficulty: 'easy', category: 'objects' },
  { word: 'key', difficulty: 'easy', category: 'objects' },
  { word: 'eye', difficulty: 'easy', category: 'body' },
  { word: 'ear', difficulty: 'easy', category: 'body' },
  { word: 'egg', difficulty: 'easy', category: 'food' },
  { word: 'ice', difficulty: 'easy', category: 'nature' },
  { word: 'sea', difficulty: 'easy', category: 'nature' },
  { word: 'sky', difficulty: 'easy', category: 'nature' },
  { word: 'pie', difficulty: 'easy', category: 'food' },
  { word: 'tea', difficulty: 'easy', category: 'food' },
  { word: 'pan', difficulty: 'easy', category: 'objects' },
  { word: 'pot', difficulty: 'easy', category: 'objects' },
  { word: 'fan', difficulty: 'easy', category: 'objects' },
  { word: 'map', difficulty: 'easy', category: 'objects' },
  { word: 'rug', difficulty: 'easy', category: 'objects' },
  { word: 'cap', difficulty: 'easy', category: 'objects' },
  { word: 'tie', difficulty: 'easy', category: 'objects' },
  { word: 'fox', difficulty: 'easy', category: 'animals' },
  { word: 'pig', difficulty: 'easy', category: 'animals' },
  { word: 'cow', difficulty: 'easy', category: 'animals' },
  { word: 'hen', difficulty: 'easy', category: 'animals' },
  { word: 'bee', difficulty: 'easy', category: 'animals' },
  { word: 'ant', difficulty: 'easy', category: 'animals' },
  { word: 'owl', difficulty: 'easy', category: 'animals' },
  { word: 'ball', difficulty: 'easy', category: 'objects' },
  { word: 'star', difficulty: 'easy', category: 'nature' },
  { word: 'moon', difficulty: 'easy', category: 'nature' },
  { word: 'tree', difficulty: 'easy', category: 'nature' },
  { word: 'book', difficulty: 'easy', category: 'objects' },
  { word: 'door', difficulty: 'easy', category: 'objects' },
  { word: 'fish', difficulty: 'easy', category: 'animals' },
  { word: 'duck', difficulty: 'easy', category: 'animals' },
  { word: 'ring', difficulty: 'easy', category: 'objects' },
  { word: 'cake', difficulty: 'easy', category: 'food' },
  { word: 'bird', difficulty: 'easy', category: 'animals' },
  { word: 'lion', difficulty: 'easy', category: 'animals' },
  { word: 'frog', difficulty: 'easy', category: 'animals' },
  { word: 'bear', difficulty: 'easy', category: 'animals' },
  { word: 'wolf', difficulty: 'easy', category: 'animals' },
  { word: 'deer', difficulty: 'easy', category: 'animals' },
  { word: 'boat', difficulty: 'easy', category: 'objects' },
  { word: 'ship', difficulty: 'easy', category: 'objects' },
  { word: 'shoe', difficulty: 'easy', category: 'objects' },
  { word: 'sock', difficulty: 'easy', category: 'objects' },
  { word: 'kite', difficulty: 'easy', category: 'objects' },
  { word: 'drum', difficulty: 'easy', category: 'objects' },
  { word: 'bell', difficulty: 'easy', category: 'objects' },
  { word: 'milk', difficulty: 'easy', category: 'food' },
  { word: 'soup', difficulty: 'easy', category: 'food' },
  { word: 'rice', difficulty: 'easy', category: 'food' },
  { word: 'corn', difficulty: 'easy', category: 'food' },
  { word: 'pear', difficulty: 'easy', category: 'food' },
  { word: 'plum', difficulty: 'easy', category: 'food' },
  { word: 'flag', difficulty: 'easy', category: 'objects' },
  { word: 'hand', difficulty: 'easy', category: 'body' },
  { word: 'foot', difficulty: 'easy', category: 'body' },
  { word: 'face', difficulty: 'easy', category: 'body' },
  { word: 'nose', difficulty: 'easy', category: 'body' },
  { word: 'sofa', difficulty: 'easy', category: 'objects' },
  { word: 'fork', difficulty: 'easy', category: 'objects' },
  { word: 'iron', difficulty: 'easy', category: 'objects' },
  { word: 'coin', difficulty: 'easy', category: 'objects' },
  { word: 'gold', difficulty: 'easy', category: 'objects' },
  { word: 'tent', difficulty: 'easy', category: 'objects' },
  { word: 'rose', difficulty: 'easy', category: 'nature' },
  { word: 'leaf', difficulty: 'easy', category: 'nature' },
  { word: 'fire', difficulty: 'easy', category: 'nature' },
  { word: 'wind', difficulty: 'easy', category: 'nature' },
  { word: 'snow', difficulty: 'easy', category: 'nature' },
  { word: 'rain', difficulty: 'easy', category: 'nature' },
  { word: 'drop', difficulty: 'easy', category: 'nature' },
  { word: 'wave', difficulty: 'easy', category: 'nature' },
  { word: 'gift', difficulty: 'easy', category: 'objects' },
  { word: 'belt', difficulty: 'easy', category: 'objects' },
  { word: 'coat', difficulty: 'easy', category: 'objects' },
  { word: 'boot', difficulty: 'easy', category: 'objects' },
  { word: 'sand', difficulty: 'easy', category: 'nature' },
  { word: 'soap', difficulty: 'easy', category: 'objects' },
  { word: 'comb', difficulty: 'easy', category: 'objects' },
  { word: 'lock', difficulty: 'easy', category: 'objects' },
  { word: 'lamp', difficulty: 'easy', category: 'objects' },
  { word: 'bulb', difficulty: 'easy', category: 'objects' },
  { word: 'oven', difficulty: 'easy', category: 'objects' },
  { word: 'bowl', difficulty: 'easy', category: 'objects' },
  { word: 'tray', difficulty: 'easy', category: 'objects' },
  { word: 'dish', difficulty: 'easy', category: 'objects' },
  { word: 'nest', difficulty: 'easy', category: 'nature' },
  { word: 'wing', difficulty: 'easy', category: 'body' },
  { word: 'tail', difficulty: 'easy', category: 'body' },
  { word: 'horn', difficulty: 'easy', category: 'body' },
  { word: 'apple', difficulty: 'easy', category: 'food' },
  { word: 'mango', difficulty: 'easy', category: 'food' },
  { word: 'lemon', difficulty: 'easy', category: 'food' },
  { word: 'melon', difficulty: 'easy', category: 'food' },
  { word: 'bread', difficulty: 'easy', category: 'food' },
  { word: 'pizza', difficulty: 'easy', category: 'food' },
  { word: 'onion', difficulty: 'easy', category: 'food' },
  { word: 'chair', difficulty: 'easy', category: 'objects' },
  { word: 'table', difficulty: 'easy', category: 'objects' },
  { word: 'house', difficulty: 'easy', category: 'objects' },
  { word: 'train', difficulty: 'easy', category: 'objects' },
  { word: 'plane', difficulty: 'easy', category: 'objects' },
  { word: 'clock', difficulty: 'easy', category: 'objects' },
  { word: 'phone', difficulty: 'easy', category: 'objects' },
  { word: 'mouse', difficulty: 'easy', category: 'animals' },
  { word: 'snake', difficulty: 'easy', category: 'animals' },
  { word: 'tiger', difficulty: 'easy', category: 'animals' },
  { word: 'horse', difficulty: 'easy', category: 'animals' },
  { word: 'zebra', difficulty: 'easy', category: 'animals' },
  { word: 'panda', difficulty: 'easy', category: 'animals' },
  { word: 'koala', difficulty: 'easy', category: 'animals' },
  { word: 'shark', difficulty: 'easy', category: 'animals' },
  { word: 'whale', difficulty: 'easy', category: 'animals' },
  { word: 'crown', difficulty: 'easy', category: 'objects' },
  { word: 'sword', difficulty: 'easy', category: 'objects' },
  { word: 'shield', difficulty: 'easy', category: 'objects' },
  { word: 'brush', difficulty: 'easy', category: 'objects' },
  { word: 'radio', difficulty: 'easy', category: 'objects' },
  { word: 'watch', difficulty: 'easy', category: 'objects' },
  { word: 'shirt', difficulty: 'easy', category: 'objects' },
  { word: 'pants', difficulty: 'easy', category: 'objects' },
  { word: 'dress', difficulty: 'easy', category: 'objects' },
  { word: 'glass', difficulty: 'easy', category: 'objects' },
  { word: 'spoon', difficulty: 'easy', category: 'objects' },
  { word: 'plate', difficulty: 'easy', category: 'objects' },
  { word: 'knife', difficulty: 'easy', category: 'objects' },
  { word: 'cloud', difficulty: 'easy', category: 'nature' },
  { word: 'beach', difficulty: 'easy', category: 'nature' },
  { word: 'river', difficulty: 'easy', category: 'nature' },
  { word: 'grass', difficulty: 'easy', category: 'nature' },
  { word: 'earth', difficulty: 'easy', category: 'nature' },
  { word: 'plant', difficulty: 'easy', category: 'nature' },
  { word: 'smoke', difficulty: 'easy', category: 'nature' },
  { word: 'storm', difficulty: 'easy', category: 'nature' },
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
