'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EELogo from './EELogo';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/membership', label: 'Membership' },
  { href: '/shop', label: 'Shop' },
  { href: '/journal', label: 'Field Journal' },
];

export default function EENav() {
  const pathname = usePathname();

  return (
    <nav className="ee-nav">
      <EELogo />
      <div className="ee-nav-links">
        {LINKS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                color: active ? 'var(--ee-ink)' : 'inherit',
                fontWeight: active ? 600 : 500,
                borderBottom: active ? '2px solid var(--ee-gold)' : '2px solid transparent',
                paddingBottom: 4,
                transition: 'color 120ms ease',
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
      <div className="ee-nav-cta">
        <Link
          href="/signin"
          className="ee-btn ee-btn-ghost"
          style={{ padding: '10px 16px', fontSize: 13 }}
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="ee-btn ee-btn-primary"
          style={{ padding: '10px 18px', fontSize: 13 }}
        >
          Join free
        </Link>
      </div>
    </nav>
  );
}
