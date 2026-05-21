interface EEStreakProps {
  count: number;
  size?: number;
  max?: number;
}

export default function EEStreak({ count, size = 48, max = 30 }: EEStreakProps) {
  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(count / max, 1);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--ee-line)" strokeWidth={3} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="var(--ee-gold)" strokeWidth={3} fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          strokeLinecap="round"
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--ee-sans)',
      }}>
        <span style={{ fontSize: size > 40 ? 14 : 11, fontWeight: 800, lineHeight: 1 }}>{count}</span>
        {size > 40 && (
          <span style={{ fontFamily: 'var(--ee-mono)', fontSize: 7, letterSpacing: '0.14em', color: 'var(--ee-ink-3)', marginTop: 2 }}>
            DAYS
          </span>
        )}
      </div>
    </div>
  );
}
