'use server';

import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { getOrCreateMember, updateMemberProfile, type MemberProfileInput } from '@/lib/members';
import { submitRsvp, cancelRsvp, type AttendeeType } from '@/lib/rsvps';
import { getEventById } from '@/lib/events';
import { sendEmail, spectatorConfirmed, playerRequestReceived } from '@/lib/email';

export interface RsvpActionResult {
  ok: boolean;
  error?: string;
}

export interface RsvpFormInput {
  eventId: string;
  attendeeType: AttendeeType;
  profile?: MemberProfileInput;
  waiver?: {
    signatureName: string;
    signatureDate: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    is21Plus: boolean;
  };
}

async function requireMember() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  const member = await getOrCreateMember({
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
    fullName: clerkUser.fullName,
    avatarUrl: clerkUser.imageUrl,
  });
  return { clerkUser, member };
}

export async function rsvpAction(input: RsvpFormInput): Promise<RsvpActionResult> {
  try {
    const ctx = await requireMember();
    if (!ctx) return { ok: false, error: 'You need to be signed in to RSVP.' };

    const { clerkUser, member } = ctx;

    // Players must be 21+. Trust the stored profile value over the submitted
    // one where we already have it, so this can't be bypassed client-side.
    if (input.attendeeType === 'player') {
      const declared = input.waiver?.is21Plus ?? input.profile?.is_21_plus;
      const known = member.is_21_plus;
      const is21 = known === null ? declared : known && declared !== false;
      if (!is21) {
        return {
          ok: false,
          error: 'Participants must be 21 or older to play. You’re welcome to attend as a spectator.',
        };
      }
    }

    if (input.profile) {
      await updateMemberProfile(clerkUser.id, input.profile);
    }

    await submitRsvp({
      eventId: input.eventId,
      memberId: member.id,
      attendeeType: input.attendeeType,
      waiver: input.waiver,
    });

    // Immediate acknowledgement. Approve/waitlist mail is sent later by the
    // Supabase webhook, since those status changes happen outside the app.
    // Never let a mail failure fail the RSVP itself.
    try {
      const event = await getEventById(input.eventId);
      if (event && member.email) {
        const ctx = {
          eventTitle: event.title,
          eventDate: event.event_date,
          location: event.location,
          memberName: member.full_name,
        };
        const mail =
          input.attendeeType === 'spectator'
            ? spectatorConfirmed(ctx)
            : playerRequestReceived(ctx);
        await sendEmail({ to: member.email, ...mail });
      }
    } catch (mailErr) {
      console.error('[rsvp] confirmation email failed:', mailErr);
    }

    revalidatePath(`/events/${input.eventId}`);
    revalidatePath('/events');
    revalidatePath('/today');
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
    return { ok: false, error: message };
  }
}

export async function cancelRsvpAction(eventId: string): Promise<RsvpActionResult> {
  try {
    const ctx = await requireMember();
    if (!ctx) return { ok: false, error: 'You need to be signed in.' };

    await cancelRsvp(eventId, ctx.member.id);

    revalidatePath(`/events/${eventId}`);
    revalidatePath('/events');
    revalidatePath('/today');
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
    return { ok: false, error: message };
  }
}
