import React from 'react';
import { Link } from 'react-router-dom';

export function BrandMark({ size = 24 }) {
  // A page with a marker stroke: the product in one glyph.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="0.5" y="0.5" width="23" height="23" rx="6" fill="#17171A" />
      <rect x="6" y="7" width="12" height="1.6" rx="0.8" fill="#FFFFFF" opacity="0.55" />
      <rect x="6" y="11.2" width="12" height="2.4" rx="0.6" fill="#E8B931" />
      <rect x="6" y="16.2" width="8" height="1.6" rx="0.8" fill="#FFFFFF" opacity="0.55" />
    </svg>
  );
}

export default function Brand({ to = '/Home' }) {
  return (
    <Link to={to} className="flex items-center gap-2 text-ink focus:outline-none">
      <BrandMark />
      <span className="text-md font-semibold tracking-[-0.01em]">GenQuest</span>
    </Link>
  );
}
