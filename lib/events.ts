import { supabaseAdmin } from './supabase';

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
  rsvp_count?: number;
}

export async function getPublishedEvents(): Promise<EventRow[]> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*, rsvps(count)')
    .eq('is_published', true)
    .order('event_date', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((e) => ({
    ...e,
    rsvp_count: e.rsvps?.[0]?.count ?? 0,
  }));
}

export async function getEventById(id: string): Promise<EventRow | null> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*, rsvps(count)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return { ...data, rsvp_count: data.rsvps?.[0]?.count ?? 0 };
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
