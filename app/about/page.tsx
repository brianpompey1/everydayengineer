import Link from 'next/link';
import Image from 'next/image';
import EENav from '../components/EENav';
import EEFooter from '../components/EEFooter';

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--ee-paper)' }}>
      <EENav />

      {/* Masthead */}
      <section style={{ padding: '40px 56px 0' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--ee-ink)',
            paddingBottom: 14,
            fontFamily: 'var(--ee-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          <span>About · Everyday Engineer Club</span>
          <span>Est. 2025 · New York, NY</span>
        </div>
      </section>

      {/* Founder */}
      <section style={{ padding: '64px 56px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 56,
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 8, overflow: 'hidden' }}>
            <Image
              src="/founder.png"
              alt="Guitry Germain, Founder"
              fill
              style={{ objectFit: 'cover', objectPosition: 'top' }}
            />
          </div>
          <div>
            <div className="ee-eyebrow">THE FOUNDER</div>
            <h1
              className="ee-h1"
              style={{ marginTop: 16, fontSize: 56 }}
            >
              Meet Guitry Germain
            </h1>
            <p className="ee-body" style={{ marginTop: 28, fontSize: 18, lineHeight: 1.6 }}>
              Everyday Engineer Club started with a simple belief: engineers deserve a community outside of work.
            </p>
            <p className="ee-body" style={{ marginTop: 20, fontSize: 16, lineHeight: 1.65 }}>
              After spending years working on major infrastructure projects while creating content that showed the everyday life of an engineer, Guitry saw an opportunity to build something different—a community where engineers could connect beyond the workplace through movement, conversation, creativity, and shared experiences.
            </p>
            <p className="ee-body" style={{ marginTop: 20, fontSize: 16, lineHeight: 1.65 }}>
              Today, Everyday Engineer Club exists to celebrate engineering culture and bring together people who are building both their careers and themselves.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 32 }}>
              <a
                href="https://www.linkedin.com/in/guitrygermain/"
                target="_blank"
                rel="noopener noreferrer"
                className="ee-btn-link"
                style={{ alignSelf: 'center' }}
              >
                LinkedIn Profile ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About the club */}
      <section style={{ padding: '96px 56px', background: 'var(--ee-paper-2)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div className="ee-eyebrow">ABOUT EVERYDAY ENGINEER CLUB</div>
          <h2
            style={{
              fontFamily: 'var(--ee-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 56,
              margin: '16px 0 0',
              letterSpacing: '-0.02em',
            }}
          >
            Building a community beyond the workplace.
          </h2>

          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'left' }}>
            <p className="ee-body" style={{ fontSize: 18, lineHeight: 1.65 }}>
              Everyday Engineer Club is a community for engineers and ambitious professionals who believe there's more to engineering than the workday.
            </p>
            <p className="ee-body" style={{ fontSize: 18, lineHeight: 1.65 }}>
              We bring people together through events, content, and thoughtfully designed products that celebrate engineering culture and encourage connection, wellness, and personal growth.
            </p>
            <p className="ee-body" style={{ fontSize: 18, lineHeight: 1.65 }}>
              Whether it's a morning run, a basketball game, a networking event, or simply sharing the everyday life of an engineer, our goal is to create opportunities for people to meet, learn, and grow together.
            </p>
            <p className="ee-body" style={{ fontSize: 18, lineHeight: 1.65 }}>
              We believe the strongest careers are built on more than technical skills—they're built on meaningful relationships, curiosity, and experiences shared with others.
            </p>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section
        style={{
          padding: '120px 56px',
          background: 'var(--ee-navy-900)',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--ee-display)',
            fontStyle: 'italic',
            fontSize: 64,
            lineHeight: 1.1,
            maxWidth: 700,
            margin: '0 auto 48px',
            letterSpacing: '-0.02em',
          }}
        >
          Welcome to the Club.
        </p>
        <Link href="/signup" className="ee-btn ee-btn-primary">
          Create your account →
        </Link>
      </section>

      <EEFooter />
    </div>
  );
}
