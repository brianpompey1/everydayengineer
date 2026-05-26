import Link from 'next/link';
import EENav from '../components/EENav';
import EEFooter from '../components/EEFooter';
import EEPhoto from '../components/EEPhoto';

const TIMELINE = [
  { y: '2008', t: 'MIT — Computer Science', d: 'Studied complex systems and distributed computing. First open-source contributions to networking infrastructure.' },
  { y: '2012', t: 'Senior Engineer, Square', d: 'Built core payment processing systems handling millions of daily transactions across the Caribbean diaspora corridor.' },
  { y: '2017', t: 'Director of Engineering, Stripe', d: 'Led platform reliability. Began informal Sunday brunches with technologists in Brooklyn — the seed of the community.' },
  { y: '2020', t: 'Sabbatical · Field Photography', d: 'Six months across Haiti, Dakar, and Lisbon documenting engineering communities and the lives behind the work.' },
  { y: '2023', t: 'Emerging Estates Founded', d: 'Formal launch of the collective in Brooklyn with 40 founding members.' },
  { y: '2026', t: '1,247 members · 14 cities', d: 'Now a global field of engineers across NYC, Atlanta, Lagos, London, Toronto, and beyond.' },
];

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--ee-paper)' }}>
      <EENav />

      {/* Magazine cover masthead */}
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
          <span>Field Journal · No. 12</span>
          <span>The Founder Issue</span>
          <span>May 2026 · New York</span>
        </div>
      </section>

      {/* Hero editorial */}
      <section style={{ padding: '56px 56px 64px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 56,
            marginTop: 0,
            alignItems: 'center',
          }}
        >
          <div>
            <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)', marginBottom: 24 }}>
              FEATURE · 4,200 WORDS · 18 MIN READ
            </div>
            <h1
              style={{
                fontFamily: 'var(--ee-display)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 144,
                lineHeight: 0.92,
                letterSpacing: '-0.025em',
                margin: 0,
              }}
            >
              The man who<br />built the field.
            </h1>
            <p className="ee-body" style={{ marginTop: 32, fontSize: 19, maxWidth: 520, lineHeight: 1.5 }}>
              Guitry Germain spent eight years scaling payments infrastructure. Then he gave it up to engineer something with no API: a community of his own.
            </p>
            <div
              style={{
                marginTop: 40,
                fontFamily: 'var(--ee-mono)',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ee-ink-3)',
              }}
            >
              By the Editors · Photography by G. Germain
            </div>
          </div>
          <EEPhoto
            tone="warm"
            label="THE FOUNDER · BROOKLYN STUDIO"
            style={{ aspectRatio: '3/4' }}
          />
        </div>
      </section>

      {/* Article body */}
      <section style={{ padding: '80px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 7fr 4fr', gap: 56 }}>
          <div
            className="ee-mono"
            style={{ color: 'var(--ee-ink-3)', textAlign: 'right', position: 'sticky', top: 96 }}
          >
            § I<br />
            <span style={{ color: 'var(--ee-ink)' }}>Bed-Stuy<br />brunches</span>
          </div>
          <div>
            <p style={{ fontSize: 21, lineHeight: 1.55, color: 'var(--ee-ink)', margin: 0 }}>
              <span
                style={{
                  float: 'left',
                  fontFamily: 'var(--ee-display)',
                  fontStyle: 'italic',
                  fontSize: 128,
                  lineHeight: 0.85,
                  marginRight: 14,
                  marginTop: 8,
                  color: 'var(--ee-gold-deep)',
                }}
              >
                I
              </span>
              n 2017, on a Sunday in Bed-Stuy, four engineers met for brunch. None of them had planned a community. They were just tired — of the same conferences, the same Slack channels, the same patterns of professional life that asked them to perform their work and not their lives.
            </p>
            <p style={{ marginTop: 24, fontSize: 18, lineHeight: 1.65, clear: 'both' }}>
              One of them was Guitry Germain. By then he was a Director of Engineering at Stripe, a Brooklyn-born son of Haitian immigrants, MIT-trained, and quietly suspicious that the technology industry's idea of "community" was a poor substitute for the real thing.
            </p>
            <p style={{ marginTop: 18, fontSize: 18, lineHeight: 1.65 }}>
              "It was supposed to be one brunch," he says now, six years later, sitting in the loft that has become Emerging Estates' headquarters. "But everyone kept showing up. And bringing one more person. And then the photographer in me started bringing a camera."
            </p>
            <p style={{ marginTop: 18, fontSize: 18, lineHeight: 1.65 }}>
              What started as Sunday eggs is now a global field — 1,247 members across 14 cities, weekly basketball at the Society Hoops league, deep-tech labs in DUMBO, wellness retreats in the Catskills, and a quarterly print journal that rivals anything on the magazine rack.
            </p>
          </div>
          <div
            style={{
              background: 'var(--ee-lavender)',
              padding: 32,
              borderRadius: 8,
              position: 'sticky',
              top: 96,
              alignSelf: 'flex-start',
            }}
          >
            <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)', marginBottom: 18 }}>
              SIDEBAR · THE BRUNCH
            </div>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                fontSize: 14,
                color: 'var(--ee-ink-2)',
              }}
            >
              {[
                ['Started', 'Aug 2017'],
                ['First attendees', '4'],
                ['Now', 'Monthly · 80+ heads'],
                ['Location', 'EE Loft, DUMBO'],
                ['Menu', 'Eggs, dialogue, no slides'],
              ].map(([k, v]) => (
                <li key={k}>
                  <strong style={{ color: 'var(--ee-ink)' }}>{k}:</strong> {v}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pull quote */}
        <div
          style={{
            margin: '80px auto',
            textAlign: 'center',
            maxWidth: 1080,
            borderTop: '1px solid var(--ee-ink)',
            borderBottom: '1px solid var(--ee-ink)',
            padding: '64px 0',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--ee-display)',
              fontStyle: 'italic',
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              margin: 0,
              color: 'var(--ee-ink)',
            }}
          >
            "I realized I'd spent a decade engineering products for strangers. I had never engineered anything for the people I actually loved."
          </p>
          <div className="ee-mono" style={{ marginTop: 28, color: 'var(--ee-ink-3)' }}>
            — GUITRY GERMAIN, FOUNDER
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 7fr 4fr', gap: 56 }}>
          <div
            className="ee-mono"
            style={{ color: 'var(--ee-ink-3)', textAlign: 'right', position: 'sticky', top: 96 }}
          >
            § II<br />
            <span style={{ color: 'var(--ee-ink)' }}>The road,<br />the camera</span>
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'var(--ee-display)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 36,
                marginBottom: 20,
                letterSpacing: '-0.015em',
              }}
            >
              From Port-au-Prince to Lisbon, with a Leica.
            </h3>
            <p style={{ fontSize: 18, lineHeight: 1.65 }}>
              Germain took a six-month sabbatical in 2020. He flew to Haiti to visit cousins who had built a small fintech in Pétion-Ville. Then to Dakar, where a former colleague was running a network of female-led engineering bootcamps. Then Lisbon. He brought a Leica M6 and not much else.
            </p>
            <p style={{ marginTop: 18, fontSize: 18, lineHeight: 1.65 }}>
              "I shot rolls of film of engineers cooking dinner. Engineers playing soccer. Engineers showing me where their grandmothers were born." Those photographs — many of them now hanging in the Brooklyn loft — became the visual backbone of the Field Journal.
            </p>
          </div>
          <EEPhoto tone="paper" label="DAKAR · 2020" style={{ aspectRatio: '3/4' }} />
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '96px 56px', background: 'var(--ee-paper-2)' }}>
        <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)', marginBottom: 16 }}>
          APPENDIX A · CHRONOLOGY
        </div>
        <h2
          style={{
            fontFamily: 'var(--ee-display)',
            fontStyle: 'italic',
            fontSize: 80,
            fontWeight: 400,
            margin: 0,
            marginBottom: 56,
            letterSpacing: '-0.02em',
          }}
        >
          The road here.
        </h2>
        <div style={{ borderTop: '1px solid var(--ee-ink)' }}>
          {TIMELINE.map((row) => (
            <div
              key={row.y}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr 2fr',
                gap: 56,
                padding: '32px 0',
                borderBottom: '1px solid var(--ee-line)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--ee-display)',
                  fontStyle: 'italic',
                  fontSize: 56,
                  color: 'var(--ee-ink)',
                  lineHeight: 1,
                }}
              >
                {row.y}
              </div>
              <div className="ee-h4" style={{ fontSize: 22 }}>{row.t}</div>
              <p className="ee-body" style={{ fontSize: 16 }}>{row.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values manifesto */}
      <section style={{ padding: '120px 56px' }}>
        <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)', marginBottom: 16 }}>
          § MANIFESTO · FIVE STATEMENTS
        </div>
        <h2
          style={{
            fontFamily: 'var(--ee-display)',
            fontStyle: 'italic',
            fontSize: 80,
            fontWeight: 400,
            margin: 0,
            marginBottom: 56,
            letterSpacing: '-0.02em',
          }}
        >
          What we hold.
        </h2>
        <div style={{ borderTop: '1px solid var(--ee-ink)' }}>
          {[
            ['01', 'Depth over breadth.', 'We choose mastery over dilettantism. Members commit to going deep on their craft and on each other. Excellence is the baseline, not the aspiration.'],
            ['02', 'Quiet excellence.', 'Loud achievement loses its meaning. We celebrate competence in the rooms that matter most — not on social media, not at conferences, but in the field.'],
            ['03', 'Real over digital.', 'In-person is the default. Tools serve relationships; relationships do not serve tools. We build software for a living. We live for more than software.'],
            ['04', 'Systems thinking.', 'We apply the same rigor to our communities and our lives as we apply to our architectures. Everything is a system. Systems can be engineered.'],
            ['05', 'Generosity of craft.', 'What you know should flow. Mentorship is not optional. Senior members pull up; junior members push back. The field improves when we share the field.'],
          ].map(([num, title, body]) => (
            <div
              key={num}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 3fr 5fr',
                gap: 56,
                padding: '40px 0',
                borderBottom: '1px solid var(--ee-line)',
                alignItems: 'flex-start',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--ee-display)',
                  fontStyle: 'italic',
                  fontSize: 56,
                  color: 'var(--ee-gold-deep)',
                  lineHeight: 1,
                }}
              >
                {num}.
              </span>
              <h3
                style={{
                  fontFamily: 'var(--ee-display)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 36,
                  margin: 0,
                  letterSpacing: '-0.015em',
                }}
              >
                {title}
              </h3>
              <p className="ee-body" style={{ fontSize: 17, lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
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
        <div className="ee-mono" style={{ color: 'var(--ee-gold)', marginBottom: 32 }}>FIN</div>
        <p
          style={{
            fontFamily: 'var(--ee-display)',
            fontStyle: 'italic',
            fontSize: 88,
            lineHeight: 1.05,
            maxWidth: 1100,
            margin: '0 auto 48px',
            letterSpacing: '-0.02em',
          }}
        >
          "We spend our lives building systems for the world. It's time we engineered a community for ourselves."
        </p>
        <Link href="/signup" className="ee-btn ee-btn-primary">
          Create your account →
        </Link>
      </section>

      <EEFooter />
    </div>
  );
}
