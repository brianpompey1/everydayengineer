import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import EEMemberNav from '../components/EEMemberNav';
import EEFooter from '../components/EEFooter';
import { getPublishedEvents, getMemberRsvpMap } from '@/lib/events';
import { getOrCreateMember } from '@/lib/members';
import EventsListClient, { type EventListItem } from './EventsListClient';

export default async function EventsPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/signin');

  const member = await getOrCreateMember({
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
    fullName: clerkUser.fullName,
    avatarUrl: clerkUser.imageUrl,
  });

  const [events, rsvpMap] = await Promise.all([
    getPublishedEvents(),
    getMemberRsvpMap(member.id),
  ]);

  const items: EventListItem[] = events.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    location: e.location,
    eventDate: e.event_date,
    capacity: e.capacity,
    going: e.rsvp_count ?? 0,
    rsvpStatus: rsvpMap[e.id] ?? null,
  }));

  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EEMemberNav />
      <EventsListClient events={items} />
      <EEFooter />
    </div>
  );
}
