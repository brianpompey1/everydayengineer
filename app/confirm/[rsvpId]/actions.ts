'use server';

import { redirect } from 'next/navigation';
import { verifyConfirmToken } from '@/lib/confirm';
import { confirmAttendance } from '@/lib/rsvps';

/**
 * Confirmation happens on an explicit button press (a POST), never on page
 * load. Email security scanners follow links automatically to inspect them,
 * which would otherwise mark players confirmed without them ever opening it.
 */
export async function confirmAttendanceAction(rsvpId: string, token: string): Promise<void> {
  if (verifyConfirmToken(rsvpId, token)) {
    await confirmAttendance(rsvpId);
  }
  redirect(`/confirm/${rsvpId}?t=${encodeURIComponent(token)}`);
}
