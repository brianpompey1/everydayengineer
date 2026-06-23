'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import EELogo from './EELogo';

const LINKS = [
  { href: '/today', label: 'Today' },
  { href: '/events', label: 'Events' },
  { href: '/journal', label: 'Field Journal' },
  { href: '/shop', label: 'Shop' },
];

const SearchIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={11} cy={11} r={8} /><path d="M21 21l-4.3-4.3" />
  </svg>
);
const MenuIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
const SignOutIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);
const UserIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
);

export default function EEMemberNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut(() => router.push('/'));
  };

  return (
    <nav className="ee-nav" style={{ justifyContent: 'space-between' }}>
      {/* Logo + member badge */}
      <Link href="/today" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <EELogo label={false} />
        <span className="ee-mono" style={{ color: 'var(--ee-ink-3)' }}>MEMBER</span>
      </Link>

      {/* Nav links — hidden on mobile */}
      <div className="ee-nav-links">
        {LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              style={{
                color: active ? 'var(--ee-ink)' : 'inherit',
                fontWeight: active ? 600 : 500,
                borderBottom: active ? '2px solid var(--ee-gold)' : '2px solid transparent',
                paddingBottom: 4,
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--ee-lavender-2)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ee-ink-3)', cursor: 'pointer',
          }}
          aria-label="Search"
        >
          <SearchIcon />
        </button>

        {/* Avatar + dropdown */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'block' }}
            aria-label="Account menu"
          >
            {user?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageUrl}
                alt={user.fullName ?? 'Profile'}
                style={{
                  width: 36, height: 36, borderRadius: '50%', objectFit: 'cover',
                  border: pathname === '/profile' ? '2px solid var(--ee-gold)' : '2px solid transparent',
                }}
              />
            ) : (
              <span style={{
                width: 36, height: 36, borderRadius: '50%', display: 'block',
                background: 'repeating-linear-gradient(45deg, rgba(184,140,14,0.12) 0, rgba(184,140,14,0.12) 1px, transparent 1px, transparent 6px), linear-gradient(135deg, #E8DCC0 0%, #C9B88A 100%)',
                border: pathname === '/profile' ? '2px solid var(--ee-gold)' : '2px solid transparent',
              }} />
            )}
          </button>

          {menuOpen && (
            <div
              style={{
                position: 'absolute', top: 48, right: 0, minWidth: 180,
                background: 'var(--ee-paper)', border: '1px solid var(--ee-line)',
                borderRadius: 8, boxShadow: 'var(--ee-shadow-md)', overflow: 'hidden', zIndex: 50,
              }}
            >
              {user?.fullName && (
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--ee-line)' }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{user.fullName}</div>
                  <div className="ee-small" style={{ fontSize: 11, marginTop: 2 }}>{user.primaryEmailAddress?.emailAddress}</div>
                </div>
              )}
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14, color: 'var(--ee-ink)' }}
              >
                <UserIcon /> Profile
              </Link>
              <button
                onClick={handleSignOut}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14,
                  color: 'var(--ee-ink)', background: 'none', border: 'none', borderTop: '1px solid var(--ee-line)',
                  width: '100%', textAlign: 'left', cursor: 'pointer',
                }}
              >
                <SignOutIcon /> Sign out
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button — visible < 1280px */}
        <button
          className="ee-member-menu-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ee-ink)', display: 'none' }}
          aria-label="Menu"
        >
          <MenuIcon />
        </button>
      </div>
    </nav>
  );
}
