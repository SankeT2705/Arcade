/**
 * Sync or Not — Comprehensive Question Bank
 * Includes 70+ questions categorized into:
 * - culture: Indian Pop Culture, Bollywood, Cinema, Sports & Music
 * - food: Indian Food, Street Treats & Drinks
 * - lifestyle: Travel, Daily Habits & Lifestyle
 * - psychological: Deep Behavior, Psychology, Friendship, Values & Reading People
 * - fun: Quirky Dilemmas & Hypotheticals
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

  // ─── Deep Behavior, Psychology & Vibe ─────────────────────
  {
    id: 501,
    category: 'psychological',
    optionA: 'Give someone the benefit of the doubt',
    optionB: 'Trust your first instinct about them',
  },
  {
    id: 502,
    category: 'psychological',
    optionA: 'Think about what someone meant',
    optionB: 'Focus on what someone actually did',
  },
  {
    id: 503,
    category: 'psychological',
    optionA: 'Make a decision based on your gut feeling',
    optionB: 'Make a decision after thinking through every possibility',
  },
  {
    id: 504,
    category: 'psychological',
    optionA: 'Know an uncomfortable truth',
    optionB: 'Stay peaceful without knowing it',
  },
  {
    id: 505,
    category: 'psychological',
    optionA: 'Change your opinion when someone gives a better argument',
    optionB: 'Stick with your opinion until you are completely convinced otherwise',
  },
  {
    id: 506,
    category: 'psychological',
    optionA: 'Take a risk when the opportunity feels special',
    optionB: 'Choose the safer option and avoid unnecessary uncertainty',
  },
  {
    id: 507,
    category: 'psychological',
    optionA: 'Remember how someone made you feel',
    optionB: 'Remember exactly what they said or did',
  },
  {
    id: 508,
    category: 'psychological',
    optionA: 'Give people a second chance easily',
    optionB: 'Make people earn your trust again',
  },
  {
    id: 509,
    category: 'psychological',
    optionA: 'Think about what could go wrong',
    optionB: 'Think about what could go right',
  },
  {
    id: 510,
    category: 'psychological',
    optionA: 'Figure things out while moving forward',
    optionB: 'Understand the situation completely before moving forward',
  },

  // ─── Vibe & Reading People ────────────────────────────────
  {
    id: 511,
    category: 'psychological',
    optionA: "Notice when someone's energy suddenly changes",
    optionB: "Notice when someone's words suddenly change",
  },
  {
    id: 512,
    category: 'psychological',
    optionA: 'Believe someone when they say "I\'m fine"',
    optionB: 'Ask again when their behavior says otherwise',
  },
  {
    id: 513,
    category: 'psychological',
    optionA: 'Give someone space when they become quiet',
    optionB: 'Check on them because something might be wrong',
  },
  {
    id: 514,
    category: 'psychological',
    optionA: "A person's consistency matters more than their charm",
    optionB: "A person's intentions matter more than their consistency",
  },
  {
    id: 515,
    category: 'psychological',
    optionA: 'Trust someone more when they remember small details',
    optionB: 'Trust someone more when they show up when needed',
  },
  {
    id: 516,
    category: 'psychological',
    optionA: 'Silence can tell you a lot about someone',
    optionB: 'Silence is too easy to misunderstand',
  },
  {
    id: 517,
    category: 'psychological',
    optionA: 'People usually show you who they really are',
    optionB: 'People can genuinely change with time',
  },
  {
    id: 518,
    category: 'psychological',
    optionA: 'Notice who is being left out in a group',
    optionB: 'Notice who is trying to control the group',
  },

  // ─── Friendship & Connection ──────────────────────────────
  {
    id: 519,
    category: 'psychological',
    optionA: 'A close friend should tell you when you are wrong',
    optionB: 'A close friend should support you even when you are wrong',
  },
  {
    id: 520,
    category: 'psychological',
    optionA: 'A strong friendship can survive months without talking',
    optionB: 'A strong friendship needs regular communication',
  },
  {
    id: 521,
    category: 'psychological',
    optionA: 'Be there for a friend even when you disagree with them',
    optionB: 'Tell them honestly when you think they are making a mistake',
  },
  {
    id: 522,
    category: 'psychological',
    optionA: 'Prefer one friend you can tell almost everything',
    optionB: 'Prefer different friends for different parts of your life',
  },
  {
    id: 523,
    category: 'psychological',
    optionA: 'Spend time together comfortably without talking',
    optionB: 'Have long conversations whenever you meet',
  },
  {
    id: 524,
    category: 'psychological',
    optionA: 'Apologize first if the friendship matters',
    optionB: 'Wait until both people are ready to talk',
  },
  {
    id: 525,
    category: 'psychological',
    optionA: 'A friendship becomes stronger through difficult conversations',
    optionB: 'A friendship becomes stronger by knowing which battles to avoid',
  },
  {
    id: 526,
    category: 'psychological',
    optionA: 'Forgive someone because you understand why they did it',
    optionB: 'Forgive someone only after they take responsibility',
  },

  // ─── Conflict & Emotional Behavior ─────────────────────────
  {
    id: 527,
    category: 'psychological',
    optionA: 'Solve an argument immediately',
    optionB: 'Take some time alone before discussing it',
  },
  {
    id: 528,
    category: 'psychological',
    optionA: 'Explain yourself when someone misunderstands you',
    optionB: 'Let them think what they want',
  },
  {
    id: 529,
    category: 'psychological',
    optionA: 'Say exactly what hurt you',
    optionB: 'Process it yourself before talking about it',
  },
  {
    id: 530,
    category: 'psychological',
    optionA: "Focus more on the intention behind someone's mistake",
    optionB: 'Focus more on the impact their mistake had on you',
  },
  {
    id: 531,
    category: 'psychological',
    optionA: 'Bring up an old issue if it still affects you',
    optionB: 'Leave the past alone unless it happens again',
  },
  {
    id: 532,
    category: 'psychological',
    optionA: 'Walk away when an argument becomes disrespectful',
    optionB: 'Stay and finish the conversation even when it gets difficult',
  },

  // ─── Values, Mentality & Life Choices ──────────────────────
  {
    id: 533,
    category: 'psychological',
    optionA: 'Choose a stable career that keeps your family comfortable',
    optionB: 'Choose a risky career that you genuinely care about',
  },
  {
    id: 534,
    category: 'psychological',
    optionA: 'Keep peace with family even when you disagree',
    optionB: 'Speak honestly even when it creates disagreement',
  },
  {
    id: 535,
    category: 'psychological',
    optionA: "Respect someone's opinion because they are older",
    optionB: 'Respect the person but question their opinion',
  },
  {
    id: 536,
    category: 'psychological',
    optionA: 'Choose a successful life with less free time',
    optionB: 'Choose a simpler life with more personal time',
  },
  {
    id: 537,
    category: 'psychological',
    optionA: 'Stay close to your hometown and people',
    optionB: 'Move away if it gives you a better future',
  },
  {
    id: 538,
    category: 'psychological',
    optionA: 'Do what your family expects when the decision affects everyone',
    optionB: 'Choose what feels right for you even if they disagree',
  },

  // ─── Situational Vibe Checks ──────────────────────────────
  {
    id: 539,
    category: 'psychological',
    optionA: 'If a friend cancels at the last minute, ask what happened',
    optionB: 'Feel disappointed but give them space',
  },
  {
    id: 540,
    category: 'psychological',
    optionA: 'If everyone disagrees with your friend in public, defend them first',
    optionB: 'Stay neutral publicly and discuss it with them privately',
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
  },
];

/**
 * Fisher-Yates array shuffler.
 */
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Get a balanced, non-repeating subset of questions across all categories for a game round.
 * Ensures every category (psychological, culture, food, lifestyle, fun) appears in each round.
 * @param {number} count - Number of questions to pick (default: 10)
 * @param {string} [category] - Optional category filter
 * @returns {Array}
 */
