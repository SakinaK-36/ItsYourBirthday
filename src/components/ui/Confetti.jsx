import { useEffect, useRef } from 'react';

const COLORS = ['#6b1f36', '#c97882', '#e3aab1', '#c8a45c', '#e6d3a8', '#fff6e8', '#8f4357'];

export function Confetti({ trigger = 0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trigger) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pieces = [];
    const addPieces = (amount, mode) => {
      for (let index = 0; index < amount; index += 1) {
        const fromTop = mode === 'rain';
        const angle = fromTop ? Math.PI / 2 : -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
        const speed = fromTop ? 3 + Math.random() * 4 : 7 + Math.random() * 11;
        pieces.push({
          x: fromTop
            ? Math.random() * width
            : width / 2 + (Math.random() - 0.5) * width * 0.25,
          y: fromTop ? -20 - Math.random() * height * 0.2 : height * 0.58,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
          vy: Math.sin(angle) * speed,
          gravity: 0.16 + Math.random() * 0.08,
          drag: 0.992,
          width: 4 + Math.random() * 6,
          height: 8 + Math.random() * 9,
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.28,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: Math.random() > 0.72 ? 'circle' : 'ribbon',
          sway: Math.random() * Math.PI * 2,
        });
      }
    };

    addPieces(150, 'burst');
    addPieces(70, 'rain');

    let frame = 0;
    const started = performance.now();

    const draw = (now) => {
      context.clearRect(0, 0, width, height);
      pieces.forEach((piece) => {
        piece.sway += 0.03;
        piece.vx += Math.sin(piece.sway) * 0.012;
        piece.vy += piece.gravity;
        piece.vx *= piece.drag;
        piece.vy *= piece.drag;
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rotation += piece.spin;

        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rotation);
        context.fillStyle = piece.color;
        if (piece.shape === 'circle') {
          context.beginPath();
          context.arc(0, 0, piece.width * 0.6, 0, Math.PI * 2);
          context.fill();
        } else {
          context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        }
        context.restore();
      });

      const alive = pieces.some(
        (piece) => piece.y < height + 60 && piece.x > -80 && piece.x < width + 80,
      );
      if (alive && now - started < 5200) {
        frame = requestAnimationFrame(draw);
      } else {
        context.clearRect(0, 0, width, height);
      }
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      context.clearRect(0, 0, width, height);
    };
  }, [trigger]);

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}
