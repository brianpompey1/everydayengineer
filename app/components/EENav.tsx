'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import EELogo from './EELogo';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
];

export default function EENav() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

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
        {!isLoaded ? null : isSignedIn ? (
          <Link
            href="/today"
            className="ee-btn ee-btn-primary"
            style={{ padding: '10px 18px', fontSize: 13 }}
          >
            Go to Today →
          </Link>
        ) : (
          <>
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
          </>
        )}
      </div>
    </nav>
  );
}
