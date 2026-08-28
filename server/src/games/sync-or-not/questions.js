/**
 * Sync or Not — Question Bank
 * Includes 40+ would-you-rather / this-or-that questions.
 * Tailored for an Indian audience (cricket, Bollywood, food, lifestyle) and psychological connections.
 */

const questions = [
  // ─── Indian Pop Culture & Sports ─────────────────────────
  {
    id: 1,
    category: 'culture',
    optionA: 'MS Dhoni',
    optionB: 'Virat Kohli',
  },
  {
    id: 2,
    category: 'culture',
    optionA: 'Arijit Singh',
    optionB: 'Sonu Nigam',
  },
  {
    id: 3,
    category: 'culture',
    optionA: 'Shah Rukh Khan',
    optionB: 'Salman Khan',
  },
  {
    id: 4,
    category: 'culture',
    optionA: '90s Bollywood Music',
    optionB: 'Modern Bollywood Music',
  },
  {
    id: 5,
    category: 'culture',
    optionA: 'Watch a Cricket Match live in a stadium',
    optionB: 'Watch a Bollywood Movie first-day-first-show',
  },
  {
    id: 6,
    category: 'culture',
    optionA: 'Mirzapur',
    optionB: 'Sacred Games',
  },
  {
    id: 7,
    category: 'culture',
    optionA: 'Dilwale Dulhania Le Jayenge (DDLJ)',
    optionB: 'Yeh Jawaani Hai Deewani (YJHD)',
  },
  {
    id: 8,
    category: 'culture',
    optionA: 'Rohit Sharma',
    optionB: 'Sachin Tendulkar',
  },

  // ─── Indian Food & Drink ───────────────────────────────
  {
    id: 101,
    category: 'food',
    optionA: 'Pani Puri',
    optionB: 'Vada Pav',
  },
  {
    id: 102,
    category: 'food',
    optionA: 'Masala Chai',
    optionB: 'Filter Coffee',
  },
  {
    id: 103,
    category: 'food',
    optionA: 'Butter Chicken',
    optionB: 'Paneer Tikka',
  },
  {
    id: 104,
    category: 'food',
    optionA: 'South Indian Breakfast (Idli/Dosa)',
    optionB: 'North Indian Breakfast (Chole Bhature/Paratha)',
  },
  {
    id: 105,
    category: 'food',
    optionA: 'Samosa',
    optionB: 'Kachori',
  },
  {
    id: 106,
    category: 'food',
    optionA: 'Biryani with Raita',
    optionB: 'Biryani with Salan',
  },
  {
    id: 107,
    category: 'food',
    optionA: 'Rasgulla',
    optionB: 'Gulab Jamun',
  },
  {
    id: 108,
    category: 'food',
    optionA: 'Maggi at midnight',
    optionB: 'Ice cream at midnight',
  },

  // ─── Indian Lifestyle & Travel ─────────────────────────
  {
    id: 201,
    category: 'lifestyle',
    optionA: 'Goa Trip with friends',
    optionB: 'Manali Trip with friends',
  },
  {
    id: 202,
    category: 'lifestyle',
    optionA: 'Travel by Indian Railways (AC Coach)',
    optionB: 'Travel by Domestic Flight',
  },
  {
    id: 203,
    category: 'lifestyle',
    optionA: 'Big Fat Indian Wedding',
    optionB: 'Quiet Court Marriage with close family',
  },
  {
    id: 204,
    category: 'lifestyle',
    optionA: 'Street Shopping (Bargaining)',
    optionB: 'Mall Shopping (Fixed Price)',
  },
  {
    id: 205,
    category: 'lifestyle',
    optionA: 'Living in Mumbai',
    optionB: 'Living in Delhi',
  },

  // ─── Psychological & Mood ──────────────────────────────
  {
    id: 301,
    category: 'psychological',
    optionA: 'Follow your brain (Logic)',
    optionB: 'Follow your heart (Emotion)',
  },
  {
    id: 302,
    category: 'psychological',
    optionA: 'Forgive easily but never forget',
    optionB: 'Forget easily but struggle to forgive',
  },
  {
    id: 303,
    category: 'psychological',
    optionA: 'Texting to resolve a fight',
    optionB: 'Calling to resolve a fight',
  },
  {
    id: 304,
    category: 'psychological',
    optionA: 'Be highly respected but not fully loved',
    optionB: 'Be deeply loved but not highly respected',
  },
  {
    id: 305,
    category: 'psychological',
    optionA: 'Plan everything in advance',
    optionB: 'Go with the flow spontaneously',
  },
  {
    id: 306,
    category: 'psychological',
    optionA: 'Express anger immediately',
    optionB: 'Hold it in and process it alone',
  },
  {
    id: 307,
    category: 'psychological',
    optionA: 'Comforting lies',
    optionB: 'Harsh truths',
  },
  {
    id: 308,
    category: 'psychological',
    optionA: 'Small close circle of friends',
    optionB: 'Large group of casual friends',
  },
  {
    id: 309,
    category: 'psychological',
    optionA: 'Quality time',
    optionB: 'Words of affirmation',
  },
  {
    id: 310,
    category: 'psychological',
    optionA: 'Work to live (balanced life)',
    optionB: 'Live to work (ambitious career)',
  },
  {
    id: 311,
    category: 'psychological',
    optionA: 'Never feel physical pain',
    optionB: 'Never feel emotional pain',
  },
  {
    id: 312,
    category: 'psychological',
    optionA: 'Always say everything on your mind',
    optionB: 'Never speak again',
  },

  // ─── Fun & Hypothetical ────────────────────────────────
  {
    id: 401,
    category: 'fun',
    optionA: 'Time travel to the past to fix a mistake',
    optionB: 'Time travel to the future to see your life',
  },
  {
    id: 402,
    category: 'fun',
    optionA: 'Read minds',
    optionB: 'Be invisible',
  },
  {
    id: 403,
    category: 'fun',
    optionA: 'Have a pause button for life',
    optionB: 'Have a rewind button for life',
  },
  {
    id: 404,
    category: 'fun',
    optionA: 'Win 10 Crores right now',
    optionB: 'Flip a coin for 50 Crores',
  },
  {
    id: 405,
    category: 'fun',
    optionA: 'Give up music forever',
    optionB: 'Give up internet forever',
  }
];

/**
 * Get a shuffled subset of questions for a game session.
 * @param {number} count - Number of questions to pick
 * @param {string} [category] - Optional category filter
 * @returns {Array}
 */
export function getRandomQuestions(count = 10, category = null) {
  let pool = category ? questions.filter((q) => q.category === category) : [...questions];

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, Math.min(count, pool.length));
}

export default questions;
