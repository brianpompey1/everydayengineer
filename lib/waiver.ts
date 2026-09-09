/**
 * Liability waiver text.
 *
 * This is a legal document. The exact wording is stored alongside every
 * signature (see the `waivers` table) so a signature can always be tied back
 * to the text that was in force on the day it was signed.
 *
 * If the wording changes, bump WAIVER_VERSION rather than editing in place —
 * existing signatures keep their original snapshot either way, but the version
 * makes it obvious which cohort agreed to what.
 */
export const WAIVER_VERSION = '2026-07-25.1';

export const WAIVER_TITLE = 'Everyday Engineer Club Basketball Waiver';

export const WAIVER_INTRO =
  'Please read and sign this waiver before participating in the Everyday Engineer Club — Basketball Run.';

export const WAIVER_PARAGRAPHS: string[] = [
  'I understand and acknowledge that participation in basketball and related physical activities involves inherent risks, including but not limited to physical injury, illness, accidents, or death. I voluntarily choose to participate in the Everyday Engineer Club basketball run and assume full responsibility for all risks associated with participation.',
  'In consideration of being permitted to participate in this event, I hereby release, waive, discharge, and hold harmless Everyday Engineer Club, its founders, organizers, volunteers, partners, sponsors, and affiliates from any and all claims, demands, actions, or causes of action arising out of or related to any injury, loss, or damage sustained by me, whether caused by negligence or otherwise.',
  'I confirm that I am physically capable of participating in this event and that I have no medical conditions that would prevent me from safely engaging in physical activity. I understand that I am solely responsible for any medical care, treatment, or expenses incurred as a result of injury.',
  'I acknowledge and agree that photographs and video recordings may be taken during the event. I grant Everyday Engineer Club the irrevocable right to use such media for promotional, marketing, documentation, and social media purposes without compensation or further approval.',
  'I agree to conduct myself in a respectful and safe manner at all times. I understand that failure to comply with event rules or unsafe behavior may result in removal from the event.',
];

export const WAIVER_AGREE_LABEL = 'Yes, I understand and agree.';
export const WAIVER_AGE_LABEL = 'I confirm that I am 21 years of age or older.';

/** The full text stored with a signature. */
export const WAIVER_FULL_TEXT = WAIVER_PARAGRAPHS.join('\n\n');
