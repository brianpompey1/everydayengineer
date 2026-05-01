'use client';

export default function NewsletterForm() {
  return (
    <form
      style={{
        display: 'flex',
        gap: 0,
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 4,
        overflow: 'hidden',
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        className="ee-input"
        placeholder="Enter your email"
        style={{
          border: 'none',
          background: 'transparent',
          color: '#fff',
          padding: '20px 22px',
          fontSize: 15,
        }}
      />
      <button className="ee-btn ee-btn-primary" style={{ borderRadius: 0, padding: '20px 28px' }}>
        Subscribe
      </button>
    </form>
  );
}
