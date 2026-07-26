import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getOrCreateMember, setMemberDiscipline } from '@/lib/members';

export async function POST(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const { discipline } = await req.json();
  if (typeof discipline !== 'string' || !discipline.trim()) {
    return NextResponse.json({ error: 'Missing discipline' }, { status: 400 });
  }

  await getOrCreateMember({
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
    fullName: clerkUser.fullName,
    avatarUrl: clerkUser.imageUrl,
  });
  await setMemberDiscipline(clerkUser.id, discipline.trim());

  return NextResponse.json({ ok: true });
}
