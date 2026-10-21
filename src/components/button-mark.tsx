// A four-hole coat button whose thread is stitched as a medical cross.
export function ButtonMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 40 40"
    >
      <circle cx="20" cy="20" r="18" fill="currentColor" />
      <circle cx="20" cy="20" r="14" stroke="var(--mark-rim, #fbfaf6)" strokeOpacity="0.35" />
      <path
        d="M20 9.5v21M9.5 20h21"
        stroke="var(--mark-thread, #c8463f)"
        strokeLinecap="round"
        strokeWidth="4.2"
      />
      <g fill="var(--mark-rim, #fbfaf6)">
        <circle cx="20" cy="12" r="1.9" />
        <circle cx="20" cy="28" r="1.9" />
        <circle cx="12" cy="20" r="1.9" />
        <circle cx="28" cy="20" r="1.9" />
      </g>
    </svg>
  );
}
