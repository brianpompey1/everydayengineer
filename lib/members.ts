import { supabaseAdmin } from './supabase';

export interface Member {
  id: string;
  clerk_id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  location: string | null;
  bio: string | null;
  role: string;
  discipline: string | null;
  company: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  joined_at: string;
  updated_at: string;
}

interface ClerkUserInput {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
}

export async function getOrCreateMember(clerkUser: ClerkUserInput): Promise<Member> {
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('members')
    .select('*')
    .eq('clerk_id', clerkUser.id)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (existing) return existing as Member;

  // No row for this clerk_id. A row may still exist under the same email —
  // most commonly because the Clerk instance changed (dev -> production issues
  // brand new user ids for the same people). members.email is UNIQUE, so
  // inserting blindly would throw. Re-link the existing row instead.
  if (clerkUser.email) {
    const { data: byEmail, error: emailFetchError } = await supabaseAdmin
      .from('members')
      .select('*')
      .eq('email', clerkUser.email)
      .maybeSingle();

    if (emailFetchError) throw emailFetchError;

    if (byEmail) {
      const { data: relinked, error: relinkError } = await supabaseAdmin
        .from('members')
        .update({
          clerk_id: clerkUser.id,
          full_name: clerkUser.fullName ?? byEmail.full_name,
          avatar_url: clerkUser.avatarUrl ?? byEmail.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', byEmail.id)
        .select('*')
        .single();

      if (relinkError) throw relinkError;
      return relinked as Member;
    }
  }

  const { data: created, error: insertError } = await supabaseAdmin
    .from('members')
    .insert({
      clerk_id: clerkUser.id,
      email: clerkUser.email,
      full_name: clerkUser.fullName,
      avatar_url: clerkUser.avatarUrl,
    })
    .select('*')
    .single();

  if (insertError) throw insertError;
  return created as Member;
}

export function isProfileComplete(member: Member): boolean {
  return Boolean(member.bio && member.discipline);
}

export async function setMemberDiscipline(clerkId: string, discipline: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('members')
    .update({ discipline })
    .eq('clerk_id', clerkId);

  if (error) throw error;
}
