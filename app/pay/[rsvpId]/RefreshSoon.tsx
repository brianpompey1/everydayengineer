'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Re-checks the payment a few times while Stripe's confirmation arrives. */
export default function RefreshSoon({ attempt }: { attempt: number }) {
  const router = useRouter();
  useEffect(() => {
    if (attempt >= 10) return;
    const id = setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set('try', String(attempt + 1));
      router.replace(url.pathname + url.search);
    }, 2000);
    return () => clearTimeout(id);
  }, [attempt, router]);
  return null;
}
