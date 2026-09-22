import { supabaseAdmin } from './supabase';
import { createHash } from 'node:crypto';
import { waiverSnapshot, type EventWaiver } from './waiver';

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
  /** Set when an approved player confirms they'll actually be there. */
  attendance_confirmed_at: string | null;
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

/** The event rules an RSVP is checked against. */
export interface EventRsvpRules {
  allowSpectators: boolean;
  requires21Plus: boolean;
  /** Null when the event needs no waiver. */
  waiver: EventWaiver | null;
}

interface SubmitRsvpInput {
  eventId: string;
  memberId: string;
  attendeeType: AttendeeType;
  rules: EventRsvpRules;
  /** Whether the member has confirmed they are 21 or older. */
  is21Plus: boolean | null;
  /** Required for participants when the event has a waiver. */
  waiver?: {
    signatureName: string;
    signatureDate: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
  };
}

/**
 * Spectators are confirmed immediately. Participants are recorded as pending
 * and wait for a spot. Every event rule is enforced here, server-side, so
 * none of them can be bypassed from the browser.
 */
export async function submitRsvp(input: SubmitRsvpInput): Promise<Rsvp> {
  const { eventId, memberId, attendeeType, rules, is21Plus, waiver } = input;

  if (attendeeType === 'spectator' && !rules.allowSpectators) {
    throw new Error("This event is for participants only — there's no spectator option.");
  }

  if (attendeeType === 'player') {
    if (rules.requires21Plus && is21Plus !== true) {
      throw new Error('Participants must be 21 or older.');
    }

    if (rules.waiver) {
      if (!waiver?.signatureName?.trim()) {
        throw new Error('A signed waiver is required to participate.');
      }

      // Snapshot exactly what was shown — title, body and consent label — so
      // the signature stays meaningful even if the event's waiver is edited.
      const snapshot = waiverSnapshot(rules.waiver);
      const version = 'sha256:' + createHash('sha256').update(snapshot).digest('hex').slice(0, 16);

      const { error: waiverError } = await supabaseAdmin
        .from('waivers')
        .upsert(
          {
            member_id: memberId,
            event_id: eventId,
            waiver_version: version,
            waiver_text: snapshot,
            signature_name: waiver.signatureName.trim(),
            signature_date: waiver.signatureDate,
            emergency_contact_name: waiver.emergencyContactName,
            emergency_contact_phone: waiver.emergencyContactPhone,
            is_21_plus: is21Plus === true,
            agreed: true,
          },
          { onConflict: 'member_id,event_id' }
        );

      if (waiverError) throw waiverError;
    }
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

export async function getRsvpById(rsvpId: string): Promise<Rsvp | null> {
  const { data, error } = await supabaseAdmin
    .from('rsvps')
    .select('*')
    .eq('id', rsvpId)
    .maybeSingle();

  if (error) throw error;
  return (data as Rsvp) ?? null;
}

export type ConfirmOutcome = 'confirmed' | 'already_confirmed' | 'not_approved' | 'not_found';

/**
 * Records that an approved player will attend. Only approved players can
 * confirm; confirming twice is harmless. The status is untouched, so the
 * email webhook sees no status change and sends nothing.
 */
export async function confirmAttendance(rsvpId: string): Promise<ConfirmOutcome> {
  const rsvp = await getRsvpById(rsvpId);
  if (!rsvp) return 'not_found';
  if (rsvp.attendee_type !== 'player' || rsvp.status !== 'approved') return 'not_approved';
  if (rsvp.attendance_confirmed_at) return 'already_confirmed';

  const { error } = await supabaseAdmin
    .from('rsvps')
    .update({ attendance_confirmed_at: new Date().toISOString() })
    .eq('id', rsvpId)
    .is('attendance_confirmed_at', null);

  if (error) throw error;
  return 'confirmed';
}

export async function cancelRsvp(eventId: string, memberId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('rsvps')
    .delete()
    .eq('event_id', eventId)
    .eq('member_id', memberId);

  if (error) throw error;
}
