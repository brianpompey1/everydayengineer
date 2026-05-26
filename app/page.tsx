import Link from 'next/link';
import Image from 'next/image';
import EENav from './components/EENav';
import EEFooter from './components/EEFooter';
import EEPhoto from './components/EEPhoto';
import NewsletterForm from './components/NewsletterForm';

const PILLARS = [
  {
    num: '01',
    icon: '◎',
    title: 'Culture & Identity',
    body: 'Defining what it means to be a professional today. We bridge the technical and the aesthetic through curated identity narratives.',
  },
  {
    num: '02',
    icon: '◆',
    title: 'Connection & Community',
    body: 'Access to an exclusive network of high-performers. From deep-tech workshops to weekend retreats, we build the bridges that matter.',
  },
  {
    num: '03',
    icon: '◇',
    title: 'Wellness & Intention',
    body: 'Engineering longevity through intentional habits. We focus on the holistic health of the practitioner.',
  },
];

const PRODUCTS = [
  { name: 'EE Signature Hat', sub: 'Midnight Black / Gold', price: '$35', tone: 'dark' as const },
  { name: 'Foundation Tee', sub: 'Engineered Cotton', price: '$45', tone: 'paper' as const },
  { name: 'System Hoodie', sub: 'Charcoal Gray', price: '$85', tone: 'cool' as const },
  { name: 'Tech Vessel', sub: 'Insulated Steel', price: '$40', tone: 'warm' as const },
];

