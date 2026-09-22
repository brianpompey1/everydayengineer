/**
 * Per-event liability waivers.
 *
 * Each event carries its own waiver (events.waiver_title / waiver_text /
 * waiver_agree_label). An event with no waiver_text has no waiver step.
 * There is deliberately no fallback waiver: a missing waiver must never be
 * silently replaced by one written for a different activity.
 *
 * These are legal documents. The exact text shown — title, body and the
 * consent label — is snapshotted with every signature (see `waivers`), so
 * editing an event's waiver later never changes what someone agreed to.
 *
 * This module is imported by client components, so it must stay free of
 * server-only dependencies.
 */

export const AGE_21_LABEL = 'I confirm that I am 21 years of age or older.';
const DEFAULT_AGREE_LABEL = 'Yes, I understand and agree.';

export interface EventWaiver {
  title: string;
  /** Split on blank lines; single line breaks inside a paragraph are kept. */
  paragraphs: string[];
  agreeLabel: string;
}

interface WaiverFields {
  waiver_title: string | null;
  waiver_text: string | null;
  waiver_agree_label: string | null;
}

export function readEventWaiver(event: WaiverFields): EventWaiver | null {
  const text = (event.waiver_text ?? '').trim();
  if (!text) return null;
  return {
    title: event.waiver_title?.trim() || 'Participant Waiver',
    paragraphs: text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    agreeLabel: event.waiver_agree_label?.trim() || DEFAULT_AGREE_LABEL,
  };
}

/** Exactly what the participant saw and agreed to, as stored with their signature. */
export function waiverSnapshot(w: EventWaiver): string {
  return [w.title, ...w.paragraphs, `[Agreed to: ${w.agreeLabel}]`].join('\n\n');
}

/**
 * The basketball run waiver, as provided by the organizer. Kept here as the
 * source for populating basketball events' waiver columns.
 */
export const BASKETBALL_WAIVER = {
  title: 'Everyday Engineer Club Basketball Waiver',
  agreeLabel: DEFAULT_AGREE_LABEL,
  text: [
    'I understand and acknowledge that participation in basketball and related physical activities involves inherent risks, including but not limited to physical injury, illness, accidents, or death. I voluntarily choose to participate in the Everyday Engineer Club basketball run and assume full responsibility for all risks associated with participation.',
    'In consideration of being permitted to participate in this event, I hereby release, waive, discharge, and hold harmless Everyday Engineer Club, its founders, organizers, volunteers, partners, sponsors, and affiliates from any and all claims, demands, actions, or causes of action arising out of or related to any injury, loss, or damage sustained by me, whether caused by negligence or otherwise.',
    'I confirm that I am physically capable of participating in this event and that I have no medical conditions that would prevent me from safely engaging in physical activity. I understand that I am solely responsible for any medical care, treatment, or expenses incurred as a result of injury.',
    'I acknowledge and agree that photographs and video recordings may be taken during the event. I grant Everyday Engineer Club the irrevocable right to use such media for promotional, marketing, documentation, and social media purposes without compensation or further approval.',
    'I agree to conduct myself in a respectful and safe manner at all times. I understand that failure to comply with event rules or unsafe behavior may result in removal from the event.',
  ].join('\n\n'),
};
