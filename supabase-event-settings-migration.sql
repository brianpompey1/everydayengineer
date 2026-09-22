-- ============================================================
-- Per-event RSVP settings
-- Run in: Supabase Dashboard → SQL Editor → New query
--
-- Every event used to assume the basketball run: spectators allowed,
-- 21+ required, and the basketball waiver. Each is now set per event
-- in the Table Editor.
-- ============================================================

-- Uncheck for participant-only events (no "come watch" option).
alter table events add column if not exists allow_spectators boolean not null default true;

-- Participants must confirm they are 21 or older.
alter table events add column if not exists requires_21_plus boolean not null default true;

-- The waiver participants sign for this event. Leave waiver_text empty for
-- events that need no waiver. Paragraphs are separated by a blank line.
-- The exact text is snapshotted with every signature, so editing it later
-- never changes what someone already agreed to.
alter table events add column if not exists waiver_title       text;
alter table events add column if not exists waiver_text        text;
alter table events add column if not exists waiver_agree_label text;

-- ── Event setup ─────────────────────────────────────────────

-- Basketball events: the existing basketball waiver.
update events set
  waiver_title       = $w$Everyday Engineer Club Basketball Waiver$w$,
  waiver_text        = $w$I understand and acknowledge that participation in basketball and related physical activities involves inherent risks, including but not limited to physical injury, illness, accidents, or death. I voluntarily choose to participate in the Everyday Engineer Club basketball run and assume full responsibility for all risks associated with participation.

In consideration of being permitted to participate in this event, I hereby release, waive, discharge, and hold harmless Everyday Engineer Club, its founders, organizers, volunteers, partners, sponsors, and affiliates from any and all claims, demands, actions, or causes of action arising out of or related to any injury, loss, or damage sustained by me, whether caused by negligence or otherwise.

I confirm that I am physically capable of participating in this event and that I have no medical conditions that would prevent me from safely engaging in physical activity. I understand that I am solely responsible for any medical care, treatment, or expenses incurred as a result of injury.

I acknowledge and agree that photographs and video recordings may be taken during the event. I grant Everyday Engineer Club the irrevocable right to use such media for promotional, marketing, documentation, and social media purposes without compensation or further approval.

I agree to conduct myself in a respectful and safe manner at all times. I understand that failure to comply with event rules or unsafe behavior may result in removal from the event.$w$,
  waiver_agree_label = $w$Yes, I understand and agree.$w$
where id in ('42deb1af-908f-4c6b-bbe8-4196395a680c', 'c4305319-fa1d-4a9c-8046-65e38c85c7d7', 'e8c96f93-cabc-4d92-abaf-8f87498522b2', '5bc99141-d380-4d3d-8660-6e9932ea7e55', '01cf1358-c8b7-49ee-9543-a5bb28ccfd3a');

-- Recovery & Reset: participants only, 21+, same waiver body with its own signature clause.
update events set
  allow_spectators   = false,
  requires_21_plus   = true,
  waiver_title       = $w$Participant Acknowledgment, Assumption of Risk and Limited Release$w$,
  waiver_text        = $w$I understand and acknowledge that participation in basketball and related physical activities involves inherent risks, including but not limited to physical injury, illness, accidents, or death. I voluntarily choose to participate in the Everyday Engineer Club basketball run and assume full responsibility for all risks associated with participation.

In consideration of being permitted to participate in this event, I hereby release, waive, discharge, and hold harmless Everyday Engineer Club, its founders, organizers, volunteers, partners, sponsors, and affiliates from any and all claims, demands, actions, or causes of action arising out of or related to any injury, loss, or damage sustained by me, whether caused by negligence or otherwise.

I confirm that I am physically capable of participating in this event and that I have no medical conditions that would prevent me from safely engaging in physical activity. I understand that I am solely responsible for any medical care, treatment, or expenses incurred as a result of injury.

I acknowledge and agree that photographs and video recordings may be taken during the event. I grant Everyday Engineer Club the irrevocable right to use such media for promotional, marketing, documentation, and social media purposes without compensation or further approval.

I agree to conduct myself in a respectful and safe manner at all times. I understand that failure to comply with event rules or unsafe behavior may result in removal from the event.$w$,
  waiver_agree_label = $w$I confirm that I am at least 18 years old and have read, understood, and voluntarily agree to the Participant Acknowledgment, Assumption of Risk and Limited Release for Everyday Engineer Club's Recovery & Reset event on September 25, 2026. I acknowledge the risks of participation and agree to follow all event and venue rules. I also consent to photography and video before, during, or after the event in venue-approved areas, and to EEC's use of my image, likeness, and recorded voice for event recaps and promotional materials without compensation, subject to the privacy protections, usage limits, and withdrawal terms stated above. I understand that this agreement affects certain legal rights and does not replace Lore Bathing Club's separate waiver. By checking this box and submitting my full name, I intend to sign this agreement electronically.$w$
where id = '969b87a8-8653-4835-9708-7947b81af618';
