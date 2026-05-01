import Link from 'next/link';

interface EELogoProps {
  size?: number;
  label?: boolean;
  mono?: boolean;
  href?: string;
}

export default function EELogo({ size = 36, label = true, mono = false, href = '/' }: EELogoProps) {
  const inner = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <span
        className="ee-mark"
        style={{ width: size, height: size, fontSize: size * 0.45 }}
      >
        EE
      </span>
      {label && (
        <span
          style={{
            fontFamily: mono ? 'var(--ee-mono)' : 'var(--ee-sans)',
            fontWeight: mono ? 500 : 700,
            fontSize: mono ? 11 : 15,
            letterSpacing: mono ? '0.18em' : '-0.005em',
            textTransform: mono ? 'uppercase' : 'none',
            lineHeight: 1.1,
          }}
        >
          {mono ? (
            'EVERYDAY ENGINEER'
          ) : (
            <span>
              Everyday <span style={{ fontWeight: 400 }}>Engineer</span>
            </span>
          )}
        </span>
      )}
    </span>
  );

  return href ? <Link href={href}>{inner}</Link> : <span>{inner}</span>;
}
