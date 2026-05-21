'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EELogo from './EELogo';

const LINKS = [
  { href: '/today', label: 'Today' },
  { href: '/goals', label: 'Goals' },
  { href: '/events', label: 'Events' },
  { href: '/journal', label: 'Field Journal' },
  { href: '/shop', label: 'Shop' },
];

const SearchIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={11} cy={11} r={8} /><path d="M21 21l-4.3-4.3" />
  </svg>
);
const MsgIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a8 8 0 0 1-12 7l-5 1 1-4a8 8 0 1 1 16-4z" />
  </svg>
);
const MenuIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export default function EEMemberNav() {
  const pathname = usePathname();

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
        <div style={{ position: 'relative' }}>
          <button
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--ee-lavender-2)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--ee-ink-3)', cursor: 'pointer',
            }}
            aria-label="Messages"
          >
            <MsgIcon />
          </button>
          {/* Unread dot */}
          <span style={{
            position: 'absolute', top: -2, right: -2,
            width: 10, height: 10, borderRadius: '50%',
            background: 'var(--ee-gold)', border: '2px solid var(--ee-paper)',
          }} />
        </div>
        <Link href="/profile">
          <span style={{
            width: 36, height: 36, borderRadius: '50%', display: 'block',
            background: 'repeating-linear-gradient(45deg, rgba(184,140,14,0.12) 0, rgba(184,140,14,0.12) 1px, transparent 1px, transparent 6px), linear-gradient(135deg, #E8DCC0 0%, #C9B88A 100%)',
            border: pathname === '/profile' ? '2px solid var(--ee-gold)' : '2px solid transparent',
          }} />
        </Link>
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
