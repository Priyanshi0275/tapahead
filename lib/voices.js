// The Web Speech API doesn't label voices by gender — it only gives a
// name and language (e.g. "Microsoft Zira", "Google UK English Male").
// We guess gender from common naming patterns so a simple Male/Female
// toggle works out of the box, but we also expose the full voice list so
// the user can override with an exact voice if the guess is wrong.

const FEMALE_HINTS = [
  'female', 'woman', 'zira', 'samantha', 'victoria', 'karen', 'moira',
  'tessa', 'fiona', 'susan', 'aria', 'jenny', 'emma', 'ava', 'allison',
  'salli', 'joanna', 'kendra', 'kimberly', 'ivy', 'olivia', 'amy',
];

const MALE_HINTS = [
  'male', 'man', 'david', 'daniel', 'alex', 'fred', 'mark', 'guy',
  'tom', 'james', 'george', 'oliver', 'ryan', 'matthew', 'justin',
  'joey', 'eric', 'brian', 'russell',
];

export function classifyVoiceGender(voice) {
  const name = voice.name.toLowerCase();
  if (FEMALE_HINTS.some((hint) => name.includes(hint))) return 'female';
  if (MALE_HINTS.some((hint) => name.includes(hint))) return 'male';
  return 'unknown';
}

export function pickDefaultVoice(voices, gender) {
  if (!voices || voices.length === 0) return null;
  const englishVoices = voices.filter((v) => v.lang?.startsWith('en'));
  const pool = englishVoices.length > 0 ? englishVoices : voices;
  const matched = pool.find((v) => classifyVoiceGender(v) === gender);
  return matched || pool[0] || voices[0];
}
