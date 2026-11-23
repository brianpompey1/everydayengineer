'use client';

export default function Stepper({ value, max, onChange }: { value: number; max: number; onChange: (n: number) => void }) {
  const btn: React.CSSProperties = { width: 36, height: 36, borderRadius: 6, border: '1px solid var(--ee-line)', background: 'var(--ee-paper)', cursor: 'pointer', fontSize: 16 };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <button type="button" style={btn} aria-label="Fewer" disabled={value <= 1} onClick={() => onChange(value - 1)}>−</button>
      <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{value}</span>
      <button type="button" style={btn} aria-label="More" disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}