const GRID_PHOTOS = [
  { tone: 'court' as const, label: 'SOCIETY HOOPS · WED LEAGUE', span: 'span 2 / span 2' },
  { tone: 'paper' as const, label: 'WELLNESS RETREAT · CATSKILLS', span: '' },
  { tone: 'warm' as const, label: 'NETWORKING · DUMBO LOFT', span: '' },
  { tone: 'dark' as const, label: 'DEEP-TECH WORKSHOP', span: '' },
  { tone: 'cool' as const, label: 'FIELD JOURNAL · ISSUE 12', span: '' },
];

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EENav />

      {/* HERO */}
      <section className="ee-hero">
        <Image
          src="/hero.jpg"
          alt="Everyday Engineer community"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(10,19,37,0.88) 0%, rgba(10,19,37,0.45) 55%, rgba(10,19,37,0.1) 100%)',
          }}
        />
        <div className="ee-hero-inner">
          <div className="ee-mono" style={{ color: 'var(--ee-gold)', marginBottom: 20 }}>
            EST. 2024 · NEW YORK, NY
          </div>
          <h1 className="ee-h1 ee-hero-headline">
            Engineering<br />
            <span style={{ color: 'var(--ee-gold)' }}>Culture,</span><br />
            Reimagined.
          </h1>
          <p
            className="ee-body"
            style={{ color: 'rgba(255,255,255,0.78)', maxWidth: 520, marginTop: 28, fontSize: 18 }}
          >
            A curated community where technical excellence meets lifestyle elevation. Join the collective of everyday engineers shaping the future.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
            <Link href="/signup" className="ee-btn ee-btn-primary">
              Create your account
            </Link>
            <Link
              href="/journal"
              className="ee-btn ee-btn-ghost"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Read the journal
            </Link>
          </div>
        </div>
        <div className="ee-hero-meta">
          <span>40.6782° N · 73.9442° W</span>
          <span className="ee-dot">·</span>
          <span>VOL. 03 · ISSUE 04</span>
          <span className="ee-dot">·</span>
          <span>FIELD MEMBERS · 1,247</span>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="ee-section" style={{ background: 'var(--ee-lavender)' }}>
        <div className="ee-grid-pillars-hd">
          <div>
            <div className="ee-eyebrow">OUR FOUNDATION</div>
            <h2 className="ee-h2" style={{ marginTop: 16 }}>The Three Pillars</h2>
          </div>
          <div className="ee-rail" style={{ alignSelf: 'end' }}>
            <p className="ee-body" style={{ fontSize: 17, maxWidth: 520 }}>
              Architecture isn't just for buildings. We engineer the lifestyle that supports the mind behind the machine.
            </p>
          </div>
        </div>
        <div className="ee-grid-col3">
          {PILLARS.map((p) => (
            <div
              key={p.num}
              className="ee-card ee-card-hover"
              style={{
                padding: 36,
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                minHeight: 300,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="ee-mono" style={{ color: 'var(--ee-gold)' }}>{p.num} / 03</span>
                <span
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'var(--ee-lavender-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--ee-gold-deep)',
                    fontSize: 18,
                  }}
                >
                  {p.icon}
                </span>
              </div>
              <h3 className="ee-h3" style={{ marginTop: 'auto' }}>{p.title}</h3>
              <p className="ee-body" style={{ fontSize: 14 }}>{p.body}</p>
              <Link href="/membership" className="ee-btn-link" style={{ alignSelf: 'flex-start' }}>
                Read more →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOUNDER */}
      <section className="ee-section ee-grid-founder">
        <EEPhoto
          tone="warm"
          label="PORTRAIT · GUITRY GERMAIN, FOUNDER"
          style={{ aspectRatio: '4/5', borderRadius: 8 }}
        />
        <div>
          <div className="ee-eyebrow">THE FOUNDER</div>
          <h2 className="ee-h2" style={{ marginTop: 16, fontSize: 64 }}>
            Meet Guitry<br />Germain
          </h2>
          <p className="ee-body" style={{ marginTop: 28, fontSize: 17 }}>
            Guitry Germain founded Emerging Estates with a single mission: to provide the modern engineer with a space that honors both their technical intellect and their human potential.
          </p>
          <blockquote
            style={{
              margin: '36px 0',
              padding: '0 0 0 28px',
              borderLeft: '3px solid var(--ee-gold)',
              fontFamily: 'var(--ee-display)',
              fontStyle: 'italic',
              fontSize: 24,
              lineHeight: 1.35,
              color: 'var(--ee-ink)',
            }}
          >
            "We spend our lives building systems for the world; it's time we engineered a community for ourselves."
          </blockquote>
          <p className="ee-body" style={{ fontSize: 15 }}>
            With a background in complex systems and a passion for elite performance, Guitry has curated an ecosystem that prioritizes depth, connection, and the pursuit of mastery.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 32 }}>
            <Link href="/about" className="ee-btn ee-btn-dark">
              Read the full story
            </Link>
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
      </section>

      {/* COMMUNITY GRID */}
      <section className="ee-section" style={{ background: 'var(--ee-lavender)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="ee-eyebrow">THE FIELD</div>
          <h2 className="ee-h2" style={{ marginTop: 16 }}>Community in Action</h2>
          <p className="ee-body" style={{ marginTop: 16, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Beyond the screen. Real moments of connection, competition, and growth.
          </p>
        </div>
        <div className="ee-grid-community">
          <EEPhoto tone="court" label="SOCIETY HOOPS · WED LEAGUE" style={{ gridColumn: 'span 2', gridRow: 'span 2' }} />
          <EEPhoto tone="paper" label="WELLNESS RETREAT · CATSKILLS" />
          <EEPhoto tone="warm" label="NETWORKING · DUMBO LOFT" />
          <EEPhoto tone="dark" label="DEEP-TECH WORKSHOP" />
          <EEPhoto tone="cool" label="FIELD JOURNAL · ISSUE 12" />
        </div>
      </section>

      {/* SHOP TEASER */}
      <section className="ee-section" style={{ background: 'var(--ee-lavender-2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="ee-eyebrow">THE SHOP</div>
            <h2 className="ee-h2" style={{ marginTop: 16 }}>Wear the Movement</h2>
          </div>
          <Link href="/shop" className="ee-btn-link">View all gear ↗</Link>
        </div>
        <div className="ee-grid-col4">
          {PRODUCTS.map((p) => (
            <Link
              key={p.name}
              href="/shop"
              style={{
                background: 'var(--ee-paper)',
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid var(--ee-line)',
                display: 'block',
              }}
              className="ee-card-hover"
            >
              <EEPhoto
                tone={p.tone}
                label={p.name.toUpperCase()}
                style={{ aspectRatio: '1/1', borderRadius: 0 }}
                className="ee-product-img"
              />
              <div style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</div>
                  <div className="ee-small" style={{ marginTop: 2 }}>{p.sub}</div>
                </div>
                <div style={{ color: 'var(--ee-gold-deep)', fontWeight: 700, fontSize: 15 }}>{p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NEWSLETTER / DISPATCH */}
      <section className="ee-section-sm" style={{ background: 'var(--ee-navy-900)', color: 'var(--ee-paper)' }}>
        <div className="ee-grid-newsletter">
          <div>
            <div className="ee-eyebrow">DISPATCH</div>
            <h2 className="ee-h2" style={{ marginTop: 16, color: '#fff' }}>Stay in the Loop</h2>
            <p style={{ marginTop: 18, color: 'rgba(255,255,255,0.7)', fontSize: 16, maxWidth: 480 }}>
              Weekly insights on engineering culture, lifestyle curation, and community updates delivered to your inbox.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      <EEFooter />
    </div>
  );
}
