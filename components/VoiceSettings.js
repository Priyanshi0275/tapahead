'use client';

export default function VoiceSettings({
  voices,
  genderPref,
  onGenderChange,
  selectedVoiceURI,
  onVoiceChange,
}) {
  if (!voices || voices.length === 0) return null;

  return (
    <div className="voice-settings">
      <div className="voice-toggle" role="group" aria-label="Voice gender">
        <button
          type="button"
          className={genderPref === 'female' ? 'voice-toggle-btn active' : 'voice-toggle-btn'}
          onClick={() => onGenderChange('female')}
        >
          ♀ Female voice
        </button>
        <button
          type="button"
          className={genderPref === 'male' ? 'voice-toggle-btn active' : 'voice-toggle-btn'}
          onClick={() => onGenderChange('male')}
        >
          ♂ Male voice
        </button>
      </div>

      <select
        className="voice-select"
        value={selectedVoiceURI || ''}
        onChange={(e) => onVoiceChange(e.target.value)}
        aria-label="Choose a specific voice"
      >
        {voices.map((v) => (
          <option key={v.voiceURI} value={v.voiceURI}>
            {v.name} ({v.lang})
          </option>
        ))}
      </select>
    </div>
  );
}
