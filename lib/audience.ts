import { Resend } from 'resend';

/**
 * Keeps the Resend contact list in step with site sign-ups, so email blasts
 * (Resend Broadcasts) always reach every member.
 *
 * Contacts go into the segment named by RESEND_MEMBERS_SEGMENT_ID — pick
 * that segment when sending a broadcast. Unsubscribes are handled by Resend
 * and are never undone from here: an existing contact is left as it is.
 *
 * Best-effort throughout: a Resend problem must never break signing up.
 */
function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export async function addMemberContact(member: { email: string; fullName: string | null }): Promise<void> {
  const resend = client();
  const segmentId = process.env.RESEND_MEMBERS_SEGMENT_ID;
  if (!resend || !member.email) return;

  const [firstName, ...rest] = (member.fullName ?? '').trim().split(/\s+/).filter(Boolean);
  try {
    const { error } = await resend.contacts.create({
      email: member.email,
      firstName: firstName || undefined,
      lastName: rest.join(' ') || undefined,
      segments: segmentId ? [{ id: segmentId }] : undefined,
    });
    // Already a contact (e.g. a returning member) is fine — and leaving them
    // untouched keeps any earlier unsubscribe in place.
    if (error && !/already exists/i.test(error.message)) {
      console.error('[audience] could not add contact:', error);
    }
  } catch (err) {
    console.error('[audience] could not add contact:', err);
  }
}

export async function removeMemberContact(email: string): Promise<void> {
  const resend = client();
  if (!resend || !email) return;
  try {
    const { error } = await resend.contacts.remove({ email });
    if (error && !/not found/i.test(error.message)) {
      console.error('[audience] could not remove contact:', error);
    }
  } catch (err) {
    console.error('[audience] could not remove contact:', err);
  }
}