export function getRandomQuestions(count = 10, category = null) {
  if (category) {
    const pool = questions.filter((q) => q.category === category);
    return shuffleArray(pool).slice(0, Math.min(count, pool.length));
  }

  // All categories to balance across
  const categories = ['psychological', 'culture', 'food', 'lifestyle', 'fun'];
  const grouped = {};
  categories.forEach((cat) => {
    grouped[cat] = shuffleArray(questions.filter((q) => q.category === cat));
  });

  const selected = [];
  const usedIds = new Set();

  // Round-robin selection across all categories to guarantee balanced diversity
  let catIndex = 0;
  let attempts = 0;
  const maxAttempts = count * 10;

  while (selected.length < count && attempts < maxAttempts) {
    const currentCat = categories[catIndex % categories.length];
    const catPool = grouped[currentCat];

    if (catPool && catPool.length > 0) {
      const q = catPool.pop();
      if (!usedIds.has(q.id)) {
        usedIds.add(q.id);
        selected.push(q);
      }
    }
    catIndex++;
    attempts++;
  }

  // If more questions needed, fill from any remaining unpicked questions
  if (selected.length < count) {
    const remaining = shuffleArray(questions.filter((q) => !usedIds.has(q.id)));
    for (const q of remaining) {
      if (selected.length >= count) break;
      selected.push(q);
      usedIds.add(q.id);
    }
  }

  // Shuffle final selected set so the category sequence feels natural and varied
  return shuffleArray(selected).slice(0, Math.min(count, selected.length));
}

export default questions;
