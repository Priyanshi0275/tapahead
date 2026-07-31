export default function Mascot({ className }) {
  return (
    <svg
      viewBox="0 0 680 480"
      className={className}
      role="img"
      aria-label="Tapper, the TapAhead mascot, tapping a tile while a speech bubble shows a predicted word popping up above its head"
    >
      <ellipse cx="340" cy="270" rx="120" ry="115" fill="var(--mascot-body)" />
      <ellipse cx="340" cy="300" rx="78" ry="68" fill="var(--mascot-belly)" />
      <circle cx="300" cy="245" r="34" fill="#ffffff" />
      <circle cx="380" cy="245" r="34" fill="#ffffff" />
      <circle cx="308" cy="252" r="14" fill="var(--mascot-eye)" />
      <circle cx="372" cy="252" r="14" fill="var(--mascot-eye)" />
      <ellipse cx="270" cy="290" rx="16" ry="10" fill="var(--mascot-cheek)" opacity="0.55" />
      <ellipse cx="410" cy="290" rx="16" ry="10" fill="var(--mascot-cheek)" opacity="0.55" />
      <path
        d="M310 305 Q340 325 370 305"
        fill="none"
        stroke="var(--mascot-eye)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M240 300 Q205 330 200 375"
        fill="none"
        stroke="var(--mascot-body)"
        strokeWidth="24"
        strokeLinecap="round"
      />
      <circle cx="198" cy="380" r="16" fill="var(--mascot-body)" />
      <rect
        x="160"
        y="392"
        width="72"
        height="20"
        rx="4"
        fill="var(--mascot-tile)"
        stroke="var(--mascot-tile-stroke)"
        strokeWidth="2.5"
      />
      <path
        d="M420 220 Q470 190 490 140"
        fill="none"
        stroke="var(--mascot-body)"
        strokeWidth="22"
        strokeLinecap="round"
      />
      <path
        d="M488 55 h95 a14 14 0 0 1 14 14 v55 a14 14 0 0 1 -14 14 h-42 l-18 22 l4-22 h-38 a14 14 0 0 1 -14-14 v-55 a14 14 0 0 1 14-14 z"
        fill="#ffffff"
        stroke="var(--mascot-eye)"
        strokeWidth="3"
      />
      <path
        d="M534 78 C534 78 520 96 520 106 a14 14 0 0 0 28 0 c0-10-14-28-14-28z"
        fill="var(--mascot-body)"
        stroke="var(--mascot-eye)"
        strokeWidth="2"
      />
    </svg>
  );
}
