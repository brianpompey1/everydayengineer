import React from 'react';

type Tone = 'cool' | 'warm' | 'dark' | 'paper' | 'gold' | 'court';

const TONE_CLASS: Record<Tone, string> = {
  cool: 'ee-photo',
  warm: 'ee-photo ee-photo-warm',
  dark: 'ee-photo ee-photo-dark',
  paper: 'ee-photo ee-photo-paper',
  gold: 'ee-photo ee-photo-gold',
  court: 'ee-photo ee-photo-court',
};

interface EEPhotoProps {
  tone?: Tone;
  /** A real photo. Falls back to the gradient placeholder when absent. */
  src?: string | null;
  alt?: string;
  label?: string;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export default function EEPhoto({ tone = 'cool', src, alt = '', label, style, className = '', children }: EEPhotoProps) {
  return (
    <div
      className={`${TONE_CLASS[tone]} ${className}`}
      style={{ ...style, position: style?.position ?? 'relative', overflow: 'hidden' }}
    >
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {label && <span className="ee-photo-label">{label}</span>}
      {children}
    </div>
  );
}
