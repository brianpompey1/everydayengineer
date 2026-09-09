import { supabaseAdmin } from './supabase';
import { WAIVER_VERSION, WAIVER_FULL_TEXT } from './waiver';

export type AttendeeType = 'player' | 'spectator';
export type RsvpStatus = 'pending' | 'approved' | 'waitlisted' | 'declined';

export interface Rsvp {
  id: string;
  event_id: string;
  member_id: string;
  attendee_type: AttendeeType;
  status: RsvpStatus;
  created_at: string;
  updated_at: string | null;
}

/** Approved players fill roster spots. Everything else does not. */
export interface EventCounts {
  players: number;      // approved players — counts against capacity
  spectators: number;   // approved spectators — uncapped
  pending: number;      // players awaiting a roster decision
}

export async function getRsvp(eventId: string, memberId: string): Promise<Rsvp | null> {
  const { data, error } = await supabaseAdmin
    .from('rsvps')
    .select('*')
    .eq('event_id', eventId)
    .eq('member_id', memberId)
    .maybeSingle();

  if (error) throw error;
  return (data as Rsvp) ?? null;
}

export async function getEventCounts(eventIds: string[]): Promise<Record<string, EventCounts>> {
  const empty = (): EventCounts => ({ players: 0, spectators: 0, pending: 0 });
  if (eventIds.length === 0) return {};

  const { data, error } = await supabaseAdmin
    .from('rsvps')
    .select('event_id, status, attendee_type')
    .in('event_id', eventIds);

  if (error) throw error;

  const counts: Record<string, EventCounts> = {};
  for (const id of eventIds) counts[id] = empty();

  for (const row of data ?? []) {
    const c = counts[row.event_id];
    if (!c) continue;
    if (row.status === 'approved' && row.attendee_type === 'player') c.players += 1;
    else if (row.status === 'approved' && row.attendee_type === 'spectator') c.spectators += 1;
    else if (row.status === 'pending' && row.attendee_type === 'player') c.pending += 1;
  }
  return counts;
}

export async function hasSignedWaiver(eventId: string, memberId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('waivers')
    .select('id')
    .eq('event_id', eventId)
    .eq('member_id', memberId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

interface SubmitRsvpInput {
  eventId: string;
  memberId: string;
  attendeeType: AttendeeType;
  /** Required for players — the signed waiver accompanying the request. */
  waiver?: {
    signatureName: string;
    signatureDate: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    is21Plus: boolean;
  };
}

/**
 * Spectators are confirmed immediately — they're always welcome.
 * Players are recorded as pending and wait for a roster spot.
 */
export async function submitRsvp(input: SubmitRsvpInput): Promise<Rsvp> {
  const { eventId, memberId, attendeeType, waiver } = input;

  if (attendeeType === 'player') {
    if (!waiver) throw new Error('A signed waiver is required to participate.');
    if (!waiver.is21Plus) throw new Error('Participants must be 21 or older to play.');

    // Snapshot the exact wording agreed to, so the signature stays meaningful
    // even if the waiver text is revised later.
    const { error: waiverError } = await supabaseAdmin
      .from('waivers')
      .upsert(
        {
          member_id: memberId,
          event_id: eventId,
          waiver_version: WAIVER_VERSION,
          waiver_text: WAIVER_FULL_TEXT,
          signature_name: waiver.signatureName,
          signature_date: waiver.signatureDate,
          emergency_contact_name: waiver.emergencyContactName,
          emergency_contact_phone: waiver.emergencyContactPhone,
          is_21_plus: waiver.is21Plus,
          agreed: true,
        },
        { onConflict: 'member_id,event_id' }
      );

    if (waiverError) throw waiverError;
  }

  const { data, error } = await supabaseAdmin
    .from('rsvps')
    .upsert(
      {
        event_id: eventId,
        member_id: memberId,
        attendee_type: attendeeType,
        status: attendeeType === 'spectator' ? 'approved' : 'pending',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'event_id,member_id' }
    )
    .select('*')
    .single();

  if (error) throw error;
  return data as Rsvp;
}

export async function cancelRsvp(eventId: string, memberId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('rsvps')
    .delete()
    .eq('event_id', eventId)
    .eq('member_id', memberId);

  if (error) throw error;
}
