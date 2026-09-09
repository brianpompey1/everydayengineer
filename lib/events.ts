import { supabaseAdmin } from './supabase';
import { getEventCounts, type EventCounts } from './rsvps';

export const UNIVERSITIES = [
  'Morgan State University',
  'Auburn University',
  'Canisius University',
  'University at Buffalo',
] as const;

export interface EventRow {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  event_date: string;
  end_date: string | null;
  cover_image: string | null;
  category: string | null;
  capacity: number | null;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  state: string | null;
  university: string | null;
  /** Approved players — the number that counts against capacity. */
  rsvp_count?: number;
  counts?: EventCounts;
}

/** Midnight this morning, so an event still shows on the day it happens. */
function todayCutoff(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function getPublishedEvents(): Promise<EventRow[]> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('event_date', todayCutoff())
    .order('event_date', { ascending: true });

  if (error) throw error;

  const events = (data ?? []) as EventRow[];
  const counts = await getEventCounts(events.map((e) => e.id));

  return events.map((e) => ({
    ...e,
    counts: counts[e.id],
    rsvp_count: counts[e.id]?.players ?? 0,
  }));
}

export async function getEventById(id: string): Promise<EventRow | null> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const counts = await getEventCounts([id]);
  return {
    ...(data as EventRow),
    counts: counts[id],
    rsvp_count: counts[id]?.players ?? 0,
  };
}

export async function getMemberRsvpStatus(eventId: string, memberId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('rsvps')
    .select('status')
    .eq('event_id', eventId)
    .eq('member_id', memberId)
    .maybeSingle();

  if (error) throw error;
  return data?.status ?? null;
}

export async function getMemberRsvpMap(memberId: string): Promise<Record<string, string>> {
  const { data, error } = await supabaseAdmin
    .from('rsvps')
    .select('event_id, status')
    .eq('member_id', memberId);

  if (error) throw error;

  return Object.fromEntries((data ?? []).map((r) => [r.event_id, r.status]));
}
