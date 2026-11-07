import { useMemo } from 'react';
import { Heart } from '../icons/Icons';

const COLORS = ['#d6a1a9', '#b86b79', '#c8a45c', '#e8c9cc', '#8f4357'];

export function FloatingHearts({ count = 12, className = '' }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: `${4 + Math.random() * 92}%`,
        delay: `${-Math.random() * 18}s`,
        duration: `${12 + Math.random() * 12}s`,
        size: `${10 + Math.random() * 18}px`,
        color: COLORS[index % COLORS.length],
        drift: `${-30 + Math.random() * 60}px`,
      })),
    [count],
  );

  return (
    <div className={`floating-hearts ${className}`} aria-hidden="true">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="floating-heart"
          style={{
            left: heart.left,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
            fontSize: heart.size,
            color: heart.color,
            '--drift': heart.drift,
          }}
        >
          <Heart />
        </span>
      ))}
    </div>
  );
}
