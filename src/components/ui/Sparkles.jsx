import { useMemo } from 'react';
import { Sparkle } from '../icons/Icons';

const COLORS = ['#c8a45c', '#e6d3a8', '#d6a1a9', '#fff6e8'];

export function Sparkles({ count = 18, className = '' }) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        top: `${5 + Math.random() * 90}%`,
        left: `${3 + Math.random() * 94}%`,
        size: `${6 + Math.random() * 12}px`,
        delay: `${-Math.random() * 8}s`,
        duration: `${3 + Math.random() * 5}s`,
        color: COLORS[index % COLORS.length],
      })),
    [count],
  );

  return (
    <div className={`sparkles ${className}`} aria-hidden="true">
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="sparkle"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            fontSize: sparkle.size,
            animationDelay: sparkle.delay,
            animationDuration: sparkle.duration,
            color: sparkle.color,
          }}
        >
          <Sparkle />
        </span>
      ))}
    </div>
  );
}
