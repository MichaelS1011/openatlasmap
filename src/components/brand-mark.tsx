export function BrandMark({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true" focusable="false" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 38 L24 12 L36 38" stroke="currentColor" strokeWidth="3.2" />
      <path d="M5 42 Q24 27 43 42" stroke="currentColor" strokeWidth="3.2" />
      <path d="M11 43.5 Q24 33 37 43.5" stroke="currentColor" strokeWidth="3.2" />
      <circle cx="24" cy="5.5" r="2.9" fill="var(--brand-accent)" />
    </svg>
  );
}
