'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { EventListItem } from './EventsListClient';

const CHEV_L = 'M15 18l-6-6 6-6';
const CHEV_R = 'M9 18l6-6-6-6';

function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export default function EventsCalendar({ events }: { events: EventListItem[] }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const eventsByDay = useMemo(() => {
    const map = new Map<string, EventListItem[]>();
    for (const e of events) {
      const d = new Date(e.eventDate);
      const key = dateKey(d);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return map;
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1].date;
    cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
    if (cells.length >= 42) break;
  }

  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const isToday = (d: Date) => dateKey(d) === dateKey(today);

  return (
    <div>
      {/* Month nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>{monthLabel}</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="ee-btn-link"
            style={{ fontSize: 10, marginRight: 8 }}
          >
            Today
          </button>
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            aria-label="Previous month"
            style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--ee-line)', background: 'var(--ee-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Icon d={CHEV_L} size={16} />
          </button>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            aria-label="Next month"
            style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--ee-line)', background: 'var(--ee-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Icon d={CHEV_R} size={16} />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: 'var(--ee-line)', border: '1px solid var(--ee-line)', borderBottom: 'none' }}>
        {WEEKDAYS.map((w) => (
          <div key={w} className="ee-mono" style={{ background: 'var(--ee-paper)', padding: '10px 12px', textAlign: 'center', fontSize: 10, color: 'var(--ee-ink-3)' }}>
            {w}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: 'var(--ee-line)', border: '1px solid var(--ee-line)' }}>
        {cells.map(({ date, inMonth }, i) => {
          const dayEvents = eventsByDay.get(dateKey(date)) ?? [];
          const visible = dayEvents.slice(0, 2);
          const overflow = dayEvents.length - visible.length;
          return (
            <div
              key={i}
              style={{
                background: 'var(--ee-paper)',
                minHeight: 100,
                padding: 8,
                opacity: inMonth ? 1 : 0.4,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span
                className="ee-mono"
                style={{
                  fontSize: 11,
                  width: 22, height: 22, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isToday(date) ? 'var(--ee-gold)' : 'transparent',
                  color: isToday(date) ? 'var(--ee-navy-900)' : 'var(--ee-ink-3)',
                }}
              >
                {date.getDate()}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {visible.map((e) => (
                  <Link
                    key={e.id}
                    href={`/events/${e.id}`}
                    className="ee-tag"
                    style={{
                      display: 'block',
                      fontSize: 10,
                      padding: '3px 6px',
                      background: 'var(--ee-lavender-2)',
                      color: 'var(--ee-ink-2)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={e.title}
                  >
                    {e.title}
                  </Link>
                ))}
                {overflow > 0 && (
                  <span className="ee-small" style={{ fontSize: 10 }}>+{overflow} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
