// Tile dataset organized by the Fitzgerald key — a grammatical color-coding
// convention used in real AAC (Augmentative and Alternative Communication)
// boards, so category colors carry real meaning, not decoration.

export const CATEGORIES = {
  pronoun: {
    label: 'Pronouns',
    color: 'var(--color-pronoun)',
    bg: 'var(--color-pronoun-bg)',
  },
  verb: {
    label: 'Actions',
    color: 'var(--color-verb)',
    bg: 'var(--color-verb-bg)',
  },
  noun: {
    label: 'Things & People',
    color: 'var(--color-noun)',
    bg: 'var(--color-noun-bg)',
  },
  descriptor: {
    label: 'Feelings & Descriptions',
    color: 'var(--color-descriptor)',
    bg: 'var(--color-descriptor-bg)',
  },
  social: {
    label: 'Social',
    color: 'var(--color-social)',
    bg: 'var(--color-social-bg)',
  },
};

export const TILES = [
  // Pronouns
  { id: 'i', label: 'I', category: 'pronoun', icon: '🙋' },
  { id: 'you', label: 'you', category: 'pronoun', icon: '👉' },
  { id: 'we', label: 'we', category: 'pronoun', icon: '🤝' },
  { id: 'they', label: 'they', category: 'pronoun', icon: '👥' },
  { id: 'my', label: 'my', category: 'pronoun', icon: '🫱' },

  // Actions
  { id: 'want', label: 'want', category: 'verb', icon: '🙏' },
  { id: 'like', label: 'like', category: 'verb', icon: '👍' },
  { id: 'need', label: 'need', category: 'verb', icon: '❗' },
  { id: 'go', label: 'go', category: 'verb', icon: '🚶' },
  { id: 'stop', label: 'stop', category: 'verb', icon: '✋' },
  { id: 'help', label: 'help', category: 'verb', icon: '🆘' },
  { id: 'feel', label: 'feel', category: 'verb', icon: '💭' },
  { id: 'eat', label: 'eat', category: 'verb', icon: '🍽️' },
  { id: 'drink', label: 'drink', category: 'verb', icon: '🥤' },
  { id: 'play', label: 'play', category: 'verb', icon: '🎲' },
  { id: 'more', label: 'more', category: 'verb', icon: '➕' },
  { id: 'see', label: 'see', category: 'verb', icon: '👀' },

  // Things & People
  { id: 'water', label: 'water', category: 'noun', icon: '💧' },
  { id: 'food', label: 'food', category: 'noun', icon: '🍎' },
  { id: 'bathroom', label: 'bathroom', category: 'noun', icon: '🚻' },
  { id: 'home', label: 'home', category: 'noun', icon: '🏠' },
  { id: 'school', label: 'school', category: 'noun', icon: '🏫' },
  { id: 'mom', label: 'mom', category: 'noun', icon: '👩' },
  { id: 'dad', label: 'dad', category: 'noun', icon: '👨' },
  { id: 'friend', label: 'friend', category: 'noun', icon: '🧑‍🤝‍🧑' },
  { id: 'book', label: 'book', category: 'noun', icon: '📖' },
  { id: 'phone', label: 'phone', category: 'noun', icon: '📱' },
  { id: 'outside', label: 'outside', category: 'noun', icon: '🌳' },
  { id: 'music', label: 'music', category: 'noun', icon: '🎵' },

  // Feelings & Descriptions
  { id: 'happy', label: 'happy', category: 'descriptor', icon: '😊' },
  { id: 'sad', label: 'sad', category: 'descriptor', icon: '😢' },
  { id: 'tired', label: 'tired', category: 'descriptor', icon: '😴' },
  { id: 'hungry', label: 'hungry', category: 'descriptor', icon: '🍽️' },
  { id: 'hurt', label: 'hurt', category: 'descriptor', icon: '🤕' },
  { id: 'hot', label: 'hot', category: 'descriptor', icon: '🥵' },
  { id: 'cold', label: 'cold', category: 'descriptor', icon: '🥶' },
  { id: 'big', label: 'big', category: 'descriptor', icon: '🔼' },
  { id: 'small', label: 'small', category: 'descriptor', icon: '🔽' },
  { id: 'good', label: 'good', category: 'descriptor', icon: '✅' },
  { id: 'bad', label: 'bad', category: 'descriptor', icon: '❌' },

  // Social
  { id: 'hello', label: 'hello', category: 'social', icon: '👋' },
  { id: 'bye', label: 'bye', category: 'social', icon: '🙋' },
  { id: 'please', label: 'please', category: 'social', icon: '🤲' },
  { id: 'thankyou', label: 'thank you', category: 'social', icon: '🙏' },
  { id: 'yes', label: 'yes', category: 'social', icon: '✅' },
  { id: 'no', label: 'no', category: 'social', icon: '🚫' },
  { id: 'sorry', label: 'sorry', category: 'social', icon: '💔' },
  { id: 'iloveyou', label: 'I love you', category: 'social', icon: '❤️' },
];
