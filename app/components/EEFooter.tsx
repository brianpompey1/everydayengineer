import Link from 'next/link';
import EELogo from './EELogo';

const COLS = [
  {
    title: 'Membership',
    links: [
      { label: 'Benefits', href: '/membership' },
      { label: 'Pricing', href: '/membership' },
      { label: 'Apply', href: '/apply' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Field Journal', href: '/journal' },
      { label: 'Events', href: '/dashboard' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { label: 'All Gear', href: '/shop' },
      { label: 'Apparel', href: '/shop' },
      { label: 'Accessories', href: '/shop' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign In', href: '/signin' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Order History', href: '/dashboard' },
    ],
  },
];

const SOCIAL = ['IG', 'LI', 'TW', 'YT'];

export default function EEFooter() {
  return (
    <footer className="ee-foot">
      <div className="ee-grid-footer-inner">
        <div>
          <div style={{ color: 'var(--ee-paper)' }}>
            <EELogo />
          </div>
          <p
            style={{
              marginTop: 24,
              fontSize: 14,
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.55,
              maxWidth: 320,
            }}
          >
            A curated community where technical excellence meets lifestyle elevation. New York, NY.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            {SOCIAL.map((s) => (
              <span
                key={s}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontFamily: 'var(--ee-mono)',
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {COLS.map(({ title, links }) => (
          <div key={title}>
            <div className="ee-mono" style={{ color: 'var(--ee-gold)', marginBottom: 18 }}>
              {title}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.12)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div className="ee-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>
          © 2026 Everyday Engineer · New York, NY
        </div>
        <div className="ee-mono" style={{ color: 'rgba(255,255,255,0.5)', display: 'flex', gap: 24 }}>
          <Link href="#">Privacy</Link>
          <Link href="#">Terms</Link>
          <Link href="#">Code of Conduct</Link>
        </div>
      </div>
    </footer>
  );
}
