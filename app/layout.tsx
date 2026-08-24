import type { Metadata } from 'next';
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Everyday Engineer Club — Engineering Culture, Reimagined.',
  description:
    'Everyday Engineer Club is a lifestyle community for engineers and ambitious professionals who are building more than just their careers. New York, NY.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
      >
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
